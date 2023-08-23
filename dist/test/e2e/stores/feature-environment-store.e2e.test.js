"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../fixtures/no-logger"));
let db;
let stores;
let featureEnvironmentStore;
let featureStore;
let environmentStore;
beforeEach(async () => {
    db = await (0, database_init_1.default)('feature_environment_store_serial', no_logger_1.default);
    stores = db.stores;
    featureEnvironmentStore = stores.featureEnvironmentStore;
    environmentStore = stores.environmentStore;
    featureStore = stores.featureToggleStore;
});
afterEach(async () => {
    await db.destroy();
});
test('Setting enabled to same as existing value returns 0', async () => {
    let envName = 'enabled-to-true';
    let featureName = 'enabled-to-true-feature';
    await environmentStore.create({
        name: envName,
        enabled: true,
        type: 'test',
    });
    await featureStore.create('default', { name: featureName });
    await featureEnvironmentStore.connectProject(envName, 'default');
    await featureEnvironmentStore.connectFeatures(envName, 'default');
    const enabledStatus = await featureEnvironmentStore.isEnvironmentEnabled(featureName, envName);
    const changed = await featureEnvironmentStore.setEnvironmentEnabledStatus(envName, featureName, enabledStatus);
    expect(changed).toBe(0);
});
test('Setting enabled to not existing value returns 1', async () => {
    let envName = 'enabled-toggle';
    let featureName = 'enabled-toggle-feature';
    await environmentStore.create({
        name: envName,
        enabled: true,
        type: 'test',
    });
    await featureStore.create('default', { name: featureName });
    await featureEnvironmentStore.connectProject(envName, 'default');
    await featureEnvironmentStore.connectFeatures(envName, 'default');
    const enabledStatus = await featureEnvironmentStore.isEnvironmentEnabled(featureName, envName);
    const changed = await featureEnvironmentStore.setEnvironmentEnabledStatus(envName, featureName, !enabledStatus);
    expect(changed).toBe(1);
});
//# sourceMappingURL=feature-environment-store.e2e.test.js.map