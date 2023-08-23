"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_config_1 = require("../../config/test-config");
const database_init_1 = __importDefault(require("../helpers/database-init"));
const state_service_1 = __importDefault(require("../../../lib/services/state-service"));
const variantsexport_v3_json_1 = __importDefault(require("../../examples/variantsexport_v3.json"));
const model_1 = require("../../../lib/types/model");
let stores;
let db;
let stateService;
beforeAll(async () => {
    const config = (0, test_config_1.createTestConfig)();
    db = await (0, database_init_1.default)('state_service_serial', config.getLogger);
    stores = db.stores;
    stateService = new state_service_1.default(stores, config);
});
afterAll(async () => {
    db.destroy();
});
test('Exporting featureEnvironmentVariants should work', async () => {
    await stores.projectStore.create({
        id: 'fancy',
        name: 'extra',
        description: 'No surprises here',
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
    await stores.featureToggleStore.create('fancy', {
        name: 'another-feature',
    });
    await stores.featureEnvironmentStore.addEnvironmentToFeature('Some-feature', 'dev', true);
    await stores.featureEnvironmentStore.addEnvironmentToFeature('another-feature', 'dev', true);
    await stores.featureEnvironmentStore.addEnvironmentToFeature('another-feature', 'prod', true);
    await stores.featureEnvironmentStore.addVariantsToFeatureEnvironment('Some-feature', 'dev', [
        {
            name: 'blue',
            weight: 333,
            stickiness: 'default',
            weightType: model_1.WeightType.VARIABLE,
        },
        {
            name: 'green',
            weight: 333,
            stickiness: 'default',
            weightType: model_1.WeightType.VARIABLE,
        },
        {
            name: 'red',
            weight: 333,
            stickiness: 'default',
            weightType: model_1.WeightType.VARIABLE,
        },
    ]);
    await stores.featureEnvironmentStore.addVariantsToFeatureEnvironment('another-feature', 'dev', [
        {
            name: 'purple',
            weight: 333,
            stickiness: 'default',
            weightType: '',
        },
        {
            name: 'lilac',
            weight: 333,
            stickiness: 'default',
            weightType: '',
        },
        {
            name: 'azure',
            weight: 333,
            stickiness: 'default',
            weightType: '',
        },
    ]);
    await stores.featureEnvironmentStore.addVariantsToFeatureEnvironment('another-feature', 'prod', [
        {
            name: 'purple',
            weight: 333,
            stickiness: 'default',
            weightType: '',
        },
        {
            name: 'lilac',
            weight: 333,
            stickiness: 'default',
            weightType: '',
        },
        {
            name: 'azure',
            weight: 333,
            stickiness: 'default',
            weightType: '',
        },
    ]);
    const exportedData = await stateService.export({});
    expect(exportedData.featureEnvironments.find((fE) => fE.featureName === 'Some-feature').variants).toHaveLength(3);
});
test('Should import variants from old format and convert to new format (per environment)', async () => {
    await stateService.import({
        data: variantsexport_v3_json_1.default,
        keepExisting: false,
        dropBeforeImport: true,
    });
    let featureEnvironments = await stores.featureEnvironmentStore.getAll();
    expect(featureEnvironments).toHaveLength(6); // There are 3 environments enabled and 2 features
    expect(featureEnvironments
        .filter((fE) => fE.featureName === 'variants-tester' && fE.enabled)
        .every((e) => e.variants.length === 4)).toBeTruthy();
});
test('Should import variants in new format (per environment)', async () => {
    await stateService.import({
        data: variantsexport_v3_json_1.default,
        keepExisting: false,
        dropBeforeImport: true,
    });
    let exportedJson = await stateService.export({});
    await stateService.import({
        data: exportedJson,
        keepExisting: false,
        dropBeforeImport: true,
    });
    let featureEnvironments = await stores.featureEnvironmentStore.getAll();
    expect(featureEnvironments).toHaveLength(6); // 3 environments, 2 features === 6 rows
});
test('Importing states with deprecated strategies should keep their deprecated state', async () => {
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
//# sourceMappingURL=state-service.e2e.test.js.map