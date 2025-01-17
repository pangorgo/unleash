"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const instance_service_1 = __importDefault(require("./instance-service"));
const date_fns_1 = require("date-fns");
const fake_event_store_1 = __importDefault(require("../../../test/fixtures/fake-event-store"));
const test_config_1 = require("../../../test/config/test-config");
/**
 * A utility to wait for any pending promises in the test subject code.
 * For instance, if the test needs to wait for a timeout/interval handler,
 * and that handler does something async, advancing the timers is not enough:
 * We have to explicitly wait for the second promise.
 * For more info, see https://stackoverflow.com/a/51045733/2868829
 *
 * Usage in test code after advancing timers, but before making assertions:
 *
 * test('hello', async () => {
 *    jest.useFakeTimers('modern');
 *
 *    // Schedule a timeout with a callback that does something async
 *    // before calling our spy
 *    const spy = jest.fn();
 *    setTimeout(async () => {
 *        await Promise.resolve();
 *        spy();
 *    }, 1000);
 *
 *    expect(spy).not.toHaveBeenCalled();
 *
 *    jest.advanceTimersByTime(1500);
 *    await flushPromises(); // this is required to make it work!
 *
 *    expect(spy).toHaveBeenCalledTimes(1);
 *
 *    jest.useRealTimers();
 * });
 */
function flushPromises() {
    return Promise.resolve(setImmediate);
}
let config;
beforeAll(() => {
    config = (0, test_config_1.createTestConfig)({});
});
test('Multiple registrations of same appname and instanceid within same time period should only cause one registration', async () => {
    jest.useFakeTimers();
    const appStoreSpy = jest.fn();
    const bulkSpy = jest.fn();
    const clientApplicationsStore = {
        bulkUpsert: appStoreSpy,
    };
    const clientInstanceStore = {
        bulkUpsert: bulkSpy,
    };
    const clientMetrics = new instance_service_1.default({
        clientMetricsStoreV2: null,
        strategyStore: null,
        featureToggleStore: null,
        clientApplicationsStore,
        clientInstanceStore,
        eventStore: new fake_event_store_1.default(),
    }, config);
    const client1 = {
        appName: 'test_app',
        instanceId: 'ava',
        strategies: [{ name: 'defaullt' }],
        started: new Date(),
        interval: 10,
    };
    await clientMetrics.registerClient(client1, '127.0.0.1');
    await clientMetrics.registerClient(client1, '127.0.0.1');
    await clientMetrics.registerClient(client1, '127.0.0.1');
    await clientMetrics.registerClient(client1, '127.0.0.1');
    jest.advanceTimersByTime(7000);
    await flushPromises();
    expect(appStoreSpy).toHaveBeenCalledTimes(1);
    expect(bulkSpy).toHaveBeenCalledTimes(1);
    const registrations = appStoreSpy.mock.calls[0][0];
    expect(registrations.length).toBe(1);
    expect(registrations[0].appName).toBe(client1.appName);
    expect(registrations[0].instanceId).toBe(client1.instanceId);
    expect(registrations[0].started).toBe(client1.started);
    expect(registrations[0].interval).toBe(client1.interval);
    jest.useRealTimers();
});
test('Multiple unique clients causes multiple registrations', async () => {
    jest.useFakeTimers();
    const appStoreSpy = jest.fn();
    const bulkSpy = jest.fn();
    const clientApplicationsStore = {
        bulkUpsert: appStoreSpy,
    };
    const clientInstanceStore = {
        bulkUpsert: bulkSpy,
    };
    const clientMetrics = new instance_service_1.default({
        clientMetricsStoreV2: null,
        strategyStore: null,
        featureToggleStore: null,
        clientApplicationsStore,
        clientInstanceStore,
        eventStore: new fake_event_store_1.default(),
    }, config);
    const client1 = {
        appName: 'test_app',
        instanceId: 'client1',
        strategies: [{ name: 'defaullt' }],
        started: new Date(),
        interval: 10,
    };
    const client2 = {
        appName: 'test_app_2',
        instanceId: 'client2',
        strategies: [{ name: 'defaullt' }],
        started: new Date(),
        interval: 10,
    };
    await clientMetrics.registerClient(client1, '127.0.0.1');
    await clientMetrics.registerClient(client1, '127.0.0.1');
    await clientMetrics.registerClient(client1, '127.0.0.1');
    await clientMetrics.registerClient(client2, '127.0.0.1');
    await clientMetrics.registerClient(client2, '127.0.0.1');
    await clientMetrics.registerClient(client2, '127.0.0.1');
    jest.advanceTimersByTime(7000);
    await flushPromises();
    const registrations = appStoreSpy.mock.calls[0][0];
    expect(registrations.length).toBe(2);
    jest.useRealTimers();
});
test('Same client registered outside of dedup interval will be registered twice', async () => {
    jest.useFakeTimers();
    const appStoreSpy = jest.fn();
    const bulkSpy = jest.fn();
    const clientApplicationsStore = {
        bulkUpsert: appStoreSpy,
    };
    const clientInstanceStore = {
        bulkUpsert: bulkSpy,
    };
    const bulkInterval = (0, date_fns_1.secondsToMilliseconds)(2);
    const clientMetrics = new instance_service_1.default({
        clientMetricsStoreV2: null,
        strategyStore: null,
        featureToggleStore: null,
        clientApplicationsStore,
        clientInstanceStore,
        eventStore: new fake_event_store_1.default(),
    }, config, bulkInterval);
    const client1 = {
        appName: 'test_app',
        instanceId: 'client1',
        strategies: [{ name: 'defaullt' }],
        started: new Date(),
        interval: 10,
    };
    await clientMetrics.registerClient(client1, '127.0.0.1');
    await clientMetrics.registerClient(client1, '127.0.0.1');
    await clientMetrics.registerClient(client1, '127.0.0.1');
    jest.advanceTimersByTime(3000);
    await clientMetrics.registerClient(client1, '127.0.0.1');
    await clientMetrics.registerClient(client1, '127.0.0.1');
    await clientMetrics.registerClient(client1, '127.0.0.1');
    jest.advanceTimersByTime(3000);
    await flushPromises();
    expect(appStoreSpy).toHaveBeenCalledTimes(2);
    expect(bulkSpy).toHaveBeenCalledTimes(2);
    const firstRegistrations = appStoreSpy.mock.calls[0][0][0];
    const secondRegistrations = appStoreSpy.mock.calls[1][0][0];
    expect(firstRegistrations.appName).toBe(secondRegistrations.appName);
    expect(firstRegistrations.instanceId).toBe(secondRegistrations.instanceId);
    jest.useRealTimers();
});
test('No registrations during a time period will not call stores', async () => {
    jest.useFakeTimers();
    const appStoreSpy = jest.fn();
    const bulkSpy = jest.fn();
    const clientApplicationsStore = {
        bulkUpsert: appStoreSpy,
    };
    const clientInstanceStore = {
        bulkUpsert: bulkSpy,
    };
    new instance_service_1.default({
        clientMetricsStoreV2: null,
        strategyStore: null,
        featureToggleStore: null,
        clientApplicationsStore,
        clientInstanceStore,
        eventStore: new fake_event_store_1.default(),
    }, config);
    jest.advanceTimersByTime(6000);
    expect(appStoreSpy).toHaveBeenCalledTimes(0);
    expect(bulkSpy).toHaveBeenCalledTimes(0);
    jest.useRealTimers();
});
//# sourceMappingURL=instance-service.test.js.map