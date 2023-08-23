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
beforeAll(async () => {
    db = await (0, database_init_1.default)('metrics_serial', no_logger_1.default);
    app = await (0, test_helper_1.setupApp)(db.stores);
});
beforeEach(async () => {
    await app.services.clientInstanceService.createApplication({
        appName: 'demo-app-1',
        strategies: ['default'],
        //@ts-ignore
        announced: true,
    });
    await app.services.clientInstanceService.createApplication({
        appName: 'demo-app-2',
        strategies: ['default', 'extra'],
        description: 'hello',
        //@ts-ignore
        announced: true,
    });
    await app.services.clientInstanceService.createApplication({
        appName: 'deletable-app',
        strategies: ['default'],
        description: 'Some desc',
        //@ts-ignore
        announced: true,
    });
    await db.stores.clientInstanceStore.insert({
        appName: 'demo-app-1',
        instanceId: 'test-1',
    });
    await db.stores.clientInstanceStore.insert({
        appName: 'demo-seed-2',
        instanceId: 'test-2',
    });
    await db.stores.clientInstanceStore.insert({
        appName: 'deletable-app',
        instanceId: 'inst-1',
    });
});
afterAll(async () => {
    if (db) {
        await db.destroy();
    }
});
afterEach(async () => {
    await db.reset();
});
test('should get application details', async () => {
    return app.request
        .get('/api/admin/metrics/applications/demo-app-1')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.appName).toBe('demo-app-1');
        expect(res.body.instances).toHaveLength(1);
    });
});
test('should get list of applications', async () => {
    expect.assertions(1);
    return app.request
        .get('/api/admin/metrics/applications')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.applications).toHaveLength(3);
    });
});
test('should delete application', async () => {
    expect.assertions(2);
    await app.request
        .delete('/api/admin/metrics/applications/deletable-app')
        .expect((res) => {
        expect(res.status).toBe(200);
    });
    return app.request
        .get('/api/admin/metrics/applications')
        .expect('Content-Type', /json/)
        .expect((res) => {
        expect(res.body.applications).toHaveLength(2);
    });
});
test('deleting an application should be idempotent, so expect 200', async () => {
    expect.assertions(1);
    return app.request
        .delete('/api/admin/metrics/applications/unknown')
        .expect((res) => {
        expect(res.status).toBe(200);
    });
});
//# sourceMappingURL=metrics.e2e.test.js.map