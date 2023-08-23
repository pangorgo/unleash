"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
const error_1 = require("../../error");
const util_1 = require("../../util");
const import_context_validation_1 = require("./import-context-validation");
const import_permissions_service_1 = require("./import-permissions-service");
const import_validation_messages_1 = require("./import-validation-messages");
class ExportImportService {
    constructor(stores, { getLogger, flagResolver, }, { featureToggleService, strategyService, contextService, accessService, tagTypeService, featureTagService, }) {
        this.isCustomStrategy = (supportedStrategies) => {
            const customStrategies = supportedStrategies
                .filter((s) => s.editable)
                .map((strategy) => strategy.name);
            return (featureStrategy) => customStrategies.includes(featureStrategy);
        };
        this.eventStore = stores.eventStore;
        this.toggleStore = stores.featureToggleStore;
        this.importTogglesStore = stores.importTogglesStore;
        this.featureStrategiesStore = stores.featureStrategiesStore;
        this.featureEnvironmentStore = stores.featureEnvironmentStore;
        this.tagTypeStore = stores.tagTypeStore;
        this.featureTagStore = stores.featureTagStore;
        this.segmentStore = stores.segmentStore;
        this.flagResolver = flagResolver;
        this.featureToggleService = featureToggleService;
        this.contextFieldStore = stores.contextFieldStore;
        this.strategyService = strategyService;
        this.contextService = contextService;
        this.accessService = accessService;
        this.tagTypeService = tagTypeService;
        this.featureTagService = featureTagService;
        this.importPermissionsService = new import_permissions_service_1.ImportPermissionsService(this.importTogglesStore, this.accessService, this.tagTypeService, this.contextService);
        this.logger = getLogger('services/state-service.js');
    }
    async validate(dto, user) {
        const [unsupportedStrategies, usedCustomStrategies, unsupportedContextFields, archivedFeatures, otherProjectFeatures, missingPermissions,] = await Promise.all([
            this.getUnsupportedStrategies(dto),
            this.getUsedCustomStrategies(dto),
            this.getUnsupportedContextFields(dto),
            this.getArchivedFeatures(dto),
            this.getOtherProjectFeatures(dto),
            this.importPermissionsService.getMissingPermissions(dto, user, 'regular'),
        ]);
        const errors = import_validation_messages_1.ImportValidationMessages.compileErrors(dto.project, unsupportedStrategies, unsupportedContextFields || [], [], otherProjectFeatures, false);
        const warnings = import_validation_messages_1.ImportValidationMessages.compileWarnings(usedCustomStrategies, archivedFeatures);
        const permissions = import_validation_messages_1.ImportValidationMessages.compilePermissionErrors(missingPermissions);
        return {
            errors,
            warnings,
            permissions,
        };
    }
    async import(dto, user) {
        const cleanedDto = await this.cleanData(dto);
        await Promise.all([
            this.verifyStrategies(cleanedDto),
            this.verifyContextFields(cleanedDto),
            this.importPermissionsService.verifyPermissions(dto, user, 'regular'),
            this.verifyFeatures(dto),
        ]);
        await this.createToggles(cleanedDto, user);
        await this.importToggleVariants(dto, user);
        await this.importTagTypes(cleanedDto, user);
        await this.importTags(cleanedDto, user);
        await this.importContextFields(dto, user);
        await this.importDefault(cleanedDto, user);
        await this.eventStore.store({
            project: cleanedDto.project,
            environment: cleanedDto.environment,
            type: types_1.FEATURES_IMPORTED,
            createdBy: (0, util_1.extractUsernameFromUser)(user),
        });
    }
    async importDefault(dto, user) {
        await this.deleteStrategies(dto);
        await this.importStrategies(dto, user);
        await this.importToggleStatuses(dto, user);
    }
    async importToggleStatuses(dto, user) {
        await Promise.all((dto.data.featureEnvironments || []).map((featureEnvironment) => this.featureToggleService.updateEnabled(dto.project, featureEnvironment.name, dto.environment, featureEnvironment.enabled, (0, util_1.extractUsernameFromUser)(user), user)));
    }
    async importStrategies(dto, user) {
        const hasFeatureName = (featureStrategy) => Boolean(featureStrategy.featureName);
        await Promise.all(dto.data.featureStrategies
            ?.filter(hasFeatureName)
            .map((featureStrategy) => this.featureToggleService.createStrategy({
            name: featureStrategy.name,
            constraints: featureStrategy.constraints,
            parameters: featureStrategy.parameters,
            segments: featureStrategy.segments,
            sortOrder: featureStrategy.sortOrder,
        }, {
            featureName: featureStrategy.featureName,
            environment: dto.environment,
            projectId: dto.project,
        }, (0, util_1.extractUsernameFromUser)(user))));
    }
    async deleteStrategies(dto) {
        return this.importTogglesStore.deleteStrategiesForFeatures(dto.data.features.map((feature) => feature.name), dto.environment);
    }
    async importTags(dto, user) {
        await this.importTogglesStore.deleteTagsForFeatures(dto.data.features.map((feature) => feature.name));
        const featureTags = dto.data.featureTags || [];
        for (const tag of featureTags) {
            if (tag.tagType) {
                await this.featureTagService.addTag(tag.featureName, { type: tag.tagType, value: tag.tagValue }, (0, util_1.extractUsernameFromUser)(user));
            }
        }
    }
    async importContextFields(dto, user) {
        const newContextFields = (await this.getNewContextFields(dto)) || [];
        await Promise.all(newContextFields.map((contextField) => this.contextService.createContextField({
            name: contextField.name,
            description: contextField.description,
            legalValues: contextField.legalValues,
            stickiness: contextField.stickiness,
        }, (0, util_1.extractUsernameFromUser)(user))));
    }
    async importTagTypes(dto, user) {
        const newTagTypes = await this.getNewTagTypes(dto);
        return Promise.all(newTagTypes.map((tagType) => {
            return tagType
                ? this.tagTypeService.createTagType(tagType, (0, util_1.extractUsernameFromUser)(user))
                : Promise.resolve();
        }));
    }
    async importToggleVariants(dto, user) {
        const featureEnvsWithVariants = dto.data.featureEnvironments?.filter((featureEnvironment) => Array.isArray(featureEnvironment.variants) &&
            featureEnvironment.variants.length > 0) || [];
        await Promise.all(featureEnvsWithVariants.map((featureEnvironment) => {
            return featureEnvironment.featureName
                ? this.featureToggleService.saveVariantsOnEnv(dto.project, featureEnvironment.featureName, dto.environment, featureEnvironment.variants, user)
                : Promise.resolve();
        }));
    }
    async createToggles(dto, user) {
        await Promise.all(dto.data.features.map((feature) => this.featureToggleService
            .validateName(feature.name)
            .then(() => {
            const { archivedAt, createdAt, ...rest } = feature;
            return this.featureToggleService.createFeatureToggle(dto.project, rest, (0, util_1.extractUsernameFromUser)(user));
        })
            .catch(() => { })));
    }
    async verifyContextFields(dto) {
        const unsupportedContextFields = await this.getUnsupportedContextFields(dto);
        if (Array.isArray(unsupportedContextFields)) {
            const [firstError, ...remainingErrors] = unsupportedContextFields.map((field) => {
                const description = `${field.name} is not supported.`;
                return {
                    description,
                    message: description,
                };
            });
            if (firstError !== undefined) {
                throw new error_1.BadDataError('Some of the context fields you are trying to import are not supported.', [firstError, ...remainingErrors]);
            }
        }
    }
    async verifyFeatures(dto) {
        const otherProjectFeatures = await this.getOtherProjectFeatures(dto);
        if (otherProjectFeatures.length > 0) {
            throw new error_1.BadDataError(`These features exist already in other projects: ${otherProjectFeatures.join(', ')}`);
        }
    }
    async cleanData(dto) {
        const removedFeaturesDto = await this.removeArchivedFeatures(dto);
        return ExportImportService.remapSegments(removedFeaturesDto);
    }
    static async remapSegments(dto) {
        return {
            ...dto,
            data: {
                ...dto.data,
                featureStrategies: dto.data.featureStrategies.map((strategy) => ({
                    ...strategy,
                    segments: [],
                })),
            },
        };
    }
    async removeArchivedFeatures(dto) {
        const archivedFeatures = await this.getArchivedFeatures(dto);
        const featureTags = dto.data.featureTags?.filter((tag) => !archivedFeatures.includes(tag.featureName)) || [];
        return {
            ...dto,
            data: {
                ...dto.data,
                features: dto.data.features.filter((feature) => !archivedFeatures.includes(feature.name)),
                featureEnvironments: dto.data.featureEnvironments?.filter((environment) => environment.featureName &&
                    !archivedFeatures.includes(environment.featureName)),
                featureStrategies: dto.data.featureStrategies.filter((strategy) => strategy.featureName &&
                    !archivedFeatures.includes(strategy.featureName)),
                featureTags,
                tagTypes: dto.data.tagTypes?.filter((tagType) => featureTags
                    .map((tag) => tag.tagType)
                    .includes(tagType.name)),
            },
        };
    }
    async verifyStrategies(dto) {
        const unsupportedStrategies = await this.getUnsupportedStrategies(dto);
        const [firstError, ...remainingErrors] = unsupportedStrategies.map((strategy) => {
            const description = `${strategy.name} is not supported.`;
            return {
                description,
                message: description,
            };
        });
        if (firstError !== undefined) {
            throw new error_1.BadDataError('Some of the strategies you are trying to import are not supported.', [firstError, ...remainingErrors]);
        }
    }
    async getUnsupportedStrategies(dto) {
        const supportedStrategies = await this.strategyService.getStrategies();
        return dto.data.featureStrategies.filter((featureStrategy) => !supportedStrategies.find((strategy) => featureStrategy.name === strategy.name));
    }
    async getUsedCustomStrategies(dto) {
        const supportedStrategies = await this.strategyService.getStrategies();
        const uniqueFeatureStrategies = [
            ...new Set(dto.data.featureStrategies.map((strategy) => strategy.name)),
        ];
        return uniqueFeatureStrategies.filter(this.isCustomStrategy(supportedStrategies));
    }
    async getUnsupportedContextFields(dto) {
        const availableContextFields = await this.contextService.getAll();
        return dto.data.contextFields?.filter((contextField) => !(0, import_context_validation_1.isValidField)(contextField, availableContextFields));
    }
    async getArchivedFeatures(dto) {
        return this.importTogglesStore.getArchivedFeatures(dto.data.features.map((feature) => feature.name));
    }
    async getOtherProjectFeatures(dto) {
        const otherProjectsFeatures = await this.importTogglesStore.getFeaturesInOtherProjects(dto.data.features.map((feature) => feature.name), dto.project);
        return otherProjectsFeatures.map((it) => `${it.name} (in project ${it.project})`);
    }
    async getNewTagTypes(dto) {
        const existingTagTypes = (await this.tagTypeService.getAll()).map((tagType) => tagType.name);
        const newTagTypes = (dto.data.tagTypes || []).filter((tagType) => !existingTagTypes.includes(tagType.name));
        return [
            ...new Map(newTagTypes.map((item) => [item.name, item])).values(),
        ];
    }
    async getNewContextFields(dto) {
        const availableContextFields = await this.contextService.getAll();
        return dto.data.contextFields?.filter((contextField) => !availableContextFields.some((availableField) => availableField.name === contextField.name));
    }
    async export(query, userName) {
        const featureNames = typeof query.tag === 'string'
            ? await this.featureTagService.listFeatures(query.tag)
            : query.features || [];
        const [features, featureEnvironments, featureStrategies, strategySegments, contextFields, featureTags, segments, tagTypes,] = await Promise.all([
            this.toggleStore.getAllByNames(featureNames),
            await this.featureEnvironmentStore.getAllByFeatures(featureNames, query.environment),
            this.featureStrategiesStore.getAllByFeatures(featureNames, query.environment),
            this.segmentStore.getAllFeatureStrategySegments(),
            this.contextFieldStore.getAll(),
            this.featureTagStore.getAllByFeatures(featureNames),
            this.segmentStore.getAll(),
            this.tagTypeStore.getAll(),
        ]);
        this.addSegmentsToStrategies(featureStrategies, strategySegments);
        const filteredContextFields = contextFields
            .filter((field) => featureEnvironments.some((featureEnv) => featureEnv.variants?.some((variant) => variant.stickiness === field.name ||
            variant.overrides?.some((override) => override.contextName === field.name))) ||
            featureStrategies.some((strategy) => strategy.parameters.stickiness === field.name ||
                strategy.constraints.some((constraint) => constraint.contextName === field.name)))
            .map((item) => {
            const { usedInFeatures, usedInProjects, ...rest } = item;
            return rest;
        });
        const filteredSegments = segments.filter((segment) => featureStrategies.some((strategy) => strategy.segments?.includes(segment.id)));
        const filteredTagTypes = tagTypes.filter((tagType) => featureTags.map((tag) => tag.tagType).includes(tagType.name));
        const result = {
            features: features.map((item) => {
                const { createdAt, archivedAt, lastSeenAt, ...rest } = item;
                return rest;
            }),
            featureStrategies: featureStrategies.map((item) => {
                const name = item.strategyName;
                const { createdAt, projectId, environment, strategyName, ...rest } = item;
                return {
                    name,
                    ...rest,
                };
            }),
            featureEnvironments: featureEnvironments.map((item) => {
                const { lastSeenAt, ...rest } = item;
                return {
                    ...rest,
                    name: item.featureName,
                };
            }),
            contextFields: filteredContextFields.map((item) => {
                const { createdAt, ...rest } = item;
                return rest;
            }),
            featureTags,
            segments: filteredSegments.map((item) => {
                const { id, name } = item;
                return { id, name };
            }),
            tagTypes: filteredTagTypes,
        };
        await this.eventStore.store({
            type: types_1.FEATURES_EXPORTED,
            createdBy: userName,
            data: result,
        });
        return result;
    }
    addSegmentsToStrategies(featureStrategies, strategySegments) {
        featureStrategies.forEach((featureStrategy) => {
            featureStrategy.segments = strategySegments
                .filter((segment) => segment.featureStrategyId === featureStrategy.id)
                .map((segment) => segment.segmentId);
        });
    }
}
exports.default = ExportImportService;
module.exports = ExportImportService;
//# sourceMappingURL=export-import-service.js.map