"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../fixtures/no-logger"));
const test_config_1 = require("../../config/test-config");
const addon_service_1 = __importDefault(require("../../../lib/services/addon-service"));
const addon_service_test_simple_addon_1 = __importDefault(require("../../../lib/services/addon-service-test-simple-addon"));
const tag_type_service_1 = __importDefault(require("../../../lib/services/tag-type-service"));
const events_1 = require("../../../lib/types/events");
const addonProvider = { simple: new addon_service_test_simple_addon_1.default() };
let db;
let stores;
let addonService;
beforeAll(async () => {
    const config = (0, test_config_1.createTestConfig)({
        server: { baseUriPath: '/test' },
    });
    db = await (0, database_init_1.default)('addon_service_serial', no_logger_1.default);
    stores = db.stores;
    const tagTypeService = new tag_type_service_1.default(stores, config);
    addonService = new addon_service_1.default(stores, config, tagTypeService, addonProvider);
});
afterAll(async () => {
    if (db) {
        await db.destroy();
    }
});
afterEach(async () => {
    const addons = await stores.addonStore.getAll();
    const deleteAll = addons.map((a) => stores.addonStore.delete(a.id));
    await Promise.all(deleteAll);
});
test('should only return active addons', async () => {
    jest.useFakeTimers();
    const config = {
        provider: 'simple',
        enabled: false,
        parameters: {
            url: 'http://localhost/wh',
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
        description: '',
    };
    const config2 = {
        provider: 'simple',
        enabled: true,
        parameters: {
            url: 'http://localhost/wh',
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
        description: '',
    };
    const config3 = {
        provider: 'simple',
        enabled: true,
        parameters: {
            url: 'http://localhost/wh',
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
        description: '',
    };
    await addonService.createAddon(config, 'me@mail.com');
    await addonService.createAddon(config2, 'me@mail.com');
    await addonService.createAddon(config3, 'me@mail.com');
    jest.advanceTimersByTime(61000);
    const activeAddons = await addonService.fetchAddonConfigs();
    const allAddons = await addonService.getAddons();
    expect(activeAddons.length).toBe(2);
    expect(allAddons.length).toBe(3);
    jest.useRealTimers();
});
//# sourceMappingURL=addon-service.e2e.test.js.map