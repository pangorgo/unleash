"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prom_client_1 = require("prom-client");
const events_1 = __importDefault(require("events"));
const test_config_1 = require("../test/config/test-config");
const metric_events_1 = require("./metric-events");
const events_2 = require("./types/events");
const metrics_1 = require("./metrics");
const store_1 = __importDefault(require("../test/fixtures/store"));
const instance_stats_service_1 = require("./services/instance-stats-service");
const version_service_1 = __importDefault(require("./services/version-service"));
const monitor = (0, metrics_1.createMetricsMonitor)();
const eventBus = new events_1.default();
const prometheusRegister = prom_client_1.register;
let eventStore;
let statsService;
let stores;
beforeAll(() => {
    const config = (0, test_config_1.createTestConfig)({
        server: {
            serverMetrics: true,
        },
    });
    stores = (0, store_1.default)();
    eventStore = stores.eventStore;
    const versionService = new version_service_1.default(stores, config);
    statsService = new instance_stats_service_1.InstanceStatsService(stores, config, versionService);
    const db = {
        client: {
            pool: {
                min: 0,
                max: 4,
                numUsed: () => 2,
                numFree: () => 2,
                numPendingAcquires: () => 0,
                numPendingCreates: () => 1,
            },
        },
    };
    // @ts-ignore - We don't want a full knex implementation for our tests, it's enough that it actually yields the numbers we want.
    monitor.startMonitoring(config, stores, '4.0.0', eventBus, statsService, 
    //@ts-ignore
    db);
});
afterAll(() => {
    monitor.stopMonitoring();
});
test('should collect metrics for requests', async () => {
    eventBus.emit(metric_events_1.REQUEST_TIME, {
        path: 'somePath',
        method: 'GET',
        statusCode: 200,
        time: 1337,
    });
    const metrics = await prometheusRegister.metrics();
    expect(metrics).toMatch(/http_request_duration_milliseconds\{quantile="0\.99",path="somePath",method="GET",status="200",appName="undefined"\}.*1337/);
});
test('should collect metrics for updated toggles', async () => {
    stores.eventStore.emit(events_2.FEATURE_UPDATED, {
        featureName: 'TestToggle',
        project: 'default',
        data: { name: 'TestToggle' },
    });
    const metrics = await prometheusRegister.metrics();
    expect(metrics).toMatch(/feature_toggle_update_total\{toggle="TestToggle",project="default",environment="default"\} 1/);
});
test('should collect metrics for client metric reports', async () => {
    eventBus.emit(events_2.CLIENT_METRICS, {
        bucket: {
            toggles: {
                TestToggle: {
                    yes: 10,
                    no: 5,
                },
            },
        },
    });
    const metrics = await prometheusRegister.metrics();
    expect(metrics).toMatch(/feature_toggle_usage_total\{toggle="TestToggle",active="true",appName="undefined"\} 10\nfeature_toggle_usage_total\{toggle="TestToggle",active="false",appName="undefined"\} 5/);
});
test('should collect metrics for db query timings', async () => {
    eventBus.emit(metric_events_1.DB_TIME, {
        store: 'foo',
        action: 'bar',
        time: 0.1337,
    });
    const metrics = await prometheusRegister.metrics();
    expect(metrics).toMatch(/db_query_duration_seconds\{quantile="0\.99",store="foo",action="bar"\} 0.1337/);
});
test('should collect metrics for feature toggle size', async () => {
    await new Promise((done) => {
        setTimeout(done, 10);
    });
    const metrics = await prometheusRegister.metrics();
    expect(metrics).toMatch(/feature_toggles_total\{version="(.*)"\} 0/);
});
test('should collect metrics for total client apps', async () => {
    await new Promise((done) => {
        setTimeout(done, 10);
    });
    const metrics = await prometheusRegister.metrics();
    expect(metrics).toMatch(/client_apps_total\{range="(.*)"\} 0/);
});
test('Should collect metrics for database', async () => {
    const metrics = await prometheusRegister.metrics();
    expect(metrics).toMatch(/db_pool_max/);
    expect(metrics).toMatch(/db_pool_min/);
    expect(metrics).toMatch(/db_pool_used/);
    expect(metrics).toMatch(/db_pool_free/);
    expect(metrics).toMatch(/db_pool_pending_creates/);
    expect(metrics).toMatch(/db_pool_pending_acquires/);
});
test('Should collect metrics for client sdk versions', async () => {
    eventStore.emit(events_2.CLIENT_REGISTER, {
        sdkVersion: 'unleash-client-node:3.2.5',
    });
    eventStore.emit(events_2.CLIENT_REGISTER, {
        sdkVersion: 'unleash-client-node:3.2.5',
    });
    eventStore.emit(events_2.CLIENT_REGISTER, {
        sdkVersion: 'unleash-client-node:3.2.5',
    });
    eventStore.emit(events_2.CLIENT_REGISTER, {
        sdkVersion: 'unleash-client-java:5.0.0',
    });
    eventStore.emit(events_2.CLIENT_REGISTER, {
        sdkVersion: 'unleash-client-java:5.0.0',
    });
    eventStore.emit(events_2.CLIENT_REGISTER, {
        sdkVersion: 'unleash-client-java:5.0.0',
    });
    const metrics = await prometheusRegister.getSingleMetricAsString('client_sdk_versions');
    expect(metrics).toMatch(/client_sdk_versions\{sdk_name="unleash-client-node",sdk_version="3\.2\.5"\} 3/);
    expect(metrics).toMatch(/client_sdk_versions\{sdk_name="unleash-client-java",sdk_version="5\.0\.0"\} 3/);
    eventStore.emit(events_2.CLIENT_REGISTER, {
        sdkVersion: 'unleash-client-node:3.2.5',
    });
    const newmetrics = await prometheusRegister.getSingleMetricAsString('client_sdk_versions');
    expect(newmetrics).toMatch(/client_sdk_versions\{sdk_name="unleash-client-node",sdk_version="3\.2\.5"\} 4/);
});
test('Should not collect client sdk version if sdkVersion is of wrong format or non-existent', async () => {
    eventStore.emit(events_2.CLIENT_REGISTER, { sdkVersion: 'unleash-client-rust' });
    eventStore.emit(events_2.CLIENT_REGISTER, {});
    const metrics = await prometheusRegister.getSingleMetricAsString('client_sdk_versions');
    expect(metrics).not.toMatch(/unleash-client-rust/);
});
//# sourceMappingURL=metrics.test.js.map