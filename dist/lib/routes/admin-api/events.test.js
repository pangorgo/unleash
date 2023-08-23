"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const services_1 = require("../../services");
const test_config_1 = require("../../../test/config/test-config");
const store_1 = __importDefault(require("../../../test/fixtures/store"));
const app_1 = __importDefault(require("../../app"));
const events_1 = require("../../types/events");
async function getSetup(anonymise = false) {
    const base = `/random${Math.round(Math.random() * 1000)}`;
    const stores = (0, store_1.default)();
    const config = (0, test_config_1.createTestConfig)({
        server: { baseUriPath: base },
        experimental: { flags: { anonymiseEventLog: anonymise } },
    });
    const services = (0, services_1.createServices)(stores, config);
    const app = await (0, app_1.default)(config, stores, services);
    return { base, eventStore: stores.eventStore, request: (0, supertest_1.default)(app) };
}
test('should get empty events list via admin', async () => {
    expect.assertions(1);
    const { request, base } = await getSetup();
    return request
        .get(`${base}/api/admin/events`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.events.length === 0).toBe(true);
    });
});
test('should get events list via admin', async () => {
    const { request, base, eventStore } = await getSetup();
    eventStore.store(new events_1.FeatureCreatedEvent({
        createdBy: 'some@email.com',
        data: { name: 'test', project: 'default' },
        featureName: 'test',
        project: 'default',
        tags: [],
    }));
    const { body } = await request
        .get(`${base}/api/admin/events`)
        .expect('Content-Type', /json/)
        .expect(200);
    expect(body.events.length).toBe(1);
    expect(body.events[0].createdBy).toBe('some@email.com');
});
test('should anonymise events list via admin', async () => {
    const { request, base, eventStore } = await getSetup(true);
    eventStore.store(new events_1.FeatureCreatedEvent({
        createdBy: 'some@email.com',
        data: { name: 'test', project: 'default' },
        featureName: 'test',
        project: 'default',
        tags: [],
    }));
    const { body } = await request
        .get(`${base}/api/admin/events`)
        .expect('Content-Type', /json/)
        .expect(200);
    expect(body.events.length).toBe(1);
    expect(body.events[0].createdBy).toBe('676212ff7@unleash.run');
});
test('should also anonymise email fields in data and preData properties', async () => {
    const email1 = 'test1@email.com';
    const email2 = 'test2@email.com';
    const { request, base, eventStore } = await getSetup(true);
    eventStore.store(new events_1.ProjectUserAddedEvent({
        createdBy: 'some@email.com',
        data: { name: 'test', project: 'default', email: email1 },
        project: 'default',
    }));
    eventStore.store(new events_1.ProjectUserRemovedEvent({
        createdBy: 'some@email.com',
        preData: { name: 'test', project: 'default', email: email2 },
        project: 'default',
    }));
    const { body } = await request
        .get(`${base}/api/admin/events`)
        .expect('Content-Type', /json/)
        .expect(200);
    expect(body.events.length).toBe(2);
    expect(body.events[0].data.email).not.toBe(email1);
    expect(body.events[1].preData.email).not.toBe(email2);
});
test('should anonymise any PII fields, no matter the depth', async () => {
    const testUsername = 'test-username';
    const { request, base, eventStore } = await getSetup(true);
    eventStore.store(new events_1.ProjectAccessAddedEvent({
        createdBy: 'some@email.com',
        data: {
            groups: [
                {
                    name: 'test',
                    project: 'default',
                    users: [{ username: testUsername }],
                },
            ],
        },
        project: 'default',
    }));
    const { body } = await request
        .get(`${base}/api/admin/events`)
        .expect('Content-Type', /json/)
        .expect(200);
    expect(body.events.length).toBe(1);
    expect(body.events[0].data.groups[0].users[0].username).not.toBe(testUsername);
});
//# sourceMappingURL=events.test.js.map