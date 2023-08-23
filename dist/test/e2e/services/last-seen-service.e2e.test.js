"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_config_1 = require("../../config/test-config");
const database_init_1 = __importDefault(require("../helpers/database-init"));
const last_seen_service_1 = require("../../../lib/services/client-metrics/last-seen-service");
let stores;
let db;
let config;
beforeAll(async () => {
    config = (0, test_config_1.createTestConfig)();
    db = await (0, database_init_1.default)('last_seen_service_serial', config.getLogger);
    stores = db.stores;
});
beforeEach(async () => {
    await stores.featureToggleStore.deleteAll();
});
afterAll(async () => {
    await db.destroy();
});
test('Should update last seen for known toggles', async () => {
    const service = new last_seen_service_1.LastSeenService(stores, config);
    const time = Date.now() - 100;
    await stores.featureToggleStore.create('default', { name: 'ta1' });
    const metrics = [
        {
            featureName: 'ta1',
            appName: 'some-App',
            environment: 'default',
            timestamp: new Date(time),
            yes: 1,
            no: 0,
        },
        {
            featureName: 'ta2',
            appName: 'some-App',
            environment: 'default',
            timestamp: new Date(time),
            yes: 1,
            no: 0,
        },
    ];
    service.updateLastSeen(metrics);
    await service.store();
    const t1 = await stores.featureToggleStore.get('ta1');
    expect(t1.lastSeenAt.getTime()).toBeGreaterThan(time);
    service.destroy();
});
test('Should not update last seen toggles with 0 metrics', async () => {
    // jest.useFakeTimers();
    const service = new last_seen_service_1.LastSeenService(stores, config, 30);
    const time = Date.now();
    await stores.featureToggleStore.create('default', { name: 'tb1' });
    await stores.featureToggleStore.create('default', { name: 'tb2' });
    const metrics = [
        {
            featureName: 'tb1',
            appName: 'some-App',
            environment: 'default',
            timestamp: new Date(time),
            yes: 1,
            no: 0,
        },
        {
            featureName: 'tb2',
            appName: 'some-App',
            environment: 'default',
            timestamp: new Date(time),
            yes: 0,
            no: 0,
        },
    ];
    service.updateLastSeen(metrics);
    // bypass interval waiting
    await service.store();
    const t1 = await stores.featureToggleStore.get('tb1');
    const t2 = await stores.featureToggleStore.get('tb2');
    expect(t2.lastSeenAt).toBeNull();
    expect(t1.lastSeenAt.getTime()).toBeGreaterThanOrEqual(time);
    service.destroy();
});
test('Should not update anything for 0 toggles', async () => {
    // jest.useFakeTimers();
    const service = new last_seen_service_1.LastSeenService(stores, config, 30);
    const time = Date.now();
    await stores.featureToggleStore.create('default', { name: 'tb1' });
    await stores.featureToggleStore.create('default', { name: 'tb2' });
    const metrics = [
        {
            featureName: 'tb1',
            appName: 'some-App',
            environment: 'default',
            timestamp: new Date(time),
            yes: 0,
            no: 0,
        },
        {
            featureName: 'tb2',
            appName: 'some-App',
            environment: 'default',
            timestamp: new Date(time),
            yes: 0,
            no: 0,
        },
    ];
    service.updateLastSeen(metrics);
    // bypass interval waiting
    const count = await service.store();
    expect(count).toBe(0);
    service.destroy();
});
//# sourceMappingURL=last-seen-service.e2e.test.js.map