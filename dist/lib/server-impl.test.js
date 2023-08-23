"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const test_config_1 = require("../test/config/test-config");
const server_impl_1 = require("./server-impl");
const fake_event_store_1 = __importDefault(require("../test/fixtures/fake-event-store"));
jest.mock('./routes', () => class Index {
    router() {
        return express_1.default.Router();
    }
});
const noop = () => { };
const eventStore = new fake_event_store_1.default();
const settingStore = {
    get: () => {
        Promise.resolve('secret');
    },
};
jest.mock('./metrics', () => ({
    createMetricsMonitor() {
        return {
            startMonitoring: noop,
            stopMonitoring: noop,
        };
    },
}));
jest.mock('./db', () => ({
    createStores() {
        return {
            db: {
                destroy: () => undefined,
            },
            clientInstanceStore: {
                destroy: noop,
                removeInstancesOlderThanTwoDays: noop,
            },
            clientMetricsStore: { destroy: noop, on: noop },
            eventStore,
            publicSignupTokenStore: { destroy: noop, on: noop },
            settingStore,
            projectStore: { getAll: () => Promise.resolve([]) },
        };
    },
}));
jest.mock('../migrator', () => ({
    migrateDb: () => Promise.resolve(),
}));
jest.mock('./util/db-lock', () => ({
    withDbLock: () => (fn) => fn,
}));
jest.mock('./util/version', () => function () {
    return 'unleash-test-version';
});
test('should call preHook', async () => {
    let called = 0;
    const config = (0, test_config_1.createTestConfig)({
        server: { port: 0 },
        preHook: () => {
            called++;
        },
    });
    const { stop } = await (0, server_impl_1.start)(config);
    expect(called).toBe(1);
    await stop();
});
test('should call preRouterHook', async () => {
    let called = 0;
    const { stop } = await (0, server_impl_1.start)((0, test_config_1.createTestConfig)({
        server: { port: 0 },
        preRouterHook: () => {
            called++;
        },
    }));
    expect(called === 1).toBe(true);
    await stop();
});
test('should auto-create server on start()', async () => {
    const { server, stop } = await (0, server_impl_1.start)((0, test_config_1.createTestConfig)({ server: { port: 0 } }));
    expect(typeof server === 'undefined').toBe(false);
    await stop();
});
test('should not create a server using create()', async () => {
    const config = (0, test_config_1.createTestConfig)({ server: { port: 0 } });
    const { server, stop } = await (0, server_impl_1.create)(config);
    expect(server).toBeUndefined();
    await stop();
});
test('should shutdown the server when calling stop()', async () => {
    const { server, stop } = await (0, server_impl_1.start)((0, test_config_1.createTestConfig)({ server: { port: 0 } }));
    await stop();
    expect(server.address()).toBe(null);
});
//# sourceMappingURL=server-impl.test.js.map