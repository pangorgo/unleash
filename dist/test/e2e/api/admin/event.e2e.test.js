"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../../helpers/test-helper");
const database_init_1 = __importDefault(require("../../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../../fixtures/no-logger"));
const events_1 = require("../../../../lib/types/events");
const random_id_1 = require("../../../../lib/util/random-id");
let app;
let db;
let eventStore;
beforeAll(async () => {
    db = await (0, database_init_1.default)('event_api_serial', no_logger_1.default);
    app = await (0, test_helper_1.setupAppWithCustomConfig)(db.stores, {
        experimental: {
            flags: {
                strictSchemaValidation: true,
            },
        },
    });
    eventStore = db.stores.eventStore;
});
beforeEach(async () => {
    await eventStore.deleteAll();
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
test('returns events', async () => {
    expect.assertions(0);
    return app.request
        .get('/api/admin/events')
        .expect('Content-Type', /json/)
        .expect(200);
});
test('returns events given a name', async () => {
    expect.assertions(0);
    return app.request
        .get('/api/admin/events/myname')
        .expect('Content-Type', /json/)
        .expect(200);
});
test('Can filter by project', async () => {
    await eventStore.store({
        type: events_1.FEATURE_CREATED,
        project: 'something-else',
        data: { id: 'some-other-feature' },
        tags: [],
        createdBy: 'test-user',
        environment: 'test',
    });
    await eventStore.store({
        type: events_1.FEATURE_CREATED,
        project: 'default',
        data: { id: 'feature' },
        tags: [],
        createdBy: 'test-user',
        environment: 'test',
    });
    await app.request
        .get('/api/admin/events?project=default')
        .expect(200)
        .expect((res) => {
        expect(res.body.events).toHaveLength(1);
        expect(res.body.events[0].data.id).toEqual('feature');
    });
});
test('can search for events', async () => {
    const events = [
        {
            type: events_1.FEATURE_CREATED,
            project: (0, random_id_1.randomId)(),
            data: { id: (0, random_id_1.randomId)() },
            tags: [],
            createdBy: (0, random_id_1.randomId)(),
        },
        {
            type: events_1.FEATURE_CREATED,
            project: (0, random_id_1.randomId)(),
            data: { id: (0, random_id_1.randomId)() },
            preData: { id: (0, random_id_1.randomId)() },
            tags: [],
            createdBy: (0, random_id_1.randomId)(),
        },
    ];
    await Promise.all(events.map((event) => {
        return eventStore.store(event);
    }));
    await app.request
        .post('/api/admin/events/search')
        .send({})
        .expect(200)
        .expect((res) => {
        expect(res.body.events).toHaveLength(2);
    });
    await app.request
        .post('/api/admin/events/search')
        .send({ limit: 1, offset: 1 })
        .expect(200)
        .expect((res) => {
        expect(res.body.events).toHaveLength(1);
        expect(res.body.events[0].data.id).toEqual(events[0].data.id);
    });
    await app.request
        .post('/api/admin/events/search')
        .send({ query: events[1].data.id })
        .expect(200)
        .expect((res) => {
        expect(res.body.events).toHaveLength(1);
        expect(res.body.events[0].data.id).toEqual(events[1].data.id);
    });
    await app.request
        .post('/api/admin/events/search')
        .send({ query: events[1].preData.id })
        .expect(200)
        .expect((res) => {
        expect(res.body.events).toHaveLength(1);
        expect(res.body.events[0].preData.id).toEqual(events[1].preData.id);
    });
});
//# sourceMappingURL=event.e2e.test.js.map