"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const bad_data_error_1 = __importDefault(require("../error/bad-data-error"));
const name_exists_error_1 = __importDefault(require("../error/name-exists-error"));
const invalid_operation_error_1 = __importDefault(require("../error/invalid-operation-error"));
const error_1 = require("../error");
const feature_schema_1 = require("../schema/feature-schema");
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const util_1 = require("../util");
const fast_json_patch_1 = require("fast-json-patch");
const constraint_types_1 = require("../util/validators/constraint-types");
const helpers_1 = require("../features/playground/feature-evaluator/helpers");
const unique_1 = require("../util/unique");
const oneOf = (values, match) => {
    return values.some((value) => value === match);
};
class FeatureToggleService {
    constructor({ featureStrategiesStore, featureToggleStore, featureToggleClientStore, projectStore, eventStore, featureTagStore, featureEnvironmentStore, contextFieldStore, }, { getLogger, flagResolver, }, segmentService, accessService, changeRequestAccessReadModel) {
        this.logger = getLogger('services/feature-toggle-service.ts');
        this.featureStrategiesStore = featureStrategiesStore;
        this.featureToggleStore = featureToggleStore;
        this.featureToggleClientStore = featureToggleClientStore;
        this.tagStore = featureTagStore;
        this.projectStore = projectStore;
        this.eventStore = eventStore;
        this.featureEnvironmentStore = featureEnvironmentStore;
        this.contextFieldStore = contextFieldStore;
        this.segmentService = segmentService;
        this.accessService = accessService;
        this.flagResolver = flagResolver;
        this.changeRequestAccessReadModel = changeRequestAccessReadModel;
    }
    async validateFeaturesContext(featureNames, projectId) {
        const features = await this.featureToggleStore.getAllByNames(featureNames);
        const invalidProjects = (0, unique_1.unique)(features
            .map((feature) => feature.project)
            .filter((project) => project !== projectId));
        if (invalidProjects.length > 0) {
            throw new invalid_operation_error_1.default(`The operation could not be completed. The features exist, but the provided project ids ("${invalidProjects.join(',')}") does not match the project provided in request URL ("${projectId}").`);
        }
    }
    async validateFeatureBelongsToProject({ featureName, projectId, }) {
        const id = await this.featureToggleStore.getProjectId(featureName);
        if (id !== projectId) {
            throw new notfound_error_1.default(`There's no feature named "${featureName}" in project "${projectId}"${id === undefined
                ? '.'
                : `, but there's a feature with that name in project "${id}"`}`);
        }
    }
    validateUpdatedProperties({ featureName, projectId }, strategy) {
        if (strategy.projectId !== projectId) {
            throw new invalid_operation_error_1.default('You can not change the projectId for an activation strategy.');
        }
        if (strategy.featureName !== featureName) {
            throw new invalid_operation_error_1.default('You can not change the featureName for an activation strategy.');
        }
        if (strategy.parameters &&
            'stickiness' in strategy.parameters &&
            strategy.parameters.stickiness === '') {
            throw new invalid_operation_error_1.default('You can not have an empty string for stickiness.');
        }
    }
    async validateProjectCanAccessSegments(projectId, segmentIds) {
        if (segmentIds && segmentIds.length > 0) {
            await Promise.all(segmentIds.map((segmentId) => this.segmentService.get(segmentId))).then((segments) => segments.map((segment) => {
                if (segment.project && segment.project !== projectId) {
                    throw new bad_data_error_1.default(`The segment "${segment.name}" with id ${segment.id} does not belong to project "${projectId}".`);
                }
            }));
        }
    }
    async validateConstraints(constraints) {
        const validations = constraints.map((constraint) => {
            return this.validateConstraint(constraint);
        });
        return Promise.all(validations);
    }
    async validateConstraint(input) {
        const constraint = await feature_schema_1.constraintSchema.validateAsync(input);
        const { operator } = constraint;
        const contextDefinition = await this.contextFieldStore.get(constraint.contextName);
        if (oneOf(util_1.NUM_OPERATORS, operator)) {
            await (0, constraint_types_1.validateNumber)(constraint.value);
        }
        if (oneOf(util_1.STRING_OPERATORS, operator)) {
            await (0, constraint_types_1.validateString)(constraint.values);
        }
        if (oneOf(util_1.SEMVER_OPERATORS, operator)) {
            // Semver library is not asynchronous, so we do not
            // need to await here.
            (0, constraint_types_1.validateSemver)(constraint.value);
        }
        if (oneOf(util_1.DATE_OPERATORS, operator)) {
            await (0, constraint_types_1.validateDate)(constraint.value);
        }
        if (contextDefinition &&
            contextDefinition.legalValues &&
            contextDefinition.legalValues.length > 0) {
            const valuesToValidate = oneOf([...util_1.DATE_OPERATORS, ...util_1.SEMVER_OPERATORS, ...util_1.NUM_OPERATORS], operator)
                ? constraint.value
                : constraint.values;
            (0, constraint_types_1.validateLegalValues)(contextDefinition.legalValues, valuesToValidate);
        }
        return constraint;
    }
    async patchFeature(project, featureName, createdBy, operations) {
        const featureToggle = await this.getFeatureMetadata(featureName);
        if (operations.some((op) => op.path.indexOf('/variants') >= 0)) {
            throw new error_1.OperationDeniedError(`Changing variants is done via PATCH operation to /api/admin/projects/:project/features/:feature/variants`);
        }
        const { newDocument } = (0, fast_json_patch_1.applyPatch)((0, fast_json_patch_1.deepClone)(featureToggle), operations);
        const updated = await this.updateFeatureToggle(project, newDocument, createdBy, featureName);
        if (featureToggle.stale !== newDocument.stale) {
            const tags = await this.tagStore.getAllTagsForFeature(featureName);
            await this.eventStore.store(new types_1.FeatureStaleEvent({
                stale: newDocument.stale,
                project,
                featureName,
                createdBy,
                tags,
            }));
        }
        return updated;
    }
    featureStrategyToPublic(featureStrategy, segments = []) {
        const result = {
            id: featureStrategy.id,
            name: featureStrategy.strategyName,
            title: featureStrategy.title,
            disabled: featureStrategy.disabled,
            constraints: featureStrategy.constraints || [],
            parameters: featureStrategy.parameters,
            segments: segments.map((segment) => segment.id) ?? [],
        };
        if (this.flagResolver.isEnabled('strategyVariant')) {
            result.sortOrder = featureStrategy.sortOrder;
        }
        return result;
    }
    async updateStrategiesSortOrder(context, sortOrders, createdBy, user) {
        await this.stopWhenChangeRequestsEnabled(context.projectId, context.environment, user);
        return this.unprotectedUpdateStrategiesSortOrder(context, sortOrders, createdBy);
    }
    async unprotectedUpdateStrategiesSortOrder(context, sortOrders, createdBy) {
        const { featureName, environment, projectId: project } = context;
        const existingOrder = (await this.getStrategiesForEnvironment(project, featureName, environment))
            .sort((strategy1, strategy2) => {
            if (typeof strategy1.sortOrder === 'number' &&
                typeof strategy2.sortOrder === 'number') {
                return strategy1.sortOrder - strategy2.sortOrder;
            }
            return 0;
        })
            .map((strategy) => strategy.id);
        const eventPreData = { strategyIds: existingOrder };
        await Promise.all(sortOrders.map(async ({ id, sortOrder }) => {
            await this.featureStrategiesStore.updateSortOrder(id, sortOrder);
        }));
        if (this.flagResolver.isEnabled('strategyVariant')) {
            const newOrder = (await this.getStrategiesForEnvironment(project, featureName, environment))
                .sort((strategy1, strategy2) => {
                if (typeof strategy1.sortOrder === 'number' &&
                    typeof strategy2.sortOrder === 'number') {
                    return strategy1.sortOrder - strategy2.sortOrder;
                }
                return 0;
            })
                .map((strategy) => strategy.id);
            const eventData = { strategyIds: newOrder };
            const tags = await this.tagStore.getAllTagsForFeature(featureName);
            const event = new types_1.StrategiesOrderChangedEvent({
                featureName,
                environment,
                project,
                createdBy,
                preData: eventPreData,
                data: eventData,
                tags: tags,
            });
            await this.eventStore.store(event);
        }
    }
    async createStrategy(strategyConfig, context, createdBy, user) {
        await this.stopWhenChangeRequestsEnabled(context.projectId, context.environment, user);
        return this.unprotectedCreateStrategy(strategyConfig, context, createdBy);
    }
    async unprotectedCreateStrategy(strategyConfig, context, createdBy) {
        const { featureName, projectId, environment } = context;
        await this.validateFeatureBelongsToProject(context);
        await this.validateProjectCanAccessSegments(projectId, strategyConfig.segments);
        if (strategyConfig.constraints &&
            strategyConfig.constraints.length > 0) {
            strategyConfig.constraints = await this.validateConstraints(strategyConfig.constraints);
        }
        if (strategyConfig.parameters &&
            'stickiness' in strategyConfig.parameters &&
            strategyConfig.parameters.stickiness === '') {
            strategyConfig.parameters.stickiness = 'default';
        }
        if (strategyConfig.variants && strategyConfig.variants.length > 0) {
            await feature_schema_1.variantsArraySchema.validateAsync(strategyConfig.variants);
            const fixedVariants = this.fixVariantWeights(strategyConfig.variants);
            strategyConfig.variants = fixedVariants;
        }
        try {
            const newFeatureStrategy = await this.featureStrategiesStore.createStrategyFeatureEnv({
                strategyName: strategyConfig.name,
                title: strategyConfig.title,
                disabled: strategyConfig.disabled,
                constraints: strategyConfig.constraints || [],
                variants: strategyConfig.variants || [],
                parameters: strategyConfig.parameters || {},
                sortOrder: strategyConfig.sortOrder,
                projectId,
                featureName,
                environment,
            });
            if (strategyConfig.segments &&
                Array.isArray(strategyConfig.segments)) {
                await this.segmentService.updateStrategySegments(newFeatureStrategy.id, strategyConfig.segments);
            }
            const segments = await this.segmentService.getByStrategy(newFeatureStrategy.id);
            const strategy = this.featureStrategyToPublic(newFeatureStrategy, segments);
            const tags = await this.tagStore.getAllTagsForFeature(featureName);
            await this.eventStore.store(new types_1.FeatureStrategyAddEvent({
                project: projectId,
                featureName,
                createdBy,
                environment,
                data: strategy,
                tags,
            }));
            return strategy;
        }
        catch (e) {
            if (e.code === error_1.FOREIGN_KEY_VIOLATION) {
                throw new bad_data_error_1.default('You have not added the current environment to the project');
            }
            throw e;
        }
    }
    /**
     * PUT /api/admin/projects/:projectId/features/:featureName/strategies/:strategyId ?
     * {
     *
     * }
     * @param id
     * @param updates
     * @param context - Which context does this strategy live in (projectId, featureName, environment)
     * @param userName - Human readable id of the user performing the update
     * @param user - Optional User object performing the action
     */
    async updateStrategy(id, updates, context, userName, user) {
        await this.stopWhenChangeRequestsEnabled(context.projectId, context.environment, user);
        return this.unprotectedUpdateStrategy(id, updates, context, userName);
    }
    async optionallyDisableFeature(featureName, environment, projectId, userName) {
        const feature = await this.getFeature({ featureName });
        const env = feature.environments.find((e) => e.name === environment);
        const hasOnlyDisabledStrategies = env?.strategies.every((strategy) => strategy.disabled);
        if (hasOnlyDisabledStrategies) {
            await this.unprotectedUpdateEnabled(projectId, featureName, environment, false, userName);
        }
    }
    async unprotectedUpdateStrategy(id, updates, context, userName) {
        const { projectId, environment, featureName } = context;
        const existingStrategy = await this.featureStrategiesStore.get(id);
        this.validateUpdatedProperties(context, existingStrategy);
        await this.validateProjectCanAccessSegments(projectId, updates.segments);
        if (existingStrategy.id === id) {
            if (updates.constraints && updates.constraints.length > 0) {
                updates.constraints = await this.validateConstraints(updates.constraints);
            }
            if (updates.variants && updates.variants.length > 0) {
                await feature_schema_1.variantsArraySchema.validateAsync(updates.variants);
                const fixedVariants = this.fixVariantWeights(updates.variants);
                updates.variants = fixedVariants;
            }
            const strategy = await this.featureStrategiesStore.updateStrategy(id, updates);
            if (updates.segments && Array.isArray(updates.segments)) {
                await this.segmentService.updateStrategySegments(strategy.id, updates.segments);
            }
            const segments = await this.segmentService.getByStrategy(strategy.id);
            // Store event!
            const tags = await this.tagStore.getAllTagsForFeature(featureName);
            const data = this.featureStrategyToPublic(strategy, segments);
            const preData = this.featureStrategyToPublic(existingStrategy, segments);
            await this.eventStore.store(new types_1.FeatureStrategyUpdateEvent({
                project: projectId,
                featureName,
                environment,
                createdBy: userName,
                data,
                preData,
                tags,
            }));
            await this.optionallyDisableFeature(featureName, environment, projectId, userName);
            return data;
        }
        throw new notfound_error_1.default(`Could not find strategy with id ${id}`);
    }
    async updateStrategyParameter(id, name, value, context, userName) {
        const { projectId, environment, featureName } = context;
        const existingStrategy = await this.featureStrategiesStore.get(id);
        this.validateUpdatedProperties(context, existingStrategy);
        if (existingStrategy.id === id) {
            existingStrategy.parameters[name] = String(value);
            const strategy = await this.featureStrategiesStore.updateStrategy(id, existingStrategy);
            const tags = await this.tagStore.getAllTagsForFeature(featureName);
            const segments = await this.segmentService.getByStrategy(strategy.id);
            const data = this.featureStrategyToPublic(strategy, segments);
            const preData = this.featureStrategyToPublic(existingStrategy, segments);
            await this.eventStore.store(new types_1.FeatureStrategyUpdateEvent({
                featureName,
                project: projectId,
                environment,
                createdBy: userName,
                data,
                preData,
                tags,
            }));
            return data;
        }
        throw new notfound_error_1.default(`Could not find strategy with id ${id}`);
    }
    /**
     * DELETE /api/admin/projects/:projectId/features/:featureName/environments/:environmentName/strategies/:strategyId
     * {
     *
     * }
     * @param id - strategy id
     * @param context - Which context does this strategy live in (projectId, featureName, environment)
     * @param createdBy - Which user does this strategy belong to
     * @param user
     */
    async deleteStrategy(id, context, createdBy, user) {
        await this.stopWhenChangeRequestsEnabled(context.projectId, context.environment, user);
        return this.unprotectedDeleteStrategy(id, context, createdBy);
    }
    async unprotectedDeleteStrategy(id, context, createdBy) {
        const existingStrategy = await this.featureStrategiesStore.get(id);
        const { featureName, projectId, environment } = context;
        this.validateUpdatedProperties(context, existingStrategy);
        await this.featureStrategiesStore.delete(id);
        const featureStrategies = await this.featureStrategiesStore.getStrategiesForFeatureEnv(projectId, featureName, environment);
        const hasOnlyDisabledStrategies = featureStrategies.every((strategy) => strategy.disabled);
        if (hasOnlyDisabledStrategies) {
            // Disable the feature in the environment if it only has disabled strategies
            await this.unprotectedUpdateEnabled(projectId, featureName, environment, false, createdBy);
        }
        const tags = await this.tagStore.getAllTagsForFeature(featureName);
        const preData = this.featureStrategyToPublic(existingStrategy);
        await this.eventStore.store(new types_1.FeatureStrategyRemoveEvent({
            featureName,
            project: projectId,
            environment,
            createdBy,
            preData,
            tags,
        }));
        // If there are no strategies left for environment disable it
        await this.featureEnvironmentStore.disableEnvironmentIfNoStrategies(featureName, environment);
    }
    async getStrategiesForEnvironment(project, featureName, environment = util_1.DEFAULT_ENV) {
        this.logger.debug('getStrategiesForEnvironment');
        const hasEnv = await this.featureEnvironmentStore.featureHasEnvironment(environment, featureName);
        if (hasEnv) {
            const featureStrategies = await this.featureStrategiesStore.getStrategiesForFeatureEnv(project, featureName, environment);
            const result = [];
            for (const strat of featureStrategies) {
                const segments = (await this.segmentService.getByStrategy(strat.id)).map((segment) => segment.id) ?? [];
                result.push({
                    id: strat.id,
                    name: strat.strategyName,
                    constraints: strat.constraints,
                    parameters: strat.parameters,
                    variants: strat.variants,
                    title: strat.title,
                    disabled: strat.disabled,
                    sortOrder: strat.sortOrder,
                    segments,
                });
            }
            return result;
        }
        throw new notfound_error_1.default(`Feature ${featureName} does not have environment ${environment}`);
    }
    /**
     * GET /api/admin/projects/:project/features/:featureName
     * @param featureName
     * @param archived - return archived or non archived toggles
     * @param projectId - provide if you're requesting the feature in the context of a specific project.
     * @param userId
     */
    async getFeature({ featureName, archived, projectId, environmentVariants, userId, }) {
        if (projectId) {
            await this.validateFeatureBelongsToProject({
                featureName,
                projectId,
            });
        }
        if (environmentVariants) {
            return this.featureStrategiesStore.getFeatureToggleWithVariantEnvs(featureName, userId, archived);
        }
        else {
            return this.featureStrategiesStore.getFeatureToggleWithEnvs(featureName, userId, archived);
        }
    }
    /**
     * GET /api/admin/projects/:project/features/:featureName/variants
     * @deprecated - Variants should be fetched from FeatureEnvironmentStore (since variants are now; since 4.18, connected to environments)
     * @param featureName
     * @return The list of variants
     */
    async getVariants(featureName) {
        return this.featureToggleStore.getVariants(featureName);
    }
    async getVariantsForEnv(featureName, environment) {
        const featureEnvironment = await this.featureEnvironmentStore.get({
            featureName,
            environment,
        });
        return featureEnvironment.variants || [];
    }
    async getFeatureMetadata(featureName) {
        return this.featureToggleStore.get(featureName);
    }
    async getClientFeatures(query) {
        const result = await this.featureToggleClientStore.getClient(query || {});
        return result.map(({ name, type, enabled, project, stale, strategies, variants, description, impressionData, }) => ({
            name,
            type,
            enabled,
            project,
            stale,
            strategies,
            variants,
            description,
            impressionData,
        }));
    }
    async getPlaygroundFeatures(query) {
        const result = await this.featureToggleClientStore.getPlayground(query || {});
        return result;
    }
    /**
     * @deprecated Legacy!
     *
     * Used to retrieve metadata of all feature toggles defined in Unleash.
     * @param query - Allow you to limit search based on criteria such as project, tags, namePrefix. See @IFeatureToggleQuery
     * @param archived - Return archived or active toggles
     * @returns
     */
    async getFeatureToggles(query, userId, archived = false) {
        return this.featureToggleClientStore.getAdmin({
            featureQuery: query,
            userId,
            archived,
        });
    }
    async getFeatureOverview(params) {
        return this.featureStrategiesStore.getFeatureOverview(params);
    }
    async getFeatureToggle(featureName) {
        return this.featureStrategiesStore.getFeatureToggleWithEnvs(featureName);
    }
    async createFeatureToggle(projectId, value, createdBy, isValidated = false) {
        this.logger.info(`${createdBy} creates feature toggle ${value.name}`);
        await this.validateName(value.name);
        const exists = await this.projectStore.hasProject(projectId);
        if (this.flagResolver.isEnabled('newProjectLayout') &&
            (await this.projectStore.isFeatureLimitReached(projectId))) {
            throw new invalid_operation_error_1.default('You have reached the maximum number of feature toggles for this project.');
        }
        if (exists) {
            let featureData;
            if (isValidated) {
                featureData = value;
            }
            else {
                featureData = await feature_schema_1.featureMetadataSchema.validateAsync(value);
            }
            const featureName = featureData.name;
            const createdToggle = await this.featureToggleStore.create(projectId, featureData);
            await this.featureEnvironmentStore.connectFeatureToEnvironmentsForProject(featureName, projectId);
            if (value.variants && value.variants.length > 0) {
                const environments = await this.featureEnvironmentStore.getEnvironmentsForFeature(featureName);
                await this.featureEnvironmentStore.setVariantsToFeatureEnvironments(featureName, environments.map((env) => env.environment), value.variants);
            }
            const tags = await this.tagStore.getAllTagsForFeature(featureName);
            await this.eventStore.store(new types_1.FeatureCreatedEvent({
                featureName,
                createdBy,
                project: projectId,
                data: createdToggle,
                tags,
            }));
            return createdToggle;
        }
        throw new notfound_error_1.default(`Project with id ${projectId} does not exist`);
    }
    async cloneFeatureToggle(featureName, projectId, newFeatureName, replaceGroupId = true, // eslint-disable-line
    userName) {
        const changeRequestEnabled = await this.changeRequestAccessReadModel.isChangeRequestsEnabledForProject(projectId);
        if (changeRequestEnabled) {
            throw new error_1.ForbiddenError(`Cloning not allowed. Project ${projectId} has change requests enabled.`);
        }
        this.logger.info(`${userName} clones feature toggle ${featureName} to ${newFeatureName}`);
        await this.validateName(newFeatureName);
        const cToggle = await this.featureStrategiesStore.getFeatureToggleWithVariantEnvs(featureName);
        const newToggle = {
            ...cToggle,
            name: newFeatureName,
            variants: undefined,
        };
        const created = await this.createFeatureToggle(projectId, newToggle, userName);
        const variantTasks = newToggle.environments.map((e) => {
            return this.featureEnvironmentStore.addVariantsToFeatureEnvironment(newToggle.name, e.name, e.variants);
        });
        const strategyTasks = newToggle.environments.flatMap((e) => e.strategies.map((s) => {
            if (replaceGroupId &&
                s.parameters &&
                s.parameters.hasOwnProperty('groupId')) {
                s.parameters.groupId = newFeatureName;
            }
            const context = {
                projectId,
                featureName: newFeatureName,
                environment: e.name,
            };
            return this.createStrategy(s, context, userName);
        }));
        await Promise.all([...strategyTasks, ...variantTasks]);
        return created;
    }
    async updateFeatureToggle(projectId, updatedFeature, userName, featureName) {
        await this.validateFeatureBelongsToProject({ featureName, projectId });
        this.logger.info(`${userName} updates feature toggle ${featureName}`);
        const featureData = await feature_schema_1.featureMetadataSchema.validateAsync(updatedFeature);
        const preData = await this.featureToggleStore.get(featureName);
        const featureToggle = await this.featureToggleStore.update(projectId, {
            ...featureData,
            name: featureName,
        });
        const tags = await this.tagStore.getAllTagsForFeature(featureName);
        await this.eventStore.store(new types_1.FeatureMetadataUpdateEvent({
            createdBy: userName,
            data: featureToggle,
            preData,
            featureName,
            project: projectId,
            tags,
        }));
        return featureToggle;
    }
    async getFeatureCountForProject(projectId) {
        return this.featureToggleStore.count({
            archived: false,
            project: projectId,
        });
    }
    async removeAllStrategiesForEnv(toggleName, environment = util_1.DEFAULT_ENV) {
        await this.featureStrategiesStore.removeAllStrategiesForFeatureEnv(toggleName, environment);
    }
    async getStrategy(strategyId) {
        const strategy = await this.featureStrategiesStore.getStrategyById(strategyId);
        const segments = await this.segmentService.getByStrategy(strategyId);
        let result = {
            id: strategy.id,
            name: strategy.strategyName,
            constraints: strategy.constraints || [],
            parameters: strategy.parameters,
            segments: [],
            title: strategy.title,
            disabled: strategy.disabled,
            // FIXME: Should we return sortOrder here, or adjust OpenAPI?
        };
        if (segments && segments.length > 0) {
            result = {
                ...result,
                segments: segments.map((segment) => segment.id),
            };
        }
        return result;
    }
    async getEnvironmentInfo(project, environment, featureName) {
        const envMetadata = await this.featureEnvironmentStore.getEnvironmentMetaData(environment, featureName);
        const strategies = await this.featureStrategiesStore.getStrategiesForFeatureEnv(project, featureName, environment);
        const defaultStrategy = await this.projectStore.getDefaultStrategy(project, environment);
        return {
            name: featureName,
            environment,
            enabled: envMetadata.enabled,
            strategies,
            defaultStrategy,
        };
    }
    // todo: store events for this change.
    async deleteEnvironment(projectId, environment) {
        await this.featureStrategiesStore.deleteConfigurationsForProjectAndEnvironment(projectId, environment);
        await this.projectStore.deleteEnvironmentForProject(projectId, environment);
    }
    /** Validations  */
    async validateName(name) {
        await feature_schema_1.nameSchema.validateAsync({ name });
        await this.validateUniqueFeatureName(name);
        return name;
    }
    async validateUniqueFeatureName(name) {
        let msg;
        try {
            const feature = await this.featureToggleStore.get(name);
            msg = feature.archived
                ? 'An archived toggle with that name already exists'
                : 'A toggle with that name already exists';
        }
        catch (error) {
            return;
        }
        throw new name_exists_error_1.default(msg);
    }
    async hasFeature(name) {
        return this.featureToggleStore.exists(name);
    }
    async updateStale(featureName, isStale, createdBy) {
        const feature = await this.featureToggleStore.get(featureName);
        const { project } = feature;
        feature.stale = isStale;
        await this.featureToggleStore.update(project, feature);
        const tags = await this.tagStore.getAllTagsForFeature(featureName);
        await this.eventStore.store(new types_1.FeatureStaleEvent({
            stale: isStale,
            project,
            featureName,
            createdBy,
            tags,
        }));
        return feature;
    }
    async archiveToggle(featureName, createdBy, projectId) {
        const feature = await this.featureToggleStore.get(featureName);
        if (projectId) {
            await this.validateFeatureBelongsToProject({
                featureName,
                projectId,
            });
        }
        await this.featureToggleStore.archive(featureName);
        const tags = await this.tagStore.getAllTagsForFeature(featureName);
        await this.eventStore.store(new types_1.FeatureArchivedEvent({
            featureName,
            createdBy,
            project: feature.project,
            tags,
        }));
    }
    async archiveToggles(featureNames, createdBy, projectId) {
        await this.validateFeaturesContext(featureNames, projectId);
        const features = await this.featureToggleStore.getAllByNames(featureNames);
        await this.featureToggleStore.batchArchive(featureNames);
        const tags = await this.tagStore.getAllByFeatures(featureNames);
        await this.eventStore.batchStore(features.map((feature) => new types_1.FeatureArchivedEvent({
            featureName: feature.name,
            createdBy,
            project: feature.project,
            tags: tags
                .filter((tag) => tag.featureName === feature.name)
                .map((tag) => ({
                value: tag.tagValue,
                type: tag.tagType,
            })),
        })));
    }
    async setToggleStaleness(featureNames, stale, createdBy, projectId) {
        await this.validateFeaturesContext(featureNames, projectId);
        const features = await this.featureToggleStore.getAllByNames(featureNames);
        const relevantFeatures = features.filter((feature) => feature.stale !== stale);
        const relevantFeatureNames = relevantFeatures.map((feature) => feature.name);
        await this.featureToggleStore.batchStale(relevantFeatureNames, stale);
        const tags = await this.tagStore.getAllByFeatures(relevantFeatureNames);
        await this.eventStore.batchStore(relevantFeatures.map((feature) => new types_1.FeatureStaleEvent({
            stale: stale,
            project: projectId,
            featureName: feature.name,
            createdBy,
            tags: tags
                .filter((tag) => tag.featureName === feature.name)
                .map((tag) => ({
                value: tag.tagValue,
                type: tag.tagType,
            })),
        })));
    }
    async bulkUpdateEnabled(project, featureNames, environment, enabled, createdBy, user, shouldActivateDisabledStrategies = false) {
        await Promise.all(featureNames.map((featureName) => this.updateEnabled(project, featureName, environment, enabled, createdBy, user, shouldActivateDisabledStrategies)));
    }
    async updateEnabled(project, featureName, environment, enabled, createdBy, user, shouldActivateDisabledStrategies = false) {
        await this.stopWhenChangeRequestsEnabled(project, environment, user);
        if (enabled) {
            await this.stopWhenCannotCreateStrategies(project, environment, featureName, user);
        }
        return this.unprotectedUpdateEnabled(project, featureName, environment, enabled, createdBy, shouldActivateDisabledStrategies);
    }
    async unprotectedUpdateEnabled(project, featureName, environment, enabled, createdBy, shouldActivateDisabledStrategies = false) {
        const hasEnvironment = await this.featureEnvironmentStore.featureHasEnvironment(environment, featureName);
        if (!hasEnvironment) {
            throw new notfound_error_1.default(`Could not find environment ${environment} for feature: ${featureName}`);
        }
        if (enabled) {
            const strategies = await this.getStrategiesForEnvironment(project, featureName, environment);
            const hasDisabledStrategies = strategies.some((strategy) => strategy.disabled);
            if (hasDisabledStrategies && shouldActivateDisabledStrategies) {
                strategies.map(async (strategy) => {
                    return this.updateStrategy(strategy.id, { disabled: false }, {
                        environment,
                        projectId: project,
                        featureName,
                    }, createdBy);
                });
            }
            const hasOnlyDisabledStrategies = strategies.every((strategy) => strategy.disabled);
            const shouldCreate = hasOnlyDisabledStrategies && !shouldActivateDisabledStrategies;
            if (strategies.length === 0 || shouldCreate) {
                const projectEnvironmentDefaultStrategy = await this.projectStore.getDefaultStrategy(project, environment);
                const strategy = projectEnvironmentDefaultStrategy != null
                    ? (0, helpers_1.getProjectDefaultStrategy)(projectEnvironmentDefaultStrategy, featureName)
                    : (0, helpers_1.getDefaultStrategy)(featureName);
                await this.unprotectedCreateStrategy(strategy, {
                    environment,
                    projectId: project,
                    featureName,
                }, createdBy);
            }
        }
        const updatedEnvironmentStatus = await this.featureEnvironmentStore.setEnvironmentEnabledStatus(environment, featureName, enabled);
        const feature = await this.featureToggleStore.get(featureName);
        if (updatedEnvironmentStatus > 0) {
            const tags = await this.tagStore.getAllTagsForFeature(featureName);
            await this.eventStore.store(new types_1.FeatureEnvironmentEvent({
                enabled,
                project,
                featureName,
                environment,
                createdBy,
                tags,
            }));
        }
        return feature;
    }
    // @deprecated
    async storeFeatureUpdatedEventLegacy(featureName, createdBy) {
        const tags = await this.tagStore.getAllTagsForFeature(featureName);
        const feature = await this.getFeatureToggleLegacy(featureName);
        // Legacy event. Will not be used from v4.3.
        // We do not include 'preData' on purpose.
        await this.eventStore.store({
            type: types_1.FEATURE_UPDATED,
            createdBy,
            featureName,
            data: feature,
            tags,
            project: feature.project,
        });
        return feature;
    }
    // @deprecated
    async toggle(projectId, featureName, environment, userName) {
        await this.featureToggleStore.get(featureName);
        const isEnabled = await this.featureEnvironmentStore.isEnvironmentEnabled(featureName, environment);
        return this.updateEnabled(projectId, featureName, environment, !isEnabled, userName);
    }
    // @deprecated
    async getFeatureToggleLegacy(featureName) {
        const feature = await this.featureStrategiesStore.getFeatureToggleWithEnvs(featureName);
        const { environments, ...legacyFeature } = feature;
        const defaultEnv = environments.find((e) => e.name === util_1.DEFAULT_ENV);
        const strategies = defaultEnv?.strategies || [];
        const enabled = defaultEnv?.enabled || false;
        return { ...legacyFeature, enabled, strategies };
    }
    async changeProject(featureName, newProject, createdBy) {
        const changeRequestEnabled = await this.changeRequestAccessReadModel.isChangeRequestsEnabledForProject(newProject);
        if (changeRequestEnabled) {
            throw new error_1.ForbiddenError(`Changing project not allowed. Project ${newProject} has change requests enabled.`);
        }
        const feature = await this.featureToggleStore.get(featureName);
        const oldProject = feature.project;
        feature.project = newProject;
        await this.featureToggleStore.update(newProject, feature);
        const tags = await this.tagStore.getAllTagsForFeature(featureName);
        await this.eventStore.store(new types_1.FeatureChangeProjectEvent({
            createdBy,
            oldProject,
            newProject,
            featureName,
            tags,
        }));
    }
    async getArchivedFeatures() {
        return this.getFeatureToggles({}, undefined, true);
    }
    // TODO: add project id.
    async deleteFeature(featureName, createdBy) {
        const toggle = await this.featureToggleStore.get(featureName);
        const tags = await this.tagStore.getAllTagsForFeature(featureName);
        await this.featureToggleStore.delete(featureName);
        await this.eventStore.store(new types_1.FeatureDeletedEvent({
            featureName,
            project: toggle.project,
            createdBy,
            preData: toggle,
            tags,
        }));
    }
    async deleteFeatures(featureNames, projectId, createdBy) {
        await this.validateFeaturesContext(featureNames, projectId);
        const features = await this.featureToggleStore.getAllByNames(featureNames);
        const eligibleFeatures = features.filter((toggle) => toggle.archivedAt !== null);
        const eligibleFeatureNames = eligibleFeatures.map((toggle) => toggle.name);
        const tags = await this.tagStore.getAllByFeatures(eligibleFeatureNames);
        await this.featureToggleStore.batchDelete(eligibleFeatureNames);
        await this.eventStore.batchStore(eligibleFeatures.map((feature) => new types_1.FeatureDeletedEvent({
            featureName: feature.name,
            createdBy,
            project: feature.project,
            preData: feature,
            tags: tags
                .filter((tag) => tag.featureName === feature.name)
                .map((tag) => ({
                value: tag.tagValue,
                type: tag.tagType,
            })),
        })));
    }
    async reviveFeatures(featureNames, projectId, createdBy) {
        await this.validateFeaturesContext(featureNames, projectId);
        const features = await this.featureToggleStore.getAllByNames(featureNames);
        const eligibleFeatures = features.filter((toggle) => toggle.archivedAt !== null);
        const eligibleFeatureNames = eligibleFeatures.map((toggle) => toggle.name);
        const tags = await this.tagStore.getAllByFeatures(eligibleFeatureNames);
        await this.featureToggleStore.batchRevive(eligibleFeatureNames);
        await this.eventStore.batchStore(eligibleFeatures.map((feature) => new types_1.FeatureRevivedEvent({
            featureName: feature.name,
            createdBy,
            project: feature.project,
            tags: tags
                .filter((tag) => tag.featureName === feature.name)
                .map((tag) => ({
                value: tag.tagValue,
                type: tag.tagType,
            })),
        })));
    }
    // TODO: add project id.
    async reviveToggle(featureName, createdBy) {
        const toggle = await this.featureToggleStore.revive(featureName);
        const tags = await this.tagStore.getAllTagsForFeature(featureName);
        await this.eventStore.store(new types_1.FeatureRevivedEvent({
            createdBy,
            featureName,
            project: toggle.project,
            tags,
        }));
    }
    async getMetadataForAllFeatures(archived) {
        return this.featureToggleStore.getAll({ archived });
    }
    async getMetadataForAllFeaturesByProjectId(archived, project) {
        return this.featureToggleStore.getAll({ archived, project });
    }
    async getProjectId(name) {
        return this.featureToggleStore.getProjectId(name);
    }
    async updateFeatureStrategyProject(featureName, newProjectId) {
        await this.featureStrategiesStore.setProjectForStrategiesBelongingToFeature(featureName, newProjectId);
    }
    async updateVariants(featureName, project, newVariants, user) {
        const ft = await this.featureStrategiesStore.getFeatureToggleWithVariantEnvs(featureName);
        const promises = ft.environments.map((env) => this.updateVariantsOnEnv(featureName, project, env.name, newVariants, user).then((resultingVariants) => (env.variants = resultingVariants)));
        await Promise.all(promises);
        ft.variants = ft.environments[0].variants;
        return ft;
    }
    async updateVariantsOnEnv(featureName, project, environment, newVariants, user) {
        const oldVariants = await this.getVariantsForEnv(featureName, environment);
        const { newDocument } = await (0, fast_json_patch_1.applyPatch)(oldVariants, newVariants);
        return this.crProtectedSaveVariantsOnEnv(project, featureName, environment, newDocument, user, oldVariants);
    }
    async saveVariants(featureName, project, newVariants, createdBy) {
        await feature_schema_1.variantsArraySchema.validateAsync(newVariants);
        const fixedVariants = this.fixVariantWeights(newVariants);
        const oldVariants = await this.featureToggleStore.getVariants(featureName);
        const featureToggle = await this.featureToggleStore.saveVariants(project, featureName, fixedVariants);
        const tags = await this.tagStore.getAllTagsForFeature(featureName);
        await this.eventStore.store(new types_1.FeatureVariantEvent({
            project,
            featureName,
            createdBy,
            tags,
            oldVariants,
            newVariants: featureToggle.variants,
        }));
        return featureToggle;
    }
    async saveVariantsOnEnv(projectId, featureName, environment, newVariants, user, oldVariants) {
        await feature_schema_1.variantsArraySchema.validateAsync(newVariants);
        const fixedVariants = this.fixVariantWeights(newVariants);
        const theOldVariants = oldVariants ||
            (await this.featureEnvironmentStore.get({
                featureName,
                environment,
            })).variants ||
            [];
        await this.eventStore.store(new types_1.EnvironmentVariantEvent({
            featureName,
            environment,
            project: projectId,
            createdBy: user,
            oldVariants: theOldVariants,
            newVariants: fixedVariants,
        }));
        await this.featureEnvironmentStore.setVariantsToFeatureEnvironments(featureName, [environment], fixedVariants);
        return fixedVariants;
    }
    async crProtectedSaveVariantsOnEnv(projectId, featureName, environment, newVariants, user, oldVariants) {
        await this.stopWhenChangeRequestsEnabled(projectId, environment, user);
        return this.saveVariantsOnEnv(projectId, featureName, environment, newVariants, user, oldVariants);
    }
    async crProtectedSetVariantsOnEnvs(projectId, featureName, environments, newVariants, user) {
        for (const env of environments) {
            await this.stopWhenChangeRequestsEnabled(projectId, env);
        }
        return this.setVariantsOnEnvs(projectId, featureName, environments, newVariants, user);
    }
    async setVariantsOnEnvs(projectId, featureName, environments, newVariants, user) {
        await feature_schema_1.variantsArraySchema.validateAsync(newVariants);
        const fixedVariants = this.fixVariantWeights(newVariants);
        const oldVariants = {};
        for (const env of environments) {
            const featureEnv = await this.featureEnvironmentStore.get({
                featureName,
                environment: env,
            });
            oldVariants[env] = featureEnv.variants || [];
        }
        await this.eventStore.batchStore(environments.map((environment) => new types_1.EnvironmentVariantEvent({
            featureName,
            environment,
            project: projectId,
            createdBy: user,
            oldVariants: oldVariants[environment],
            newVariants: fixedVariants,
        })));
        await this.featureEnvironmentStore.setVariantsToFeatureEnvironments(featureName, environments, fixedVariants);
        return fixedVariants;
    }
    fixVariantWeights(variants) {
        let variableVariants = variants.filter((x) => {
            return x.weightType === types_1.WeightType.VARIABLE;
        });
        if (variants.length > 0 && variableVariants.length === 0) {
            throw new bad_data_error_1.default('There must be at least one "variable" variant');
        }
        let fixedVariants = variants.filter((x) => {
            return x.weightType === types_1.WeightType.FIX;
        });
        let fixedWeights = fixedVariants.reduce((a, v) => a + v.weight, 0);
        if (fixedWeights > 1000) {
            throw new bad_data_error_1.default('The traffic distribution total must equal 100%');
        }
        let averageWeight = Math.floor((1000 - fixedWeights) / variableVariants.length);
        let remainder = (1000 - fixedWeights) % variableVariants.length;
        variableVariants = variableVariants.map((x) => {
            x.weight = averageWeight;
            if (remainder > 0) {
                x.weight += 1;
                remainder--;
            }
            return x;
        });
        return variableVariants
            .concat(fixedVariants)
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    async stopWhenChangeRequestsEnabled(project, environment, user) {
        const canBypass = await this.changeRequestAccessReadModel.canBypassChangeRequest(project, environment, user);
        if (!canBypass) {
            throw new error_1.PermissionError(types_1.SKIP_CHANGE_REQUEST);
        }
    }
    async stopWhenCannotCreateStrategies(project, environment, featureName, user) {
        const hasEnvironment = await this.featureEnvironmentStore.featureHasEnvironment(environment, featureName);
        if (hasEnvironment) {
            const strategies = await this.getStrategiesForEnvironment(project, featureName, environment);
            if (strategies.length === 0) {
                const canAddStrategies = user &&
                    (await this.accessService.hasPermission(user, types_1.CREATE_FEATURE_STRATEGY, project, environment));
                if (!canAddStrategies) {
                    throw new error_1.PermissionError(types_1.CREATE_FEATURE_STRATEGY);
                }
            }
        }
    }
    async updatePotentiallyStaleFeatures() {
        const potentiallyStaleFeatures = await this.featureToggleStore.updatePotentiallyStaleFeatures();
        if (this.flagResolver.isEnabled('emitPotentiallyStaleEvents')) {
            if (potentiallyStaleFeatures.length > 0) {
                return this.eventStore.batchStore(await Promise.all(potentiallyStaleFeatures
                    .filter((feature) => feature.potentiallyStale)
                    .map(async ({ name, project }) => new types_1.PotentiallyStaleOnEvent({
                    featureName: name,
                    project,
                    tags: await this.tagStore.getAllTagsForFeature(name),
                }))));
            }
        }
    }
}
exports.default = FeatureToggleService;
//# sourceMappingURL=feature-toggle-service.js.map