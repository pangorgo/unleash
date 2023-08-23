"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../fixtures/no-logger"));
const user_service_1 = __importDefault(require("../../../lib/services/user-service"));
const access_service_1 = require("../../../lib/services/access-service");
const reset_token_service_1 = __importDefault(require("../../../lib/services/reset-token-service"));
const email_service_1 = require("../../../lib/services/email-service");
const test_config_1 = require("../../config/test-config");
const session_service_1 = __importDefault(require("../../../lib/services/session-service"));
const notfound_error_1 = __importDefault(require("../../../lib/error/notfound-error"));
const model_1 = require("../../../lib/types/model");
const setting_service_1 = __importDefault(require("../../../lib/services/setting-service"));
const simple_auth_settings_1 = require("../../../lib/types/settings/simple-auth-settings");
const date_fns_1 = require("date-fns");
const group_service_1 = require("../../../lib/services/group-service");
const random_id_1 = require("../../../lib/util/random-id");
const error_1 = require("../../../lib/error");
const password_mismatch_1 = __importDefault(require("../../../lib/error/password-mismatch"));
let db;
let stores;
let userService;
let userStore;
let adminRole;
let viewerRole;
let sessionService;
let settingService;
beforeAll(async () => {
    db = await (0, database_init_1.default)('user_service_serial', no_logger_1.default);
    stores = db.stores;
    const config = (0, test_config_1.createTestConfig)();
    const groupService = new group_service_1.GroupService(stores, config);
    const accessService = new access_service_1.AccessService(stores, config, groupService);
    const resetTokenService = new reset_token_service_1.default(stores, config);
    const emailService = new email_service_1.EmailService(undefined, config.getLogger);
    sessionService = new session_service_1.default(stores, config);
    settingService = new setting_service_1.default(stores, config);
    userService = new user_service_1.default(stores, config, {
        accessService,
        resetTokenService,
        emailService,
        sessionService,
        settingService,
    });
    userStore = stores.userStore;
    const rootRoles = await accessService.getRootRoles();
    adminRole = rootRoles.find((r) => r.name === model_1.RoleName.ADMIN);
    viewerRole = rootRoles.find((r) => r.name === model_1.RoleName.VIEWER);
});
afterAll(async () => {
    await db.destroy();
});
afterEach(async () => {
    await userStore.deleteAll();
});
test('should create initial admin user', async () => {
    await userService.initAdminUser();
    await expect(async () => userService.loginUser('admin', 'wrong-password')).rejects.toThrow(Error);
    await expect(async () => userService.loginUser('admin', 'unleash4all')).toBeTruthy();
});
test('should not init default user if we already have users', async () => {
    await userService.createUser({
        username: 'test',
        password: 'A very strange P4ssw0rd_',
        rootRole: adminRole.id,
    });
    await userService.initAdminUser();
    const users = await userService.getAll();
    expect(users).toHaveLength(1);
    expect(users[0].username).toBe('test');
    await expect(async () => userService.loginUser('admin', 'unleash4all')).rejects.toThrow(Error);
});
test('should not be allowed to create existing user', async () => {
    await userStore.insert({ username: 'test', name: 'Hans Mola' });
    await expect(async () => userService.createUser({ username: 'test', rootRole: adminRole.id })).rejects.toThrow(Error);
});
test('should create user with password', async () => {
    await userService.createUser({
        username: 'test',
        password: 'A very strange P4ssw0rd_',
        rootRole: adminRole.id,
    });
    const user = await userService.loginUser('test', 'A very strange P4ssw0rd_');
    expect(user.username).toBe('test');
});
test('should not be able to login with deleted user', async () => {
    const user = await userService.createUser({
        username: 'deleted_user',
        password: 'unleash4all',
        rootRole: adminRole.id,
    });
    await userService.deleteUser(user.id);
    await expect(userService.loginUser('deleted_user', 'unleash4all')).rejects.toThrow(new password_mismatch_1.default(`The combination of password and username you provided is invalid. If you have forgotten your password, visit /forgotten-password or get in touch with your instance administrator.`));
});
test('should not be able to login without password_hash on user', async () => {
    const user = await userService.createUser({
        username: 'deleted_user',
        password: 'unleash4all',
        rootRole: adminRole.id,
    });
    /*@ts-ignore: we are testing for null on purpose! */
    await userStore.setPasswordHash(user.id, null);
    await expect(userService.loginUser('deleted_user', 'anything-should-fail')).rejects.toThrow(new password_mismatch_1.default(`The combination of password and username you provided is invalid. If you have forgotten your password, visit /forgotten-password or get in touch with your instance administrator.`));
});
test('should not login user if simple auth is disabled', async () => {
    await settingService.insert(simple_auth_settings_1.simpleAuthSettingsKey, { disabled: true }, (0, random_id_1.randomId)());
    await userService.createUser({
        username: 'test_no_pass',
        password: 'A very strange P4ssw0rd_',
        rootRole: adminRole.id,
    });
    await expect(async () => {
        await userService.loginUser('test_no_pass', 'A very strange P4ssw0rd_');
    }).rejects.toThrowError('Logging in with username/password has been disabled.');
});
test('should login for user _without_ password', async () => {
    const email = 'some@test.com';
    await userService.createUser({
        email,
        password: 'A very strange P4ssw0rd_',
        rootRole: adminRole.id,
    });
    const user = await userService.loginUserWithoutPassword(email);
    expect(user.email).toBe(email);
});
test('should get user with root role', async () => {
    const email = 'some@test.com';
    const u = await userService.createUser({
        email,
        password: 'A very strange P4ssw0rd_',
        rootRole: adminRole.id,
    });
    const user = await userService.getUser(u.id);
    expect(user.email).toBe(email);
    expect(user.id).toBe(u.id);
    expect(user.rootRole).toBe(adminRole.id);
});
test('should get user with root role by name', async () => {
    const email = 'some2@test.com';
    const u = await userService.createUser({
        email,
        password: 'A very strange P4ssw0rd_',
        rootRole: model_1.RoleName.ADMIN,
    });
    const user = await userService.getUser(u.id);
    expect(user.email).toBe(email);
    expect(user.id).toBe(u.id);
    expect(user.rootRole).toBe(adminRole.id);
});
test("deleting a user should delete the user's sessions", async () => {
    const email = 'some@test.com';
    const user = await userService.createUser({
        email,
        password: 'A very strange P4ssw0rd_',
        rootRole: adminRole.id,
    });
    const testComSession = {
        sid: 'xyz321',
        sess: {
            cookie: {
                originalMaxAge: (0, date_fns_1.minutesToMilliseconds)(48),
                expires: (0, date_fns_1.addDays)(Date.now(), 1).toDateString(),
                secure: false,
                httpOnly: true,
                path: '/',
            },
            user,
        },
    };
    await sessionService.insertSession(testComSession);
    const userSessions = await sessionService.getSessionsForUser(user.id);
    expect(userSessions.length).toBe(1);
    await userService.deleteUser(user.id);
    await expect(async () => sessionService.getSessionsForUser(user.id)).rejects.toThrow(notfound_error_1.default);
});
test('updating a user without an email should not strip the email', async () => {
    const email = 'some@test.com';
    const user = await userService.createUser({
        email,
        password: 'A very strange P4ssw0rd_',
        rootRole: adminRole.id,
    });
    await userService.updateUser({
        id: user.id,
        name: 'some',
    });
    const updatedUser = await userService.getUser(user.id);
    expect(updatedUser.email).toBe(email);
});
test('should login and create user via SSO', async () => {
    const email = 'some@test.com';
    const user = await userService.loginUserSSO({
        email,
        rootRole: model_1.RoleName.VIEWER,
        name: 'some',
        autoCreate: true,
    });
    const userWithRole = await userService.getUser(user.id);
    expect(user.email).toBe(email);
    expect(user.name).toBe('some');
    expect(userWithRole.name).toBe('some');
    expect(userWithRole.rootRole).toBe(viewerRole.id);
});
test('should throw if rootRole is wrong via SSO', async () => {
    expect.assertions(1);
    await expect(userService.loginUserSSO({
        email: 'some@test.com',
        rootRole: model_1.RoleName.MEMBER,
        name: 'some',
        autoCreate: true,
    })).rejects.toThrow(new error_1.BadDataError(`Could not find rootRole=Member`));
});
test('should update user name when signing in via SSO', async () => {
    const email = 'some@test.com';
    const originalUser = await userService.createUser({
        email,
        rootRole: model_1.RoleName.VIEWER,
        name: 'some',
    });
    await userService.loginUserSSO({
        email,
        rootRole: model_1.RoleName.ADMIN,
        name: 'New name!',
        autoCreate: true,
    });
    const actualUser = await userService.getUser(originalUser.id);
    expect(actualUser.email).toBe(email);
    expect(actualUser.name).toBe('New name!');
    expect(actualUser.rootRole).toBe(viewerRole.id);
});
test('should update name if it is different via SSO', async () => {
    const email = 'some@test.com';
    const originalUser = await userService.createUser({
        email,
        rootRole: model_1.RoleName.VIEWER,
        name: 'some',
    });
    await userService.loginUserSSO({
        email,
        rootRole: model_1.RoleName.ADMIN,
        name: 'New name!',
        autoCreate: false,
    });
    const actualUser = await userService.getUser(originalUser.id);
    expect(actualUser.email).toBe(email);
    expect(actualUser.name).toBe('New name!');
    expect(actualUser.rootRole).toBe(viewerRole.id);
});
test('should throw if autoCreate is false via SSO', async () => {
    expect.assertions(1);
    await expect(userService.loginUserSSO({
        email: 'some@test.com',
        rootRole: model_1.RoleName.MEMBER,
        name: 'some',
        autoCreate: false,
    })).rejects.toThrow(new notfound_error_1.default(`No user found`));
});
//# sourceMappingURL=user-service.e2e.test.js.map