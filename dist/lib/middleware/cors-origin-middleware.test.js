"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_origin_middleware_1 = require("./cors-origin-middleware");
const fake_setting_store_1 = __importDefault(require("../../test/fixtures/fake-setting-store"));
const test_config_1 = require("../../test/config/test-config");
const fake_event_store_1 = __importDefault(require("../../test/fixtures/fake-event-store"));
const random_id_1 = require("../util/random-id");
const fake_project_store_1 = __importDefault(require("../../test/fixtures/fake-project-store"));
const services_1 = require("../../lib/services");
const frontend_settings_1 = require("../../lib/types/settings/frontend-settings");
const date_fns_1 = require("date-fns");
const createSettingService = (frontendApiOrigins) => {
    const config = (0, test_config_1.createTestConfig)({ frontendApiOrigins });
    const stores = {
        settingStore: new fake_setting_store_1.default(),
        eventStore: new fake_event_store_1.default(),
        projectStore: new fake_project_store_1.default(),
    };
    const services = {
        settingService: new services_1.SettingService(stores, config),
    };
    return {
        //@ts-ignore
        proxyService: new services_1.ProxyService(config, stores, services),
        settingStore: stores.settingStore,
    };
};
test('resolveOrigin', () => {
    const dotCom = 'https://example.com';
    const dotOrg = 'https://example.org';
    expect((0, cors_origin_middleware_1.resolveOrigin)([])).toEqual('*');
    expect((0, cors_origin_middleware_1.resolveOrigin)(['*'])).toEqual('*');
    expect((0, cors_origin_middleware_1.resolveOrigin)([dotOrg])).toEqual([dotOrg]);
    expect((0, cors_origin_middleware_1.resolveOrigin)([dotCom, dotOrg])).toEqual([dotCom, dotOrg]);
    expect((0, cors_origin_middleware_1.resolveOrigin)([dotOrg, '*'])).toEqual('*');
});
test('corsOriginMiddleware origin validation', async () => {
    const { proxyService } = createSettingService([]);
    const userName = (0, random_id_1.randomId)();
    await expect(() => proxyService.setFrontendSettings({ frontendApiOrigins: ['a'] }, userName)).rejects.toThrow('Invalid origin: a');
    proxyService.destroy();
});
test('corsOriginMiddleware without config', async () => {
    const { proxyService, settingStore } = createSettingService([]);
    const userName = (0, random_id_1.randomId)();
    expect(await proxyService.getFrontendSettings(false)).toEqual({
        frontendApiOrigins: [],
    });
    await proxyService.setFrontendSettings({ frontendApiOrigins: [] }, userName);
    expect(await proxyService.getFrontendSettings(false)).toEqual({
        frontendApiOrigins: [],
    });
    await proxyService.setFrontendSettings({ frontendApiOrigins: ['*'] }, userName);
    expect(await proxyService.getFrontendSettings(false)).toEqual({
        frontendApiOrigins: ['*'],
    });
    await settingStore.delete(frontend_settings_1.frontendSettingsKey);
    expect(await proxyService.getFrontendSettings(false)).toEqual({
        frontendApiOrigins: [],
    });
    proxyService.destroy();
});
test('corsOriginMiddleware with config', async () => {
    const { proxyService, settingStore } = createSettingService(['*']);
    const userName = (0, random_id_1.randomId)();
    expect(await proxyService.getFrontendSettings(false)).toEqual({
        frontendApiOrigins: ['*'],
    });
    await proxyService.setFrontendSettings({ frontendApiOrigins: [] }, userName);
    expect(await proxyService.getFrontendSettings(false)).toEqual({
        frontendApiOrigins: [],
    });
    await proxyService.setFrontendSettings({ frontendApiOrigins: ['https://example.com', 'https://example.org'] }, userName);
    expect(await proxyService.getFrontendSettings(false)).toEqual({
        frontendApiOrigins: ['https://example.com', 'https://example.org'],
    });
    await settingStore.delete(frontend_settings_1.frontendSettingsKey);
    expect(await proxyService.getFrontendSettings(false)).toEqual({
        frontendApiOrigins: ['*'],
    });
    proxyService.destroy();
});
test('corsOriginMiddleware with caching enabled', async () => {
    jest.useFakeTimers();
    const { proxyService } = createSettingService([]);
    const userName = (0, random_id_1.randomId)();
    expect(await proxyService.getFrontendSettings()).toEqual({
        frontendApiOrigins: [],
    });
    //setting
    await proxyService.setFrontendSettings({ frontendApiOrigins: ['*'] }, userName);
    //still get cached value
    expect(await proxyService.getFrontendSettings()).toEqual({
        frontendApiOrigins: [],
    });
    jest.advanceTimersByTime((0, date_fns_1.minutesToMilliseconds)(2));
    jest.useRealTimers();
    /*
    This is needed because it is not enough to fake time to test the
    updated cache, we also need to make sure that all promises are
    executed and completed, in the right order.
    */
    await new Promise((resolve) => process.nextTick(async () => {
        const settings = await proxyService.getFrontendSettings();
        expect(settings).toEqual({
            frontendApiOrigins: ['*'],
        });
        resolve();
    }));
    proxyService.destroy();
});
//# sourceMappingURL=cors-origin-middleware.test.js.map