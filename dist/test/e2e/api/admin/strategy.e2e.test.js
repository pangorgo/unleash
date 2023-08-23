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
    db = await (0, database_init_1.default)('strategy_api_serial', no_logger_1.default);
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
test('gets all strategies', async () => {
    expect.assertions(1);
    return app.request
        .get('/api/admin/strategies')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.strategies).toHaveLength(2);
    });
});
test('gets a strategy by name', async () => {
    expect.assertions(0);
    return app.request
        .get('/api/admin/strategies/default')
        .expect('Content-Type', /json/)
        .expect(200);
});
test('cant get a strategy by name that does not exist', async () => {
    expect.assertions(0);
    return app.request
        .get('/api/admin/strategies/mystrategy')
        .expect('Content-Type', /json/)
        .expect(404);
});
test('creates a new strategy', async () => {
    expect.assertions(0);
    return app.request
        .post('/api/admin/strategies')
        .send({
        name: 'myCustomStrategy',
        description: 'Best strategy ever.',
        parameters: [],
    })
        .set('Content-Type', 'application/json')
        .expect(201);
});
test('requires new strategies to have a name', async () => {
    expect.assertions(0);
    return app.request
        .post('/api/admin/strategies')
        .send({ name: '' })
        .set('Content-Type', 'application/json')
        .expect(400);
});
test('refuses to create a strategy with an existing name', async () => {
    expect.assertions(0);
    return app.request
        .post('/api/admin/strategies')
        .send({ name: 'default', parameters: [] })
        .set('Content-Type', 'application/json')
        .expect(409);
});
test('deletes a new strategy', async () => {
    expect.assertions(0);
    return app.request
        .delete('/api/admin/strategies/usersWithEmail')
        .expect(200);
});
test("can't delete a strategy that dose not exist", async () => {
    expect.assertions(0);
    return app.request.delete('/api/admin/strategies/unknown').expect(404);
});
test('updates a exiting strategy', async () => {
    expect.assertions(0);
    return app.request
        .put('/api/admin/strategies/default')
        .send({
        name: 'default',
        description: 'Default is the best!',
        parameters: [],
    })
        .set('Content-Type', 'application/json')
        .expect(200);
});
test('cant update a unknown strategy', async () => {
    expect.assertions(0);
    return app.request
        .put('/api/admin/strategies/unknown')
        .send({ name: 'unkown', parameters: [] })
        .set('Content-Type', 'application/json')
        .expect(404);
});
test('deprecating a strategy works', async () => {
    const name = 'deprecate';
    await app.request
        .post('/api/admin/strategies')
        .send({ name, description: 'Should deprecate this', parameters: [] })
        .set('Content-Type', 'application/json')
        .expect(201);
    await app.request
        .post(`/api/admin/strategies/${name}/deprecate`)
        .set('Content-Type', 'application/json')
        .send()
        .expect(200);
    await app.request
        .get(`/api/admin/strategies/${name}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.deprecated).toBe(true));
});
test('can reactivate a deprecated strategy', async () => {
    const name = 'reactivate';
    await app.request
        .post('/api/admin/strategies')
        .send({ name, description: 'Should deprecate this', parameters: [] })
        .set('Content-Type', 'application/json')
        .expect(201);
    await app.request
        .post(`/api/admin/strategies/${name}/deprecate`)
        .set('Content-Type', 'application/json')
        .send()
        .expect(200);
    await app.request
        .get(`/api/admin/strategies/${name}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.deprecated).toBe(true));
    await app.request
        .post(`/api/admin/strategies/${name}/reactivate`)
        .set('Content-Type', 'application/json')
        .send()
        .expect(200);
    await app.request
        .get(`/api/admin/strategies/${name}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.deprecated).toBe(false));
});
test('can update a exiting strategy with deprecated', async () => {
    await app.request
        .post('/api/admin/strategies')
        .send({
        name: 'myCustomStrategyDeprecated',
        description: 'Best strategy ever.',
        parameters: [],
        deprecated: true,
    })
        .set('Content-Type', 'application/json')
        .expect(201);
    const { body: strategy } = await app.request.get('/api/admin/strategies/myCustomStrategyDeprecated');
    strategy.description = 'A new desc';
    return app.request
        .put('/api/admin/strategies/myCustomStrategyDeprecated')
        .send(strategy)
        .set('Content-Type', 'application/json')
        .expect(200);
});
test('can create a strategy with a title', async () => {
    await app.request
        .post('/api/admin/strategies')
        .send({
        name: 'myCustomStrategyWithTitle',
        description: 'Best strategy ever.',
        parameters: [],
        title: 'This is the best strategy ever',
    })
        .set('Content-Type', 'application/json')
        .expect(201);
    const { body: strategy } = await app.request.get('/api/admin/strategies/myCustomStrategyWithTitle');
    expect(strategy.title).toBe('This is the best strategy ever');
    strategy.description = 'A new desc';
    return app.request
        .put('/api/admin/strategies/myCustomStrategyWithTitle')
        .send(strategy)
        .set('Content-Type', 'application/json')
        .expect(200);
});
test('can update a strategy with a title', async () => {
    await app.request
        .post('/api/admin/strategies')
        .send({
        name: 'myCustomStrategy2',
        description: 'Best strategy ever.',
        parameters: [],
    })
        .set('Content-Type', 'application/json')
        .expect(201);
    const { body: strategy } = await app.request.get('/api/admin/strategies/myCustomStrategy2');
    strategy.title = 'This is the best strategy ever';
    return app.request
        .put('/api/admin/strategies/myCustomStrategy2')
        .send(strategy)
        .set('Content-Type', 'application/json')
        .expect(200);
});
//# sourceMappingURL=strategy.e2e.test.js.map