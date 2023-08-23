"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../../helpers/database-init"));
const test_helper_1 = require("../../helpers/test-helper");
const no_logger_1 = __importDefault(require("../../../fixtures/no-logger"));
let app;
let db;
let stores;
beforeAll(async () => {
    db = await (0, database_init_1.default)('instance_admin_api_serial', no_logger_1.default);
    stores = db.stores;
    await stores.settingStore.insert('instanceInfo', { id: 'test-static' });
    app = await (0, test_helper_1.setupApp)(stores);
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
test('should return instance statistics', async () => {
    stores.featureToggleStore.create('default', { name: 'TestStats1' });
    return app.request
        .get('/api/admin/instance-admin/statistics')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.featureToggles).toBe(1);
    });
});
test('should return instance statistics with correct number of projects', async () => {
    await stores.projectStore.create({
        id: 'test',
        name: 'Test',
        description: 'lorem',
        mode: 'open',
    });
    return app.request
        .get('/api/admin/instance-admin/statistics')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.projects).toBe(2);
    });
});
test('should return signed instance statistics', async () => {
    return app.request
        .get('/api/admin/instance-admin/statistics')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.instanceId).toBe('test-static');
        expect(res.body.sum).toBe('5ba2cb7c3e29f4e5b3382c560b92b837f3603dc7db73a501ec331c7f0ed17bd0');
    });
});
test('should return instance statistics as CVS', async () => {
    stores.featureToggleStore.create('default', { name: 'TestStats2' });
    stores.featureToggleStore.create('default', { name: 'TestStats3' });
    const res = await app.request
        .get('/api/admin/instance-admin/statistics/csv')
        .expect('Content-Type', /text\/csv/)
        .expect(200);
    expect(res.text).toMatch(/featureToggles/);
    expect(res.text).toMatch(/"sum"/);
});
//# sourceMappingURL=instance-admin.e2e.test.js.map