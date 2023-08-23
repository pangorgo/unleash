"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../../../helpers/database-init"));
const test_helper_1 = require("../../../helpers/test-helper");
const no_logger_1 = __importDefault(require("../../../../fixtures/no-logger"));
let app;
let db;
let projectStore;
beforeAll(async () => {
    db = await (0, database_init_1.default)('projects_api_serial', no_logger_1.default);
    app = await (0, test_helper_1.setupAppWithCustomConfig)(db.stores, {
        experimental: {
            flags: {
                strictSchemaValidation: true,
            },
        },
    });
    projectStore = db.stores.projectStore;
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
test('Should ONLY return default project', async () => {
    projectStore.create({
        id: 'test2',
        name: 'test',
        description: '',
        mode: 'open',
        defaultStickiness: 'default',
    });
    const { body } = await app.request
        .get('/api/admin/projects')
        .expect(200)
        .expect('Content-Type', /json/);
    expect(body.projects).toHaveLength(1);
    expect(body.projects[0].id).toBe('default');
});
test('response should include created_at', async () => {
    const { body } = await app.request
        .get('/api/admin/projects')
        .expect('Content-Type', /json/)
        .expect(200);
    expect(body.projects[0].createdAt).toBeDefined();
});
test('response for default project should include created_at', async () => {
    const { body } = await app.request
        .get('/api/admin/projects/default')
        .expect('Content-Type', /json/)
        .expect(200);
    expect(body.createdAt).toBeDefined();
});
//# sourceMappingURL=projects.e2e.test.js.map