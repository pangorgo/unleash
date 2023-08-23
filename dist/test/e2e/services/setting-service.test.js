"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const setting_service_1 = __importDefault(require("../../../lib/services/setting-service"));
const test_config_1 = require("../../config/test-config");
const database_init_1 = __importDefault(require("../helpers/database-init"));
const events_1 = require("../../../lib/types/events");
let stores;
let db;
let service;
beforeAll(async () => {
    const config = (0, test_config_1.createTestConfig)();
    db = await (0, database_init_1.default)('setting_service_serial', config.getLogger);
    stores = db.stores;
    service = new setting_service_1.default(stores, config);
});
beforeEach(async () => {
    await stores.eventStore.deleteAll();
});
afterAll(async () => {
    await db.destroy();
});
test('Can create new setting', async () => {
    const someData = { some: 'blob' };
    await service.insert('some-setting', someData, 'test-user');
    const actual = await service.get('some-setting');
    expect(actual).toStrictEqual(someData);
    const { eventStore } = stores;
    const createdEvents = await eventStore.searchEvents({
        type: events_1.SETTING_CREATED,
    });
    expect(createdEvents).toHaveLength(1);
});
test('Can delete setting', async () => {
    const someData = { some: 'blob' };
    await service.insert('some-setting', someData, 'test-user');
    await service.delete('some-setting', 'test-user');
    const actual = await service.get('some-setting');
    expect(actual).toBeUndefined();
    const { eventStore } = stores;
    const createdEvents = await eventStore.searchEvents({
        type: events_1.SETTING_DELETED,
    });
    expect(createdEvents).toHaveLength(1);
});
test('Can update setting', async () => {
    const { eventStore } = stores;
    const someData = { some: 'blob' };
    await service.insert('updated-setting', someData, 'test-user');
    await service.insert('updated-setting', { ...someData, test: 'fun' }, 'test-user');
    const updatedEvents = await eventStore.searchEvents({
        type: events_1.SETTING_UPDATED,
    });
    expect(updatedEvents).toHaveLength(1);
});
//# sourceMappingURL=setting-service.test.js.map