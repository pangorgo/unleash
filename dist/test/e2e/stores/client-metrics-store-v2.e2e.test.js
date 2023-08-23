"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const database_init_1 = __importDefault(require("../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../fixtures/no-logger"));
let db;
let stores;
let clientMetricsStore;
beforeEach(async () => {
    db = await (0, database_init_1.default)('client_metrics_store_v2_e2e_serial', no_logger_1.default);
    stores = db.stores;
    clientMetricsStore = stores.clientMetricsStoreV2;
});
afterEach(async () => {
    await db.destroy();
});
test('Should store single list of metrics', async () => {
    const metrics = [
        {
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: new Date(),
            yes: 2,
            no: 2,
        },
    ];
    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();
    expect(savedMetrics).toHaveLength(1);
});
test('Should "increment" metrics within same hour', async () => {
    const metrics = [
        {
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: new Date(),
            yes: 2,
            no: 2,
        },
        {
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: new Date(),
            yes: 1,
            no: 3,
        },
    ];
    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();
    expect(savedMetrics).toHaveLength(1);
    expect(savedMetrics[0].yes).toBe(3);
    expect(savedMetrics[0].no).toBe(5);
});
test('Should get individual metrics outside same hour', async () => {
    const d1 = (0, date_fns_1.set)(Date.now(), { hours: 10, minutes: 10, seconds: 11 });
    const d2 = (0, date_fns_1.addHours)(d1, 1);
    const metrics = [
        {
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: d1,
            yes: 2,
            no: 2,
        },
        {
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: d2,
            yes: 1,
            no: 3,
        },
    ];
    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();
    expect(savedMetrics).toHaveLength(2);
    expect(savedMetrics[0].yes).toBe(2);
    expect(savedMetrics[0].no).toBe(2);
});
test('Should insert hundred metrics in a row', async () => {
    const metrics = [];
    const date = new Date();
    for (let i = 0; i < 100; i++) {
        metrics.push({
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: date,
            yes: i,
            no: i + 1,
        });
    }
    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();
    expect(savedMetrics).toHaveLength(1);
    expect(savedMetrics[0].yes).toBe(4950);
    expect(savedMetrics[0].no).toBe(5050);
});
test('Should insert individual rows for different apps', async () => {
    const metrics = [];
    const date = new Date();
    for (let i = 0; i < 10; i++) {
        metrics.push({
            featureName: 'demo',
            appName: `web-${i}`,
            environment: 'dev',
            timestamp: date,
            yes: 2,
            no: 2,
        });
    }
    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();
    expect(savedMetrics).toHaveLength(10);
    expect(savedMetrics[0].yes).toBe(2);
    expect(savedMetrics[0].no).toBe(2);
});
test('Should insert individual rows for different toggles', async () => {
    const metrics = [];
    const date = new Date();
    for (let i = 0; i < 10; i++) {
        metrics.push({
            featureName: `app-${i}`,
            appName: `web`,
            environment: 'dev',
            timestamp: date,
            yes: 2,
            no: 2,
        });
    }
    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();
    expect(savedMetrics).toHaveLength(10);
    expect(savedMetrics[0].yes).toBe(2);
    expect(savedMetrics[0].no).toBe(2);
});
test('Should get toggle metrics', async () => {
    const metrics = [];
    const date = new Date();
    for (let i = 0; i < 100; i++) {
        metrics.push({
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: date,
            yes: i,
            no: i + 1,
        });
    }
    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getMetricsForFeatureToggle('demo');
    expect(savedMetrics).toHaveLength(1);
    expect(savedMetrics[0].yes).toBe(4950);
    expect(savedMetrics[0].no).toBe(5050);
});
test('Should insert 1500 feature toggle metrics', async () => {
    const metrics = [];
    const date = new Date();
    for (let i = 0; i < 1500; i++) {
        metrics.push({
            featureName: `demo-${i}`,
            appName: `web`,
            environment: 'dev',
            timestamp: date,
            yes: 2,
            no: 2,
        });
    }
    await clientMetricsStore.batchInsertMetrics(metrics);
    const savedMetrics = await clientMetricsStore.getAll();
    expect(savedMetrics).toHaveLength(1500);
});
test('Should return seen applications using a feature toggle', async () => {
    const metrics = [
        {
            featureName: 'demo',
            appName: 'web',
            environment: 'dev',
            timestamp: new Date(),
            yes: 2,
            no: 2,
        },
        {
            featureName: 'demo',
            appName: 'backend-api',
            environment: 'dev',
            timestamp: new Date(),
            yes: 1,
            no: 3,
        },
        {
            featureName: 'demo',
            appName: 'backend-api',
            environment: 'dev',
            timestamp: new Date(),
            yes: 1,
            no: 3,
        },
    ];
    await clientMetricsStore.batchInsertMetrics(metrics);
    const apps = await clientMetricsStore.getSeenAppsForFeatureToggle('demo');
    expect(apps).toHaveLength(2);
    expect(apps).toStrictEqual(['backend-api', 'web']);
});
test('Should not fail on empty list of metrics', async () => {
    await clientMetricsStore.batchInsertMetrics([]);
    const all = await clientMetricsStore.getAll();
    expect(all).toHaveLength(0);
});
test('Should not fail on undefined list of metrics', async () => {
    await clientMetricsStore.batchInsertMetrics(undefined);
    const all = await clientMetricsStore.getAll();
    expect(all).toHaveLength(0);
});
test('Should return delete old metric', async () => {
    const twoDaysAgo = (0, date_fns_1.subDays)(Date.now(), 2);
    const metrics = [
        {
            featureName: 'demo1',
            appName: 'web',
            environment: 'dev',
            timestamp: new Date(),
            yes: 2,
            no: 2,
        },
        {
            featureName: 'demo2',
            appName: 'backend-api',
            environment: 'dev',
            timestamp: new Date(),
            yes: 1,
            no: 3,
        },
        {
            featureName: 'demo3',
            appName: 'backend-api',
            environment: 'dev',
            timestamp: twoDaysAgo,
            yes: 1,
            no: 3,
        },
        {
            featureName: 'demo4',
            appName: 'backend-api',
            environment: 'dev',
            timestamp: twoDaysAgo,
            yes: 1,
            no: 3,
        },
    ];
    await clientMetricsStore.batchInsertMetrics(metrics);
    await clientMetricsStore.clearMetrics(24);
    const all = await clientMetricsStore.getAll();
    expect(all).toHaveLength(2);
    expect(all[0].featureName).toBe('demo1');
    expect(all[1].featureName).toBe('demo2');
});
test('Should get metric', async () => {
    const twoDaysAgo = (0, date_fns_1.subDays)(Date.now(), 2);
    const metrics = [
        {
            featureName: 'demo1',
            appName: 'web',
            environment: 'dev',
            timestamp: new Date(),
            yes: 2,
            no: 2,
        },
        {
            featureName: 'demo2',
            appName: 'backend-api',
            environment: 'dev',
            timestamp: new Date(),
            yes: 1,
            no: 3,
        },
        {
            featureName: 'demo3',
            appName: 'backend-api',
            environment: 'dev',
            timestamp: twoDaysAgo,
            yes: 1,
            no: 3,
        },
        {
            featureName: 'demo4',
            appName: 'backend-api',
            environment: 'dev',
            timestamp: twoDaysAgo,
            yes: 41,
            no: 42,
        },
    ];
    await clientMetricsStore.batchInsertMetrics(metrics);
    const metric = await clientMetricsStore.get({
        featureName: 'demo4',
        timestamp: twoDaysAgo,
        appName: 'backend-api',
        environment: 'dev',
    });
    expect(metric.featureName).toBe('demo4');
    expect(metric.yes).toBe(41);
    expect(metric.no).toBe(42);
});
test('Should not exist after delete', async () => {
    const metric = {
        featureName: 'demo4',
        appName: 'backend-api',
        environment: 'dev',
        timestamp: new Date(),
        yes: 41,
        no: 42,
    };
    const metrics = [metric];
    await clientMetricsStore.batchInsertMetrics(metrics);
    const existBefore = await clientMetricsStore.exists(metric);
    expect(existBefore).toBe(true);
    await clientMetricsStore.delete(metric);
    const existAfter = await clientMetricsStore.exists(metric);
    expect(existAfter).toBe(false);
});
//# sourceMappingURL=client-metrics-store-v2.e2e.test.js.map