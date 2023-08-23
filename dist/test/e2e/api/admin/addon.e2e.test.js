"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../../helpers/database-init"));
const test_helper_1 = require("../../helpers/test-helper");
const no_logger_1 = __importDefault(require("../../../fixtures/no-logger"));
const MASKED_VALUE = '*****';
let app;
let db;
beforeAll(async () => {
    db = await (0, database_init_1.default)('addon_api_serial', no_logger_1.default);
    app = await (0, test_helper_1.setupAppWithCustomConfig)(db.stores, {
        experimental: {
            flags: {
                strictSchemaValidation: true,
                slackAppAddon: true,
            },
        },
    });
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
test('gets all addons', async () => {
    expect.assertions(3);
    return app.request
        .get('/api/admin/addons')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.addons.length).toBe(0);
        expect(res.body.providers.length).toBe(5);
        expect(res.body.providers[0].name).toBe('webhook');
    });
});
test('should not be able to create invalid addon', async () => {
    expect.assertions(0);
    return app.request
        .post('/api/admin/addons')
        .send({ invalid: 'field' })
        .expect(400);
});
test('should create addon configuration', async () => {
    expect.assertions(0);
    const config = {
        provider: 'webhook',
        enabled: true,
        parameters: {
            url: 'http://localhost:4242/webhook',
            bodyTemplate: "{'name': '{{event.data.name}}' }",
        },
        events: ['feature-updated', 'feature-created'],
    };
    return app.request.post('/api/admin/addons').send(config).expect(201);
});
test('should delete addon configuration', async () => {
    expect.assertions(0);
    const config = {
        provider: 'webhook',
        enabled: true,
        parameters: {
            url: 'http://localhost:4242/webhook',
            bodyTemplate: "{'name': '{{event.data.name}}' }",
        },
        events: ['feature-updated', 'feature-created'],
    };
    const res = await app.request
        .post('/api/admin/addons')
        .send(config)
        .expect(201);
    const { id } = res.body;
    await app.request.delete(`/api/admin/addons/${id}`).expect(200);
});
test('should update addon configuration', async () => {
    expect.assertions(2);
    const config = {
        provider: 'webhook',
        enabled: true,
        parameters: {
            url: 'http://localhost:4242/webhook',
            bodyTemplate: "{'name': '{{event.data.name}}' }",
        },
        events: ['feature-updated', 'feature-created'],
    };
    const res = await app.request
        .post('/api/admin/addons')
        .send(config)
        .expect(201);
    const { id } = res.body;
    const updatedConfig = {
        parameters: {
            url: 'http://example.com',
            bodyTemplate: "{'name': '{{event.data.name}}' }",
        },
        ...config,
    };
    await app.request
        .put(`/api/admin/addons/${id}`)
        .send(updatedConfig)
        .expect(200);
    return app.request
        .get(`/api/admin/addons/${id}`)
        .send(config)
        .expect(200)
        .expect((r) => {
        expect(r.body.parameters.url).toBe(MASKED_VALUE);
        expect(r.body.parameters.bodyTemplate).toBe(updatedConfig.parameters.bodyTemplate);
    });
});
test('should not update with invalid addon configuration', async () => {
    expect.assertions(0);
    const config = {
        enabled: true,
        parameters: {
            url: 'http://localhost:4242/webhook',
            bodyTemplate: "{'name': '{{event.data.name}}' }",
        },
        events: ['feature-updated', 'feature-created'],
    };
    await app.request.put('/api/admin/addons/1').send(config).expect(400);
});
test('should not update unknown addon configuration', async () => {
    expect.assertions(0);
    const config = {
        provider: 'webhook',
        enabled: true,
        parameters: {
            url: 'http://localhost:4242/webhook',
            bodyTemplate: "{'name': '{{event.data.name}}' }",
        },
        events: ['feature-updated', 'feature-created'],
    };
    await app.request.put('/api/admin/addons/123123').send(config).expect(404);
});
test('should get addon configuration', async () => {
    expect.assertions(3);
    const config = {
        provider: 'webhook',
        enabled: true,
        parameters: {
            url: 'http://localhost:4242/webhook',
            bodyTemplate: "{'name': '{{event.data.name}}' }",
        },
        events: ['feature-updated', 'feature-created'],
    };
    const res = await app.request
        .post('/api/admin/addons')
        .send(config)
        .expect(201);
    const { id } = res.body;
    await app.request
        .get(`/api/admin/addons/${id}`)
        .expect(200)
        .expect((r) => {
        expect(r.body.provider).toBe(config.provider);
        expect(r.body.parameters.bodyTemplate).toBe(config.parameters.bodyTemplate);
        expect(r.body.parameters.url).toBe(MASKED_VALUE);
    });
});
test('should not get unknown addon configuration', async () => {
    expect.assertions(0);
    await app.request.get('/api/admin/addons/445').expect(404);
});
test('should not delete unknown addon configuration', async () => {
    expect.assertions(0);
    return app.request.delete('/api/admin/addons/21231').expect(404);
});
test("should return 400 if it doesn't recognize the provider", async () => {
    const payload = {
        provider: 'htni',
        enabled: true,
        parameters: {},
        events: [],
    };
    return app.request.post('/api/admin/addons').send(payload).expect(400);
});
test('updating an addon returns the new addon configuration', async () => {
    const config = {
        provider: 'webhook',
        enabled: true,
        parameters: {
            url: 'http://localhost:4242/webhook',
        },
        events: [],
    };
    const { body } = await app.request.post('/api/admin/addons').send(config);
    const updatedConfig = {
        ...config,
        enabled: false,
        parameters: { url: 'http://new-url:4343' },
    };
    return app.request
        .put(`/api/admin/addons/${body.id}`)
        .send(updatedConfig)
        .expect((res) => {
        expect(res.body).toMatchObject(updatedConfig);
    });
});
describe('missing descriptions', () => {
    const addonWithoutDescription = {
        provider: 'webhook',
        enabled: true,
        parameters: {
            url: 'http://localhost:4242/webhook',
        },
        events: ['feature-created', 'feature-updated'],
    };
    test('creating an addon without a description, sets the description to `null`', async () => {
        const { body } = await app.request
            .post('/api/admin/addons')
            .send(addonWithoutDescription)
            .expect((res) => {
            expect(res.body.description).toBeNull();
        });
        return app.request
            .get(`/api/admin/addons/${body.id}`)
            .expect((getResponse) => {
            expect(getResponse.body.description).toBeNull();
        });
    });
    test('updating an addon without touching `description` keeps the original value', async () => {
        const { body } = await app.request
            .post('/api/admin/addons')
            .send(addonWithoutDescription);
        const newUrl = 'http://localhost:4242/newUrl';
        return app.request
            .put(`/api/admin/addons/${body.id}`)
            .send({ ...addonWithoutDescription, parameters: { url: newUrl } })
            .expect((res) => {
            expect(res.body.description).toBeNull();
        });
    });
    test.each(['', null])('sending a description value of "%s", sets a `null` sets the description to an empty string', async (description) => {
        const { body } = await app.request
            .post('/api/admin/addons')
            .send(addonWithoutDescription);
        return app.request
            .put(`/api/admin/addons/${body.id}`)
            .send({
            ...addonWithoutDescription,
            description,
        })
            .expect((res) => {
            expect(res.body.description).toStrictEqual('');
        });
    });
});
//# sourceMappingURL=addon.e2e.test.js.map