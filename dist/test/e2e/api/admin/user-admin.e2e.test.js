"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../../helpers/test-helper");
const database_init_1 = __importDefault(require("../../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../../fixtures/no-logger"));
const events_1 = require("../../../../lib/types/events");
const model_1 = require("../../../../lib/types/model");
const random_id_1 = require("../../../../lib/util/random-id");
const omit_keys_1 = require("../../../../lib/util/omit-keys");
let stores;
let db;
let app;
let userStore;
let eventStore;
let roleStore;
let sessionStore;
let editorRole;
let adminRole;
beforeAll(async () => {
    db = await (0, database_init_1.default)('user_admin_api_serial', no_logger_1.default);
    stores = db.stores;
    app = await (0, test_helper_1.setupAppWithCustomConfig)(stores, {
        experimental: {
            flags: {
                strictSchemaValidation: true,
            },
        },
    });
    userStore = stores.userStore;
    eventStore = stores.eventStore;
    roleStore = stores.roleStore;
    sessionStore = stores.sessionStore;
    const roles = await roleStore.getRootRoles();
    editorRole = roles.find((r) => r.name === model_1.RoleName.EDITOR);
    adminRole = roles.find((r) => r.name === model_1.RoleName.ADMIN);
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
afterEach(async () => {
    await userStore.deleteAll();
});
test('returns empty list of users', async () => {
    return app.request
        .get('/api/admin/user-admin')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.users.length).toBe(0);
    });
});
test('creates and returns all users', async () => {
    const createUserRequests = [...Array(10).keys()].map((i) => app.request
        .post('/api/admin/user-admin')
        .send({
        email: `some${i}@getunleash.ai`,
        name: `Some Name ${i}`,
        rootRole: editorRole.id,
    })
        .set('Content-Type', 'application/json'));
    await Promise.all(createUserRequests);
    return app.request
        .get('/api/admin/user-admin')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.users.length).toBe(10);
        expect(res.body.users[2].rootRole).toBe(editorRole.id);
    });
});
test('creates editor-user without password', async () => {
    return app.request
        .post('/api/admin/user-admin')
        .send({
        email: 'some@getunelash.ai',
        name: 'Some Name',
        rootRole: editorRole.id,
    })
        .set('Content-Type', 'application/json')
        .expect(201)
        .expect((res) => {
        expect(res.body.email).toBe('some@getunelash.ai');
        expect(res.body.rootRole).toBe(editorRole.id);
        expect(res.body.id).toBeTruthy();
    });
});
test('creates admin-user with password', async () => {
    const { body } = await app.request
        .post('/api/admin/user-admin')
        .send({
        email: 'some@getunelash.ai',
        name: 'Some Name',
        password: 'some-strange-pass-123-GH',
        rootRole: adminRole.id,
    })
        .set('Content-Type', 'application/json')
        .expect(201);
    expect(body.rootRole).toBe(adminRole.id);
    const user = await userStore.getByQuery({ id: body.id });
    expect(user.email).toBe('some@getunelash.ai');
    expect(user.name).toBe('Some Name');
    const passwordHash = userStore.getPasswordHash(body.id);
    expect(passwordHash).toBeTruthy();
    const roles = await stores.accessStore.getRolesForUserId(body.id);
    expect(roles.length).toBe(1);
    expect(roles[0].name).toBe(model_1.RoleName.ADMIN);
});
test('requires known root role', async () => {
    return app.request
        .post('/api/admin/user-admin')
        .send({
        email: 'some@getunelash.ai',
        name: 'Some Name',
        rootRole: 'Unknown',
    })
        .set('Content-Type', 'application/json')
        .expect(400);
});
test('should require username or email on create', async () => {
    await app.request
        .post('/api/admin/user-admin')
        .send({ rootRole: adminRole.id })
        .set('Content-Type', 'application/json')
        .expect(400)
        .expect((res) => {
        expect(res.body.details[0].description).toEqual('You must specify username or email');
    });
});
test('update user name', async () => {
    const { body } = await app.request
        .post('/api/admin/user-admin')
        .send({
        email: 'some@getunelash.ai',
        name: 'Some Name',
        rootRole: editorRole.id,
    })
        .set('Content-Type', 'application/json');
    return app.request
        .put(`/api/admin/user-admin/${body.id}`)
        .send({
        name: 'New name',
    })
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect((res) => {
        expect(res.body.email).toBe('some@getunelash.ai');
        expect(res.body.name).toBe('New name');
        expect(res.body.id).toBe(body.id);
    });
});
test('should not require any fields on update', async () => {
    const { body: created } = await app.request
        .post('/api/admin/user-admin')
        .send({ email: `${(0, random_id_1.randomId)()}@example.com`, rootRole: editorRole.id })
        .set('Content-Type', 'application/json')
        .expect(201);
    const { body: updated } = await app.request
        .put(`/api/admin/user-admin/${created.id}`)
        .send({})
        .set('Content-Type', 'application/json')
        .expect(200);
    expect(updated).toEqual((0, omit_keys_1.omitKeys)(created, 'emailSent', 'inviteLink', 'rootRole'));
});
test('get a single user', async () => {
    const { body } = await app.request
        .post('/api/admin/user-admin')
        .send({
        email: 'some2@getunelash.ai',
        name: 'Some Name 2',
        rootRole: editorRole.id,
    })
        .set('Content-Type', 'application/json');
    const { body: user } = await app.request
        .get(`/api/admin/user-admin/${body.id}`)
        .expect(200);
    expect(user.email).toBe('some2@getunelash.ai');
    expect(user.name).toBe('Some Name 2');
    expect(user.id).toBe(body.id);
});
test('should delete user', async () => {
    const user = await userStore.insert({ email: 'some@mail.com' });
    await app.request.delete(`/api/admin/user-admin/${user.id}`).expect(200);
    await app.request.get(`/api/admin/user-admin/${user.id}`).expect(404);
});
test('validator should require strong password', async () => {
    return app.request
        .post('/api/admin/user-admin/validate-password')
        .send({ password: 'simple' })
        .expect(400);
});
test('validator should accept strong password', async () => {
    return app.request
        .post('/api/admin/user-admin/validate-password')
        .send({ password: 'simple123-_ASsad' })
        .expect(200);
});
test('should change password', async () => {
    const user = await userStore.insert({ email: 'some@mail.com' });
    const spy = jest.spyOn(sessionStore, 'deleteSessionsForUser');
    await app.request
        .post(`/api/admin/user-admin/${user.id}/change-password`)
        .send({ password: 'simple123-_ASsad' })
        .expect(200);
    expect(spy).toHaveBeenCalled();
});
test('should search for users', async () => {
    await userStore.insert({ email: 'some@mail.com' });
    await userStore.insert({ email: 'another@mail.com' });
    await userStore.insert({ email: 'another2@mail.com' });
    return app.request
        .get('/api/admin/user-admin/search?q=another')
        .expect(200)
        .expect((res) => {
        expect(res.body.length).toBe(2);
        expect(res.body.some((u) => u.email === 'another@mail.com')).toBe(true);
    });
});
test('Creates a user and includes inviteLink and emailConfigured', async () => {
    return app.request
        .post('/api/admin/user-admin')
        .send({
        email: 'some@getunelash.ai',
        name: 'Some Name',
        rootRole: editorRole.id,
    })
        .set('Content-Type', 'application/json')
        .expect(201)
        .expect((res) => {
        expect(res.body.email).toBe('some@getunelash.ai');
        expect(res.body.rootRole).toBe(editorRole.id);
        expect(res.body.inviteLink).toBeTruthy();
        expect(res.body.emailSent).toBeFalsy();
        expect(res.body.id).toBeTruthy();
    });
});
test('Creates a user but does not send email if sendEmail is set to false', async () => {
    const myAppConfig = await (0, test_helper_1.setupAppWithCustomConfig)(stores, {
        email: {
            host: 'smtp.ethereal.email',
            smtpuser: 'rafaela.pouros@ethereal.email',
            smtppass: 'CuVPBSvUFBPuqXMFEe',
        },
    });
    await myAppConfig.request
        .post('/api/admin/user-admin')
        .send({
        email: 'some@getunelash.ai',
        name: 'Some Name',
        rootRole: editorRole.id,
        sendEmail: false,
    })
        .set('Content-Type', 'application/json')
        .expect(201)
        .expect((res) => {
        expect(res.body.emailSent).toBeFalsy();
    });
    await myAppConfig.request
        .post('/api/admin/user-admin')
        .send({
        email: 'some2@getunelash.ai',
        name: 'Some2 Name',
        rootRole: editorRole.id,
    })
        .set('Content-Type', 'application/json')
        .expect(201)
        .expect((res) => {
        expect(res.body.emailSent).toBeTruthy();
    });
    await myAppConfig.destroy();
});
test('generates USER_CREATED event', async () => {
    const email = 'some@getunelash.ai';
    const name = 'Some Name';
    const { body } = await app.request
        .post('/api/admin/user-admin')
        .send({
        email,
        name,
        password: 'some-strange-pass-123-GH',
        rootRole: adminRole.id,
    })
        .set('Content-Type', 'application/json')
        .expect(201);
    const events = await eventStore.getEvents();
    expect(events[0].type).toBe(events_1.USER_CREATED);
    expect(events[0].data.email).toBe(email);
    expect(events[0].data.name).toBe(name);
    expect(events[0].data.id).toBe(body.id);
    expect(events[0].data.password).toBeFalsy();
});
test('generates USER_DELETED event', async () => {
    const user = await userStore.insert({ email: 'some@mail.com' });
    await app.request.delete(`/api/admin/user-admin/${user.id}`).expect(200);
    const events = await eventStore.getEvents();
    expect(events[0].type).toBe(events_1.USER_DELETED);
    expect(events[0].preData.id).toBe(user.id);
    expect(events[0].preData.email).toBe(user.email);
});
test('generates USER_UPDATED event', async () => {
    const { body } = await app.request
        .post('/api/admin/user-admin')
        .send({
        email: 'some@getunelash.ai',
        name: 'Some Name',
        rootRole: editorRole.id,
    })
        .set('Content-Type', 'application/json');
    await app.request
        .put(`/api/admin/user-admin/${body.id}`)
        .send({
        name: 'New name',
    })
        .set('Content-Type', 'application/json');
    const events = await eventStore.getEvents();
    expect(events[0].type).toBe(events_1.USER_UPDATED);
    expect(events[0].data.id).toBe(body.id);
    expect(events[0].data.name).toBe('New name');
});
test('Anonymises name, username and email fields if anonymiseEventLog flag is set', async () => {
    let anonymisedApp = await (0, test_helper_1.setupAppWithCustomConfig)(stores, { experimental: { flags: { anonymiseEventLog: true } } }, db);
    await anonymisedApp.request
        .post('/api/admin/user-admin')
        .send({
        email: 'some@getunleash.ai',
        name: 'Some Name',
        rootRole: editorRole.id,
    })
        .set('Content-Type', 'application/json');
    let response = await anonymisedApp.request.get('/api/admin/user-admin/access');
    let body = response.body;
    expect(body.users[0].email).toEqual('aeb83743e@unleash.run');
    expect(body.users[0].name).toEqual('3a8b17647@unleash.run');
    expect(body.users[0].username).toEqual(''); // Not set, so anonymise should return the empty string.
});
//# sourceMappingURL=user-admin.e2e.test.js.map