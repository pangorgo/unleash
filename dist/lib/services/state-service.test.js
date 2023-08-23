"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = __importDefault(require("../../test/fixtures/store"));
const no_logger_1 = __importDefault(require("../../test/fixtures/no-logger"));
const state_service_1 = __importDefault(require("./state-service"));
const events_1 = require("../types/events");
const environment_1 = require("../types/environment");
const variantsexport_v3_json_1 = __importDefault(require("../../test/examples/variantsexport_v3.json"));
const oldExportExample = require('./state-service-export-v1.json');
function getSetup() {
    const stores = (0, store_1.default)();
    return {
        stateService: new state_service_1.default(stores, {
            getLogger: no_logger_1.default,
        }),
        stores,
    };
}
async function setupV3VariantsCompatibilityScenario(envs = [
    { name: 'env-2', enabled: true },
    { name: 'env-3', enabled: true },
    { name: 'env-1', enabled: true },
]) {
    const stores = (0, store_1.default)();
    await stores.featureToggleStore.create('some-project', {
        name: 'Feature-with-variants',
    });
    let sortOrder = 1;
    envs.forEach(async (env) => {
        await stores.environmentStore.create({
            name: env.name,
            type: 'production',
            sortOrder: sortOrder++,
        });
        await stores.featureEnvironmentStore.addEnvironmentToFeature('Feature-with-variants', env.name, env.enabled);
        await stores.featureEnvironmentStore.addVariantsToFeatureEnvironment('Feature-with-variants', env.name, [
            {
                name: `${env.name}-variant`,
                stickiness: 'default',
                weight: 1000,
                weightType: 'variable',
            },
        ]);
    });
    return {
        stateService: new state_service_1.default(stores, {
            getLogger: no_logger_1.default,
        }),
        stores,
    };
}
test('should import a feature', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        features: [
            {
                name: 'new-feature',
                enabled: true,
                strategies: [{ name: 'default' }],
            },
        ],
    };
    await stateService.import({ data });
    const events = await stores.eventStore.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe(events_1.FEATURE_IMPORT);
    expect(events[0].data.name).toBe('new-feature');
});
test('should not import an existing feature', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        features: [
            {
                name: 'new-feature',
                enabled: true,
                strategies: [{ name: 'default' }],
            },
        ],
    };
    await stores.featureToggleStore.create('default', data.features[0]);
    await stateService.import({ data, keepExisting: true });
    const events = await stores.eventStore.getEvents();
    expect(events).toHaveLength(0);
});
test('should not keep existing feature if drop-before-import', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        features: [
            {
                name: 'new-feature',
                enabled: true,
                strategies: [{ name: 'default' }],
            },
        ],
    };
    await stores.featureToggleStore.create('default', data.features[0]);
    await stateService.import({
        data,
        keepExisting: true,
        dropBeforeImport: true,
    });
    const events = await stores.eventStore.getEvents();
    expect(events).toHaveLength(2);
    expect(events[0].type).toBe(events_1.DROP_FEATURES);
    expect(events[1].type).toBe(events_1.FEATURE_IMPORT);
});
test('should drop feature before import if specified', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        features: [
            {
                name: 'new-feature',
                enabled: true,
                strategies: [{ name: 'default' }],
            },
        ],
    };
    await stateService.import({ data, dropBeforeImport: true });
    const events = await stores.eventStore.getEvents();
    expect(events).toHaveLength(2);
    expect(events[0].type).toBe(events_1.DROP_FEATURES);
    expect(events[1].type).toBe(events_1.FEATURE_IMPORT);
    expect(events[1].data.name).toBe('new-feature');
});
test('should import a strategy', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        strategies: [
            {
                name: 'new-strategy',
                parameters: [],
            },
        ],
    };
    await stateService.import({ data });
    const events = await stores.eventStore.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe(events_1.STRATEGY_IMPORT);
    expect(events[0].data.name).toBe('new-strategy');
});
test('should not import an existing strategy', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        strategies: [
            {
                name: 'new-strategy',
                parameters: [],
            },
        ],
    };
    await stores.strategyStore.createStrategy(data.strategies[0]);
    await stateService.import({ data, keepExisting: true });
    const events = await stores.eventStore.getEvents();
    expect(events).toHaveLength(0);
});
test('should drop strategies before import if specified', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        strategies: [
            {
                name: 'new-strategy',
                parameters: [],
            },
        ],
    };
    await stateService.import({ data, dropBeforeImport: true });
    const events = await stores.eventStore.getEvents();
    expect(events).toHaveLength(2);
    expect(events[0].type).toBe(events_1.DROP_STRATEGIES);
    expect(events[1].type).toBe(events_1.STRATEGY_IMPORT);
    expect(events[1].data.name).toBe('new-strategy');
});
test('should drop neither features nor strategies when neither is imported', async () => {
    const { stateService, stores } = getSetup();
    const data = {};
    await stateService.import({ data, dropBeforeImport: true });
    const events = await stores.eventStore.getEvents();
    expect(events).toHaveLength(0);
});
test('should not accept gibberish', async () => {
    const { stateService } = getSetup();
    const data1 = {
        type: 'gibberish',
        flags: { evil: true },
    };
    const data2 = '{somerandomtext/';
    await expect(async () => stateService.import({ data: data1 })).rejects.toThrow();
    await expect(async () => stateService.import({ data: data2 })).rejects.toThrow();
});
test('should export featureToggles', async () => {
    const { stateService, stores } = getSetup();
    await stores.featureToggleStore.create('default', {
        name: 'a-feature',
    });
    const data = await stateService.export({ includeFeatureToggles: true });
    expect(data.features).toHaveLength(1);
    expect(data.features[0].name).toBe('a-feature');
});
test('archived feature toggles should not be included', async () => {
    const { stateService, stores } = getSetup();
    await stores.featureToggleStore.create('default', {
        name: 'a-feature',
        archived: true,
    });
    const data = await stateService.export({ includeFeatureToggles: true });
    expect(data.features).toHaveLength(0);
});
test('featureStrategy connected to an archived feature toggle should not be included', async () => {
    const { stateService, stores } = getSetup();
    const featureName = 'fstrat-archived-feature';
    await stores.featureToggleStore.create('default', {
        name: featureName,
        archived: true,
    });
    await stores.featureStrategiesStore.createStrategyFeatureEnv({
        featureName,
        strategyName: 'fstrat-archived-strat',
        environment: environment_1.GLOBAL_ENV,
        constraints: [],
        parameters: {},
        projectId: 'default',
    });
    const data = await stateService.export({ includeFeatureToggles: true });
    expect(data.featureStrategies).toHaveLength(0);
});
test('featureStrategy connected to a feature should be included', async () => {
    const { stateService, stores } = getSetup();
    const featureName = 'fstrat-feature';
    await stores.featureToggleStore.create('default', {
        name: featureName,
    });
    await stores.featureStrategiesStore.createStrategyFeatureEnv({
        featureName,
        strategyName: 'fstrat-strat',
        environment: environment_1.GLOBAL_ENV,
        constraints: [],
        parameters: {},
        projectId: 'default',
    });
    const data = await stateService.export({ includeFeatureToggles: true });
    expect(data.featureStrategies).toHaveLength(1);
});
test('should export strategies', async () => {
    const { stateService, stores } = getSetup();
    await stores.strategyStore.createStrategy({
        name: 'a-strategy',
        editable: true,
    });
    const data = await stateService.export({ includeStrategies: true });
    expect(data.strategies).toHaveLength(1);
    expect(data.strategies[0].name).toBe('a-strategy');
});
test('should import a tag and tag type', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        tagTypes: [
            { name: 'simple', description: 'some description', icon: '#' },
        ],
        tags: [{ type: 'simple', value: 'test' }],
    };
    await stateService.import({ data });
    const events = await stores.eventStore.getEvents();
    expect(events).toHaveLength(2);
    expect(events[0].type).toBe(events_1.TAG_TYPE_IMPORT);
    expect(events[0].data.name).toBe('simple');
    expect(events[1].type).toBe(events_1.TAG_IMPORT);
    expect(events[1].data.value).toBe('test');
});
test('Should not import an existing tag', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        tagTypes: [
            { name: 'simple', description: 'some description', icon: '#' },
        ],
        tags: [{ type: 'simple', value: 'test' }],
        featureTags: [
            {
                featureName: 'demo-feature',
                tagType: 'simple',
                tagValue: 'test',
            },
        ],
    };
    await stores.tagTypeStore.createTagType(data.tagTypes[0]);
    await stores.tagStore.createTag(data.tags[0]);
    await stores.featureTagStore.tagFeature(data.featureTags[0].featureName, {
        type: data.featureTags[0].tagType,
        value: data.featureTags[0].tagValue,
    });
    await stateService.import({ data, keepExisting: true });
    const events = await stores.eventStore.getEvents();
    expect(events).toHaveLength(0);
});
test('Should not keep existing tags if drop-before-import', async () => {
    const { stateService, stores } = getSetup();
    const notSoSimple = {
        name: 'notsosimple',
        description: 'some other description',
        icon: '#',
    };
    const slack = {
        name: 'slack',
        description: 'slack tags',
        icon: '#',
    };
    await stores.tagTypeStore.createTagType(notSoSimple);
    await stores.tagTypeStore.createTagType(slack);
    const data = {
        tagTypes: [
            { name: 'simple', description: 'some description', icon: '#' },
        ],
        tags: [{ type: 'simple', value: 'test' }],
        featureTags: [
            {
                featureName: 'demo-feature',
                tagType: 'simple',
                tagValue: 'test',
            },
        ],
    };
    await stateService.import({ data, dropBeforeImport: true });
    const tagTypes = await stores.tagTypeStore.getAll();
    expect(tagTypes).toHaveLength(1);
});
test('should export tag, tagtypes but not feature tags if the feature is not exported', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        tagTypes: [
            { name: 'simple', description: 'some description', icon: '#' },
        ],
        tags: [{ type: 'simple', value: 'test' }],
        featureTags: [
            {
                featureName: 'demo-feature',
                tagType: 'simple',
                tagValue: 'test',
            },
        ],
    };
    await stores.tagTypeStore.createTagType(data.tagTypes[0]);
    await stores.tagStore.createTag(data.tags[0]);
    await stores.featureTagStore.tagFeature(data.featureTags[0].featureName, {
        type: data.featureTags[0].tagType,
        value: data.featureTags[0].tagValue,
    });
    const exported = await stateService.export({
        includeFeatureToggles: false,
        includeStrategies: false,
        includeTags: true,
        includeProjects: false,
    });
    expect(exported.tags).toHaveLength(1);
    expect(exported.tags[0].type).toBe(data.tags[0].type);
    expect(exported.tags[0].value).toBe(data.tags[0].value);
    expect(exported.tagTypes).toHaveLength(1);
    expect(exported.tagTypes[0].name).toBe(data.tagTypes[0].name);
    expect(exported.featureTags).toHaveLength(0);
});
test('should export tag, tagtypes, featureTags and features', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        tagTypes: [
            { name: 'simple', description: 'some description', icon: '#' },
        ],
        tags: [{ type: 'simple', value: 'test' }],
        featureTags: [
            {
                featureName: 'demo-feature',
                tagType: 'simple',
                tagValue: 'test',
            },
        ],
    };
    await stores.tagTypeStore.createTagType(data.tagTypes[0]);
    await stores.tagStore.createTag(data.tags[0]);
    await stores.featureTagStore.tagFeature(data.featureTags[0].featureName, {
        type: data.featureTags[0].tagType,
        value: data.featureTags[0].tagValue,
    });
    const exported = await stateService.export({
        includeFeatureToggles: true,
        includeStrategies: false,
        includeTags: true,
        includeProjects: false,
    });
    expect(exported.tags).toHaveLength(1);
    expect(exported.tags[0].type).toBe(data.tags[0].type);
    expect(exported.tags[0].value).toBe(data.tags[0].value);
    expect(exported.tagTypes).toHaveLength(1);
    expect(exported.tagTypes[0].name).toBe(data.tagTypes[0].name);
    expect(exported.featureTags).toHaveLength(1);
    expect(exported.featureTags[0].featureName).toBe(data.featureTags[0].featureName);
    expect(exported.featureTags[0].tagType).toBe(data.featureTags[0].tagType);
    expect(exported.featureTags[0].tagValue).toBe(data.featureTags[0].tagValue);
});
test('should import a project', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        projects: [
            {
                id: 'default',
                name: 'default',
                description: 'Some fancy description for project',
            },
        ],
    };
    await stateService.import({ data });
    const events = await stores.eventStore.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe(events_1.PROJECT_IMPORT);
    expect(events[0].data.name).toBe('default');
});
test('Should not import an existing project', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        projects: [
            {
                id: 'default',
                name: 'default',
                description: 'Some fancy description for project',
                mode: 'open',
            },
        ],
    };
    await stores.projectStore.create(data.projects[0]);
    await stateService.import({ data, keepExisting: true });
    const events = await stores.eventStore.getEvents();
    expect(events).toHaveLength(0);
    await stateService.import({ data });
});
test('Should drop projects before import if specified', async () => {
    const { stateService, stores } = getSetup();
    const data = {
        projects: [
            {
                id: 'default',
                name: 'default',
                description: 'Some fancy description for project',
            },
        ],
    };
    await stores.projectStore.create({
        id: 'fancy',
        name: 'extra',
        description: 'Not expected to be seen after import',
        mode: 'open',
    });
    await stateService.import({ data, dropBeforeImport: true });
    const hasProject = await stores.projectStore.hasProject('fancy');
    expect(hasProject).toBe(false);
});
test('Should export projects', async () => {
    const { stateService, stores } = getSetup();
    await stores.projectStore.create({
        id: 'fancy',
        name: 'extra',
        description: 'No surprises here',
        mode: 'open',
    });
    const exported = await stateService.export({
        includeFeatureToggles: false,
        includeStrategies: false,
        includeTags: false,
        includeProjects: true,
    });
    expect(exported.projects[0].id).toBe('fancy');
    expect(exported.projects[0].name).toBe('extra');
    expect(exported.projects[0].description).toBe('No surprises here');
});
test('exporting to new format works', async () => {
    const stores = (0, store_1.default)();
    const stateService = new state_service_1.default(stores, {
        getLogger: no_logger_1.default,
    });
    await stores.projectStore.create({
        id: 'fancy',
        name: 'extra',
        description: 'No surprises here',
        mode: 'open',
    });
    await stores.environmentStore.create({
        name: 'dev',
        type: 'development',
    });
    await stores.environmentStore.create({
        name: 'prod',
        type: 'production',
    });
    await stores.featureToggleStore.create('fancy', {
        name: 'Some-feature',
    });
    await stores.strategyStore.createStrategy({ name: 'format' });
    await stores.featureEnvironmentStore.addEnvironmentToFeature('Some-feature', 'dev', true);
    await stores.featureStrategiesStore.createStrategyFeatureEnv({
        featureName: 'Some-feature',
        projectId: 'fancy',
        strategyName: 'format',
        environment: 'dev',
        parameters: {},
        constraints: [],
    });
    await stores.featureTagStore.tagFeature('Some-feature', {
        type: 'simple',
        value: 'Test',
    });
    const exported = await stateService.export({});
    expect(exported.featureStrategies).toHaveLength(1);
});
test('exporting variants to v4 format should not include variants in features', async () => {
    const { stateService } = await setupV3VariantsCompatibilityScenario();
    const exported = await stateService.export({});
    expect(exported.features).toHaveLength(1);
    expect(exported.features[0].variants).toBeUndefined();
    exported.featureEnvironments.forEach((fe) => {
        expect(fe.variants).toHaveLength(1);
        expect(fe.variants?.[0].name).toBe(`${fe.environment}-variant`);
    });
    expect(exported.environments).toHaveLength(3);
});
test('featureStrategies can keep existing', async () => {
    const { stateService, stores } = getSetup();
    await stores.projectStore.create({
        id: 'fancy',
        name: 'extra',
        description: 'No surprises here',
        mode: 'open',
    });
    await stores.environmentStore.create({
        name: 'dev',
        type: 'development',
    });
    await stores.environmentStore.create({
        name: 'prod',
        type: 'production',
    });
    await stores.featureToggleStore.create('fancy', {
        name: 'Some-feature',
    });
    await stores.strategyStore.createStrategy({ name: 'format' });
    await stores.featureEnvironmentStore.addEnvironmentToFeature('Some-feature', 'dev', true);
    await stores.featureStrategiesStore.createStrategyFeatureEnv({
        featureName: 'Some-feature',
        projectId: 'fancy',
        strategyName: 'format',
        environment: 'dev',
        parameters: {},
        constraints: [],
    });
    await stores.featureTagStore.tagFeature('Some-feature', {
        type: 'simple',
        value: 'Test',
    });
    const exported = await stateService.export({});
    await stateService.import({
        data: exported,
        userName: 'testing',
        keepExisting: true,
    });
    expect(await stores.featureStrategiesStore.getAll()).toHaveLength(1);
});
test('featureStrategies should not keep existing if dropBeforeImport', async () => {
    const { stateService, stores } = getSetup();
    await stores.projectStore.create({
        id: 'fancy',
        name: 'extra',
        description: 'No surprises here',
        mode: 'open',
    });
    await stores.environmentStore.create({
        name: 'dev',
        type: 'development',
    });
    await stores.environmentStore.create({
        name: 'prod',
        type: 'production',
    });
    await stores.featureToggleStore.create('fancy', {
        name: 'Some-feature',
    });
    await stores.strategyStore.createStrategy({ name: 'format' });
    await stores.featureEnvironmentStore.addEnvironmentToFeature('Some-feature', 'dev', true);
    await stores.featureStrategiesStore.createStrategyFeatureEnv({
        featureName: 'Some-feature',
        projectId: 'fancy',
        strategyName: 'format',
        environment: 'dev',
        parameters: {},
        constraints: [],
    });
    await stores.featureTagStore.tagFeature('Some-feature', {
        type: 'simple',
        value: 'Test',
    });
    const exported = await stateService.export({});
    exported.featureStrategies = [];
    await stateService.import({
        data: exported,
        userName: 'testing',
        keepExisting: true,
        dropBeforeImport: true,
    });
    expect(await stores.featureStrategiesStore.getAll()).toHaveLength(0);
});
test('Import v1 and exporting v2 should work', async () => {
    const { stateService } = getSetup();
    await stateService.import({
        data: oldExportExample,
        dropBeforeImport: true,
        userName: 'testing',
    });
    const exported = await stateService.export({});
    const strategiesCount = oldExportExample.features.reduce((acc, f) => acc + f.strategies.length, 0);
    expect(exported.features.every((f) => oldExportExample.features.some((old) => old.name === f.name))).toBeTruthy();
    expect(exported.featureStrategies).toHaveLength(strategiesCount);
});
test('Importing states with deprecated strategies should keep their deprecated state', async () => {
    const { stateService, stores } = getSetup();
    const deprecatedStrategyExample = {
        version: 4,
        features: [],
        strategies: [
            {
                name: 'deprecatedstrat',
                description: 'This should be deprecated when imported',
                deprecated: true,
                parameters: [],
                builtIn: false,
                sortOrder: 9999,
                displayName: 'Deprecated strategy',
            },
        ],
        featureStrategies: [],
    };
    await stateService.import({
        data: deprecatedStrategyExample,
        userName: 'strategy-importer',
        dropBeforeImport: true,
        keepExisting: false,
    });
    const deprecatedStrategy = await stores.strategyStore.get('deprecatedstrat');
    expect(deprecatedStrategy.deprecated).toBe(true);
});
test('Exporting a deprecated strategy and then importing it should keep correct state', async () => {
    const { stateService, stores } = getSetup();
    await stateService.import({
        data: variantsexport_v3_json_1.default,
        keepExisting: false,
        dropBeforeImport: true,
        userName: 'strategy importer',
    });
    const rolloutRandom = await stores.strategyStore.get('gradualRolloutRandom');
    expect(rolloutRandom.deprecated).toBe(true);
    const rolloutSessionId = await stores.strategyStore.get('gradualRolloutSessionId');
    expect(rolloutSessionId.deprecated).toBe(true);
    const rolloutUserId = await stores.strategyStore.get('gradualRolloutUserId');
    expect(rolloutUserId.deprecated).toBe(true);
});
//# sourceMappingURL=state-service.test.js.map