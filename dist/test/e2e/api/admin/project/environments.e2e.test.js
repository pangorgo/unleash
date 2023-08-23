"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../../../helpers/database-init"));
const test_helper_1 = require("../../../helpers/test-helper");
const no_logger_1 = __importDefault(require("../../../../fixtures/no-logger"));
const util_1 = require("../../../../../lib/util");
let app;
let db;
beforeAll(async () => {
    db = await (0, database_init_1.default)('project_environments_api_serial', no_logger_1.default);
    app = await (0, test_helper_1.setupAppWithCustomConfig)(db.stores, {
        experimental: {
            flags: {
                strictSchemaValidation: true,
            },
        },
    });
});
afterEach(async () => {
    const all = await db.stores.projectStore.getEnvironmentsForProject('default');
    await Promise.all(all
        .filter((env) => env.environment !== util_1.DEFAULT_ENV)
        .map(async (env) => db.stores.projectStore.deleteEnvironmentForProject('default', env.environment)));
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
test('Should add environment to project', async () => {
    // Endpoint to create env does not exists anymore
    await db.stores.environmentStore.create({
        name: 'test',
        type: 'test',
    });
    await app.request
        .post('/api/admin/projects/default/environments')
        .send({ environment: 'test' })
        .expect(200);
    const envs = await db.stores.projectStore.getEnvironmentsForProject('default');
    const environment = envs.find((env) => env.environment === 'test');
    expect(environment).toBeDefined();
    expect(envs).toHaveLength(2);
});
test('Should validate environment', async () => {
    await app.request
        .post('/api/admin/projects/default/environments')
        .send({ name: 'test' })
        .expect(400);
});
test('Should remove environment from project', async () => {
    const name = 'test-delete';
    // Endpoint to create env does not exists anymore
    await db.stores.environmentStore.create({
        name,
        type: 'test',
    });
    // Endpoint to delete project does not exist anymore
    await app.request
        .post('/api/admin/projects/default/environments')
        .send({ environment: name })
        .expect(200);
    await app.request
        .delete(`/api/admin/projects/default/environments/${name}`)
        .expect(200);
    const envs = await db.stores.projectStore.getEnvironmentsForProject('default');
    expect(envs).toHaveLength(1);
});
test('Should not remove environment from project if project only has one environment enabled', async () => {
    await app.request
        .delete(`/api/admin/projects/default/environments/default`)
        .expect(400)
        .expect((r) => {
        expect(r.body.details[0].description).toBe('You must always have one active environment');
    });
    const envs = await db.stores.projectStore.getEnvironmentsForProject('default');
    expect(envs).toHaveLength(1);
});
test('Should add default strategy to environment', async () => {
    await app.request
        .post(`/api/admin/projects/default/environments/default/default-strategy`)
        .send({
        name: 'flexibleRollout',
        constraints: [],
        parameters: {
            rollout: '50',
            stickiness: 'customAppName',
            groupId: 'stickytoggle',
        },
    })
        .expect(200);
    const envs = await db.stores.projectStore.getEnvironmentsForProject('default');
    expect(envs).toHaveLength(1);
    expect(envs[0]).toStrictEqual({
        environment: 'default',
        defaultStrategy: {
            name: 'flexibleRollout',
            constraints: [],
            parameters: {
                rollout: '50',
                stickiness: 'customAppName',
                groupId: 'stickytoggle',
            },
        },
    });
});
test('Should throw an error if you try to set defaultStrategy other than flexibleRollout', async () => {
    await app.request
        .post(`/api/admin/projects/default/environments/default/default-strategy`)
        .send({
        name: 'default',
        constraints: [],
        parameters: {},
    })
        .expect(400);
});
//# sourceMappingURL=environments.e2e.test.js.map