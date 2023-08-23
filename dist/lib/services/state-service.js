"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_schema_1 = require("./state-schema");
const events_1 = require("../types/events");
const state_util_1 = require("./state-util");
const constants_1 = require("../util/constants");
const environment_1 = require("../types/environment");
class StateService {
    constructor(stores, { getLogger }) {
        this.compareFeatureTags = (old, tag) => old.featureName === tag.featureName &&
            old.tagValue === tag.tagValue &&
            old.tagType === tag.tagType;
        this.compareTags = (old, tag) => old.type === tag.type && old.value === tag.value;
        this.eventStore = stores.eventStore;
        this.toggleStore = stores.featureToggleStore;
        this.strategyStore = stores.strategyStore;
        this.tagStore = stores.tagStore;
        this.featureStrategiesStore = stores.featureStrategiesStore;
        this.featureEnvironmentStore = stores.featureEnvironmentStore;
        this.tagTypeStore = stores.tagTypeStore;
        this.projectStore = stores.projectStore;
        this.featureTagStore = stores.featureTagStore;
        this.environmentStore = stores.environmentStore;
        this.segmentStore = stores.segmentStore;
        this.logger = getLogger('services/state-service.js');
    }
    async importFile({ file, dropBeforeImport = false, userName = 'import-user', keepExisting = true, }) {
        return (0, state_util_1.readFile)(file)
            .then((data) => (0, state_util_1.parseFile)(file, data))
            .then((data) => this.import({
            data,
            userName,
            dropBeforeImport,
            keepExisting,
        }));
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    replaceGlobalEnvWithDefaultEnv(data) {
        data.environments?.forEach((e) => {
            if (e.name === environment_1.GLOBAL_ENV) {
                e.name = constants_1.DEFAULT_ENV;
            }
        });
        data.featureEnvironments?.forEach((fe) => {
            if (fe.environment === environment_1.GLOBAL_ENV) {
                // eslint-disable-next-line no-param-reassign
                fe.environment = constants_1.DEFAULT_ENV;
            }
        });
        data.featureStrategies?.forEach((fs) => {
            if (fs.environment === environment_1.GLOBAL_ENV) {
                // eslint-disable-next-line no-param-reassign
                fs.environment = constants_1.DEFAULT_ENV;
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    moveVariantsToFeatureEnvironments(data) {
        data.featureEnvironments?.forEach((featureEnvironment) => {
            let feature = data.features?.find((f) => f.name === featureEnvironment.featureName);
            if (feature) {
                featureEnvironment.variants = feature.variants || [];
            }
        });
    }
    async import({ data, userName = 'importUser', dropBeforeImport = false, keepExisting = true, }) {
        if (data.version === 2) {
            this.replaceGlobalEnvWithDefaultEnv(data);
        }
        if (!data.version || data.version < 4) {
            this.moveVariantsToFeatureEnvironments(data);
        }
        const importData = await state_schema_1.stateSchema.validateAsync(data);
        let importedEnvironments = [];
        if (importData.environments) {
            importedEnvironments = await this.importEnvironments({
                environments: data.environments,
                userName,
                dropBeforeImport,
                keepExisting,
            });
        }
        if (importData.projects) {
            await this.importProjects({
                projects: data.projects,
                importedEnvironments,
                userName,
                dropBeforeImport,
                keepExisting,
            });
        }
        if (importData.features) {
            let projectData;
            if (!importData.version || importData.version === 1) {
                projectData = await this.convertLegacyFeatures(importData);
            }
            else {
                projectData = importData;
            }
            const { features, featureStrategies, featureEnvironments } = projectData;
            await this.importFeatures({
                features,
                userName,
                dropBeforeImport,
                keepExisting,
                featureEnvironments,
            });
            if (featureEnvironments) {
                await this.importFeatureEnvironments({
                    featureEnvironments,
                });
            }
            await this.importFeatureStrategies({
                featureStrategies,
                dropBeforeImport,
                keepExisting,
            });
        }
        if (importData.strategies) {
            await this.importStrategies({
                strategies: data.strategies,
                userName,
                dropBeforeImport,
                keepExisting,
            });
        }
        if (importData.tagTypes && importData.tags) {
            await this.importTagData({
                tagTypes: data.tagTypes,
                tags: data.tags,
                featureTags: (data.featureTags || [])
                    .filter((t) => (data.features || []).some((f) => f.name === t.featureName))
                    .map((t) => ({
                    featureName: t.featureName,
                    tagValue: t.tagValue || t.value,
                    tagType: t.tagType || t.type,
                })) || [],
                userName,
                dropBeforeImport,
                keepExisting,
            });
        }
        if (importData.segments) {
            await this.importSegments(data.segments, userName, dropBeforeImport);
        }
        if (importData.featureStrategySegments) {
            await this.importFeatureStrategySegments(data.featureStrategySegments);
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    enabledIn(feature, env) {
        const config = {};
        env.filter((e) => e.featureName === feature).forEach((e) => {
            config[e.environment] = e.enabled || false;
        });
        return config;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async importFeatureEnvironments({ featureEnvironments }) {
        await Promise.all(featureEnvironments
            .filter(async (env) => {
            await this.environmentStore.exists(env.environment);
        })
            .map(async (featureEnvironment) => this.featureEnvironmentStore.addFeatureEnvironment(featureEnvironment)));
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async importFeatureStrategies({ featureStrategies, dropBeforeImport, keepExisting, }) {
        const oldFeatureStrategies = dropBeforeImport
            ? []
            : await this.featureStrategiesStore.getAll();
        if (dropBeforeImport) {
            this.logger.info('Dropping existing strategies for feature toggles');
            await this.featureStrategiesStore.deleteAll();
        }
        const strategiesToImport = keepExisting
            ? featureStrategies.filter((s) => !oldFeatureStrategies.some((o) => o.id === s.id))
            : featureStrategies;
        await Promise.all(strategiesToImport.map((featureStrategy) => this.featureStrategiesStore.createStrategyFeatureEnv(featureStrategy)));
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async convertLegacyFeatures({ features, }) {
        const strategies = features.flatMap((f) => f.strategies.map((strategy) => ({
            featureName: f.name,
            projectId: f.project,
            constraints: strategy.constraints || [],
            parameters: strategy.parameters || {},
            environment: constants_1.DEFAULT_ENV,
            strategyName: strategy.name,
        })));
        const newFeatures = features;
        const featureEnvironments = features.map((feature) => ({
            featureName: feature.name,
            environment: constants_1.DEFAULT_ENV,
            enabled: feature.enabled,
            variants: feature.variants || [],
        }));
        return {
            features: newFeatures,
            featureStrategies: strategies,
            featureEnvironments,
        };
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async importFeatures({ features, userName, dropBeforeImport, keepExisting, featureEnvironments, }) {
        this.logger.info(`Importing ${features.length} feature toggles`);
        const oldToggles = dropBeforeImport
            ? []
            : await this.toggleStore.getAll();
        if (dropBeforeImport) {
            this.logger.info('Dropping existing feature toggles');
            await this.toggleStore.deleteAll();
            await this.eventStore.store({
                type: events_1.DROP_FEATURES,
                createdBy: userName,
                data: { name: 'all-features' },
            });
        }
        await Promise.all(features
            .filter((0, state_util_1.filterExisting)(keepExisting, oldToggles))
            .filter((0, state_util_1.filterEqual)(oldToggles))
            .map(async (feature) => {
            await this.toggleStore.create(feature.project, feature);
            await this.featureEnvironmentStore.connectFeatureToEnvironmentsForProject(feature.name, feature.project, this.enabledIn(feature.name, featureEnvironments));
            await this.eventStore.store({
                type: events_1.FEATURE_IMPORT,
                createdBy: userName,
                data: feature,
            });
        }));
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async importStrategies({ strategies, userName, dropBeforeImport, keepExisting, }) {
        this.logger.info(`Importing ${strategies.length} strategies`);
        const oldStrategies = dropBeforeImport
            ? []
            : await this.strategyStore.getAll();
        if (dropBeforeImport) {
            this.logger.info('Dropping existing strategies');
            await this.strategyStore.dropCustomStrategies();
            await this.eventStore.store({
                type: events_1.DROP_STRATEGIES,
                createdBy: userName,
                data: { name: 'all-strategies' },
            });
        }
        await Promise.all(strategies
            .filter((0, state_util_1.filterExisting)(keepExisting, oldStrategies))
            .filter((0, state_util_1.filterEqual)(oldStrategies))
            .map((strategy) => this.strategyStore.importStrategy(strategy).then(() => {
            this.eventStore.store({
                type: events_1.STRATEGY_IMPORT,
                createdBy: userName,
                data: strategy,
            });
        })));
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async importEnvironments({ environments, userName, dropBeforeImport, keepExisting, }) {
        this.logger.info(`Import ${environments.length} projects`);
        const oldEnvs = dropBeforeImport
            ? []
            : await this.environmentStore.getAll();
        if (dropBeforeImport) {
            this.logger.info('Dropping existing environments');
            await this.environmentStore.deleteAll();
            await this.eventStore.store({
                type: events_1.DROP_ENVIRONMENTS,
                createdBy: userName,
                data: { name: 'all-environments' },
            });
        }
        const envsImport = environments.filter((env) => keepExisting ? !oldEnvs.some((old) => old.name === env.name) : true);
        let importedEnvs = [];
        if (envsImport.length > 0) {
            importedEnvs = await this.environmentStore.importEnvironments(envsImport);
            const importedEnvironmentEvents = importedEnvs.map((env) => ({
                type: events_1.ENVIRONMENT_IMPORT,
                createdBy: userName,
                data: env,
            }));
            await this.eventStore.batchStore(importedEnvironmentEvents);
        }
        return importedEnvs;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async importProjects({ projects, importedEnvironments, userName, dropBeforeImport, keepExisting, }) {
        this.logger.info(`Import ${projects.length} projects`);
        const oldProjects = dropBeforeImport
            ? []
            : await this.projectStore.getAll();
        if (dropBeforeImport) {
            this.logger.info('Dropping existing projects');
            await this.projectStore.deleteAll();
            await this.eventStore.store({
                type: events_1.DROP_PROJECTS,
                createdBy: userName,
                data: { name: 'all-projects' },
            });
        }
        const projectsToImport = projects.filter((project) => keepExisting
            ? !oldProjects.some((old) => old.id === project.id)
            : true);
        if (projectsToImport.length > 0) {
            const importedProjects = await this.projectStore.importProjects(projectsToImport, importedEnvironments);
            const importedProjectEvents = importedProjects.map((project) => ({
                type: events_1.PROJECT_IMPORT,
                createdBy: userName,
                data: project,
            }));
            await this.eventStore.batchStore(importedProjectEvents);
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async importTagData({ tagTypes, tags, featureTags, userName, dropBeforeImport, keepExisting, }) {
        this.logger.info(`Importing ${tagTypes.length} tagtypes, ${tags.length} tags and ${featureTags.length} feature tags`);
        const oldTagTypes = dropBeforeImport
            ? []
            : await this.tagTypeStore.getAll();
        const oldTags = dropBeforeImport ? [] : await this.tagStore.getAll();
        const oldFeatureTags = dropBeforeImport
            ? []
            : await this.featureTagStore.getAll();
        if (dropBeforeImport) {
            this.logger.info('Dropping all existing featuretags, tags and tagtypes');
            await this.featureTagStore.deleteAll();
            await this.tagStore.deleteAll();
            await this.tagTypeStore.deleteAll();
            await this.eventStore.batchStore([
                {
                    type: events_1.DROP_FEATURE_TAGS,
                    createdBy: userName,
                    data: { name: 'all-feature-tags' },
                },
                {
                    type: events_1.DROP_TAGS,
                    createdBy: userName,
                    data: { name: 'all-tags' },
                },
                {
                    type: events_1.DROP_TAG_TYPES,
                    createdBy: userName,
                    data: { name: 'all-tag-types' },
                },
            ]);
        }
        await this.importTagTypes(tagTypes, keepExisting, oldTagTypes, userName);
        await this.importTags(tags, keepExisting, oldTags, userName);
        await this.importFeatureTags(featureTags, keepExisting, oldFeatureTags, userName);
    }
    async importFeatureTags(featureTags, keepExisting, oldFeatureTags, userName) {
        const featureTagsToInsert = featureTags.filter((tag) => keepExisting
            ? !oldFeatureTags.some((old) => this.compareFeatureTags(old, tag))
            : true);
        if (featureTagsToInsert.length > 0) {
            const importedFeatureTags = await this.featureTagStore.tagFeatures(featureTagsToInsert);
            const importedFeatureTagEvents = importedFeatureTags.map((tag) => ({
                type: events_1.FEATURE_TAG_IMPORT,
                createdBy: userName,
                data: tag,
            }));
            await this.eventStore.batchStore(importedFeatureTagEvents);
        }
    }
    async importTags(tags, keepExisting, oldTags, userName) {
        const tagsToInsert = tags.filter((tag) => keepExisting
            ? !oldTags.some((old) => this.compareTags(old, tag))
            : true);
        if (tagsToInsert.length > 0) {
            const importedTags = await this.tagStore.bulkImport(tagsToInsert);
            const importedTagEvents = importedTags.map((tag) => ({
                type: events_1.TAG_IMPORT,
                createdBy: userName,
                data: tag,
            }));
            await this.eventStore.batchStore(importedTagEvents);
        }
    }
    async importTagTypes(tagTypes, keepExisting, oldTagTypes = [], // eslint-disable-line
    userName) {
        const tagTypesToInsert = tagTypes.filter((tagType) => keepExisting
            ? !oldTagTypes.some((t) => t.name === tagType.name)
            : true);
        if (tagTypesToInsert.length > 0) {
            const importedTagTypes = await this.tagTypeStore.bulkImport(tagTypesToInsert);
            const importedTagTypeEvents = importedTagTypes.map((tagType) => ({
                type: events_1.TAG_TYPE_IMPORT,
                createdBy: userName,
                data: tagType,
            }));
            await this.eventStore.batchStore(importedTagTypeEvents);
        }
    }
    async importSegments(segments, userName, dropBeforeImport) {
        if (dropBeforeImport) {
            await this.segmentStore.deleteAll();
        }
        await Promise.all(segments.map((segment) => this.segmentStore.create(segment, { username: userName })));
    }
    async importFeatureStrategySegments(featureStrategySegments) {
        await Promise.all(featureStrategySegments.map(({ featureStrategyId, segmentId }) => this.segmentStore.addToStrategy(segmentId, featureStrategyId)));
    }
    async export(opts) {
        return this.exportV4(opts);
    }
    async exportV4({ includeFeatureToggles = true, includeStrategies = true, includeProjects = true, includeTags = true, includeEnvironments = true, includeSegments = true, }) {
        return Promise.all([
            includeFeatureToggles
                ? this.toggleStore.getAll({ archived: false })
                : Promise.resolve([]),
            includeStrategies
                ? this.strategyStore.getEditableStrategies()
                : Promise.resolve([]),
            this.projectStore && includeProjects
                ? this.projectStore.getAll()
                : Promise.resolve([]),
            includeTags ? this.tagTypeStore.getAll() : Promise.resolve([]),
            includeTags ? this.tagStore.getAll() : Promise.resolve([]),
            includeTags && includeFeatureToggles
                ? this.featureTagStore.getAll()
                : Promise.resolve([]),
            includeFeatureToggles
                ? this.featureStrategiesStore.getAll()
                : Promise.resolve([]),
            includeEnvironments
                ? this.environmentStore.getAll()
                : Promise.resolve([]),
            includeFeatureToggles
                ? this.featureEnvironmentStore.getAll()
                : Promise.resolve([]),
            includeSegments ? this.segmentStore.getAll() : Promise.resolve([]),
            includeSegments
                ? this.segmentStore.getAllFeatureStrategySegments()
                : Promise.resolve([]),
        ]).then(([features, strategies, projects, tagTypes, tags, featureTags, featureStrategies, environments, featureEnvironments, segments, featureStrategySegments,]) => ({
            version: 4,
            features,
            strategies,
            projects,
            tagTypes,
            tags,
            featureTags,
            featureStrategies: featureStrategies.filter((fS) => features.some((f) => fS.featureName === f.name)),
            environments,
            featureEnvironments: featureEnvironments.filter((fE) => features.some((f) => fE.featureName === f.name)),
            segments,
            featureStrategySegments,
        }));
    }
}
exports.default = StateService;
module.exports = StateService;
//# sourceMappingURL=state-service.js.map