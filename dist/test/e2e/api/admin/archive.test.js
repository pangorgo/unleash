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
    db = await (0, database_init_1.default)('archive_test_serial', no_logger_1.default);
    app = await (0, test_helper_1.setupAppWithCustomConfig)(db.stores, {
        experimental: {
            flags: {
                strictSchemaValidation: true,
            },
        },
    });
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
test('Should get empty features via admin', async () => {
    await app.request
        .get('/api/admin/archive/features')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
        expect(res.body.features).toHaveLength(0);
    });
});
test('Should be allowed to reuse deleted toggle name', async () => {
    await app.request
        .post('/api/admin/projects/default/features')
        .send({
        name: 'ts.really.delete',
        archived: true,
    })
        .expect(201);
    await app.request
        .post('/api/admin/features/validate')
        .send({ name: 'ts.really.delete' })
        .expect(409);
    await app.request.delete('/api/admin/archive/ts.really.delete').expect(200);
    await app.request
        .post('/api/admin/features/validate')
        .send({ name: 'ts.really.delete' })
        .expect(200);
});
test('Should get archived toggles via admin', async () => {
    await app.request
        .post('/api/admin/projects/default/features')
        .send({
        name: 'archived.test.1',
        archived: true,
    })
        .expect(201);
    await app.request
        .post('/api/admin/projects/default/features')
        .send({
        name: 'archived.test.2',
        archived: true,
    })
        .expect(201);
    await app.request
        .get('/api/admin/archive/features')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
        expect(res.body.features).toHaveLength(2);
    });
});
test('Should get archived toggles via project', async () => {
    await db.stores.featureToggleStore.deleteAll();
    await db.stores.projectStore.create({
        id: 'proj-1',
        name: 'proj-1',
        description: '',
        mode: 'open',
    });
    await db.stores.projectStore.create({
        id: 'proj-2',
        name: 'proj-2',
        description: '',
        mode: 'open',
    });
    await db.stores.featureToggleStore.create('proj-1', {
        name: 'feat-proj-1',
        archived: true,
    });
    await db.stores.featureToggleStore.create('proj-2', {
        name: 'feat-proj-2',
        archived: true,
    });
    await db.stores.featureToggleStore.create('proj-2', {
        name: 'feat-proj-2-2',
        archived: true,
    });
    await app.request
        .get('/api/admin/archive/features/proj-1')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
        expect(res.body.features).toHaveLength(1);
    });
    await app.request
        .get('/api/admin/archive/features/proj-2')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
        expect(res.body.features).toHaveLength(2);
    });
    await app.request
        .get('/api/admin/archive/features')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
        expect(res.body.features).toHaveLength(3);
    });
});
test('Should be able to revive toggle', async () => {
    await app.request.post('/api/admin/projects/default/features').send({
        name: 'archived.revival',
        archived: true,
    });
    await app.request
        .post('/api/admin/archive/revive/archived.revival')
        .send({})
        .expect(200);
});
test('Reviving a non-existing toggle should yield 404', async () => {
    await app.request
        .post('/api/admin/archive/revive/non.existing')
        .send({})
        .expect(404);
});
//# sourceMappingURL=archive.test.js.map