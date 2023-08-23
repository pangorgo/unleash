"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const test_config_1 = require("../test/config/test-config");
jest.mock('./routes', () => class Index {
    router() {
        return express_1.default.Router();
    }
});
const getApp = require('./app').default;
test('should not throw when valid config', async () => {
    const config = (0, test_config_1.createTestConfig)();
    const app = await getApp(config, {}, {});
    expect(typeof app.listen).toBe('function');
});
test('should call preHook', async () => {
    let called = 0;
    const config = (0, test_config_1.createTestConfig)({
        preHook: () => {
            called++;
        },
    });
    await getApp(config, {}, {});
    expect(called).toBe(1);
});
test('should call preRouterHook', async () => {
    let called = 0;
    const config = (0, test_config_1.createTestConfig)({
        preRouterHook: () => {
            called++;
        },
    });
    await getApp(config, {}, {});
    expect(called).toBe(1);
});
//# sourceMappingURL=app.test.js.map