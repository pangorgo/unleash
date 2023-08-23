"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = __importDefault(require("../../test/fixtures/store"));
const test_config_1 = require("../../test/config/test-config");
const services_1 = require("../services");
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const permissions_1 = __importDefault(require("../../test/fixtures/permissions"));
const model_1 = require("../types/model");
describe('Public Signup API', () => {
    async function getSetup() {
        const stores = (0, store_1.default)();
        const perms = (0, permissions_1.default)();
        const config = (0, test_config_1.createTestConfig)({
            preRouterHook: perms.hook,
        });
        stores.accessStore = {
            ...stores.accessStore,
            addUserToRole: jest.fn(),
            removeRolesOfTypeForUser: jest.fn(),
        };
        const services = (0, services_1.createServices)(stores, config);
        const app = await (0, app_1.default)(config, stores, services);
        await stores.roleStore.create({
            name: model_1.RoleName.VIEWER,
            roleType: model_1.RoleType.ROOT,
            description: '',
        });
        await stores.roleStore.create({
            name: model_1.RoleName.ADMIN,
            roleType: model_1.RoleType.ROOT,
            description: '',
        });
        return {
            request: (0, supertest_1.default)(app),
            stores,
            perms,
            destroy: () => {
                services.versionService.destroy();
                services.clientInstanceService.destroy();
                services.publicSignupTokenService.destroy();
            },
        };
    }
    let stores;
    let request;
    let destroy;
    const user = {
        username: 'some-username',
        email: 'someEmail@example.com',
        name: 'some-name',
        password: 'password',
    };
    beforeEach(async () => {
        const setup = await getSetup();
        stores = setup.stores;
        request = setup.request;
        destroy = setup.destroy;
    });
    afterEach(() => {
        destroy();
    });
    const expireAt = (addDays = 7) => {
        let now = new Date();
        now.setDate(now.getDate() + addDays);
        return now;
    };
    const createBody = () => ({
        name: 'some-name',
        expiresAt: expireAt(),
    });
    test('should create user and add to token', async () => {
        expect.assertions(3);
        const appName = '123!23';
        stores.clientApplicationsStore.upsert({ appName });
        stores.publicSignupTokenStore.create({
            name: 'some-name',
            expiresAt: expireAt(),
        });
        return request
            .post('/invite/some-secret/signup')
            .send(user)
            .expect(201)
            .expect(async (res) => {
            const count = await stores.userStore.count();
            expect(count).toBe(1);
            const eventCount = await stores.eventStore.count();
            expect(eventCount).toBe(2); //USER_CREATED && PUBLIC_SIGNUP_TOKEN_USER_ADDED
            expect(res.body.username).toBe(user.username);
        });
    });
    test('Should validate required fields', async () => {
        const appName = '123!23';
        stores.clientApplicationsStore.upsert({ appName });
        stores.publicSignupTokenStore.create({
            name: 'some-name',
            expiresAt: expireAt(),
        });
        await request
            .post('/invite/some-secret/signup')
            .send({ name: 'test' })
            .expect(400);
        await request
            .post('/invite/some-secret/signup')
            .send({ email: 'test@test.com' })
            .expect(400);
        await request
            .post('/invite/some-secret/signup')
            .send({ ...user, rootRole: 1 })
            .expect(400);
        await request.post('/invite/some-secret/signup').send({}).expect(400);
    });
    test('should not be able to send root role in signup request body', async () => {
        const appName = '123!23';
        stores.clientApplicationsStore.upsert({ appName });
        stores.publicSignupTokenStore.create({
            name: 'some-name',
            expiresAt: expireAt(),
        });
        const roles = await stores.roleStore.getAll();
        const adminId = roles.find((role) => role.name === model_1.RoleName.ADMIN).id;
        return request
            .post('/invite/some-secret/signup')
            .send({ ...user, rootRole: adminId })
            .expect(400);
    });
    test('should not allow a user to register with expired token', async () => {
        const appName = '123!23';
        stores.clientApplicationsStore.upsert({ appName });
        stores.publicSignupTokenStore.create({
            name: 'some-name',
            expiresAt: expireAt(-1),
        });
        return request
            .post('/invite/some-secret/signup')
            .send(user)
            .expect(400);
    });
    test('should not allow a user to register disabled token', async () => {
        const appName = '123!23';
        stores.clientApplicationsStore.upsert({ appName });
        stores.publicSignupTokenStore.create({
            name: 'some-name',
            expiresAt: expireAt(),
        });
        stores.publicSignupTokenStore.update('some-secret', { enabled: false });
        return request
            .post('/invite/some-secret/signup')
            .send(user)
            .expect(400);
    });
    test('should return 200 if token is valid', async () => {
        const appName = '123!23';
        stores.clientApplicationsStore.upsert({ appName });
        // Create a token
        const res = await request
            .post('/api/admin/invite-link/tokens')
            .send(createBody())
            .expect(201);
        const { secret } = res.body;
        return request.get(`/invite/${secret}/validate`).expect(200);
    });
    test('should return 400 if token is invalid', async () => {
        const appName = '123!23';
        stores.clientApplicationsStore.upsert({ appName });
        return request.get('/invite/some-invalid-secret/validate').expect(400);
    });
});
//# sourceMappingURL=public-invite.test.js.map