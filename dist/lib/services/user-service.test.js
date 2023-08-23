"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const user_service_1 = __importDefault(require("./user-service"));
const fake_user_store_1 = __importDefault(require("../../test/fixtures/fake-user-store"));
const fake_event_store_1 = __importDefault(require("../../test/fixtures/fake-event-store"));
const access_service_mock_1 = __importDefault(require("../../test/fixtures/access-service-mock"));
const reset_token_service_1 = __importDefault(require("./reset-token-service"));
const email_service_1 = require("./email-service");
const owasp_validation_error_1 = __importDefault(require("../error/owasp-validation-error"));
const test_config_1 = require("../../test/config/test-config");
const session_service_1 = __importDefault(require("./session-service"));
const fake_session_store_1 = __importDefault(require("../../test/fixtures/fake-session-store"));
const user_1 = __importDefault(require("../types/user"));
const fake_reset_token_store_1 = __importDefault(require("../../test/fixtures/fake-reset-token-store"));
const setting_service_1 = __importDefault(require("./setting-service"));
const fake_setting_store_1 = __importDefault(require("../../test/fixtures/fake-setting-store"));
const fake_event_store_2 = __importDefault(require("../../test/fixtures/fake-event-store"));
const config = (0, test_config_1.createTestConfig)();
const systemUser = new user_1.default({ id: -1, username: 'system' });
test('Should create new user', async () => {
    const userStore = new fake_user_store_1.default();
    const eventStore = new fake_event_store_1.default();
    const accessService = new access_service_mock_1.default();
    const resetTokenStore = new fake_reset_token_store_1.default();
    const resetTokenService = new reset_token_service_1.default({ resetTokenStore }, config);
    const sessionStore = new fake_session_store_1.default();
    const sessionService = new session_service_1.default({ sessionStore }, config);
    const emailService = new email_service_1.EmailService(config.email, config.getLogger);
    const settingService = new setting_service_1.default({
        settingStore: new fake_setting_store_1.default(),
        eventStore: new fake_event_store_2.default(),
    }, config);
    const service = new user_service_1.default({ userStore, eventStore }, config, {
        accessService,
        resetTokenService,
        emailService,
        sessionService,
        settingService,
    });
    const user = await service.createUser({
        username: 'test',
        rootRole: 1,
    }, systemUser);
    const storedUser = await userStore.get(user.id);
    const allUsers = await userStore.getAll();
    expect(user.id).toBeTruthy();
    expect(user.username).toBe('test');
    expect(allUsers.length).toBe(1);
    expect(storedUser.username).toBe('test');
});
test('Should create default user', async () => {
    const userStore = new fake_user_store_1.default();
    const eventStore = new fake_event_store_1.default();
    const accessService = new access_service_mock_1.default();
    const resetTokenStore = new fake_reset_token_store_1.default();
    const resetTokenService = new reset_token_service_1.default({ resetTokenStore }, config);
    const emailService = new email_service_1.EmailService(config.email, config.getLogger);
    const sessionStore = new fake_session_store_1.default();
    const sessionService = new session_service_1.default({ sessionStore }, config);
    const settingService = new setting_service_1.default({
        settingStore: new fake_setting_store_1.default(),
        eventStore: new fake_event_store_2.default(),
    }, config);
    const service = new user_service_1.default({ userStore, eventStore }, config, {
        accessService,
        resetTokenService,
        emailService,
        sessionService,
        settingService,
    });
    await service.initAdminUser();
    const user = await service.loginUser('admin', 'unleash4all');
    expect(user.username).toBe('admin');
});
test('Should be a valid password', async () => {
    const userStore = new fake_user_store_1.default();
    const eventStore = new fake_event_store_1.default();
    const accessService = new access_service_mock_1.default();
    const resetTokenStore = new fake_reset_token_store_1.default();
    const resetTokenService = new reset_token_service_1.default({ resetTokenStore }, config);
    const emailService = new email_service_1.EmailService(config.email, config.getLogger);
    const sessionStore = new fake_session_store_1.default();
    const sessionService = new session_service_1.default({ sessionStore }, config);
    const settingService = new setting_service_1.default({
        settingStore: new fake_setting_store_1.default(),
        eventStore: new fake_event_store_2.default(),
    }, config);
    const service = new user_service_1.default({ userStore, eventStore }, config, {
        accessService,
        resetTokenService,
        emailService,
        sessionService,
        settingService,
    });
    const valid = service.validatePassword('this is a strong password!');
    expect(valid).toBe(true);
});
test('Password must be at least 10 chars', async () => {
    const userStore = new fake_user_store_1.default();
    const eventStore = new fake_event_store_1.default();
    const accessService = new access_service_mock_1.default();
    const resetTokenStore = new fake_reset_token_store_1.default();
    const resetTokenService = new reset_token_service_1.default({ resetTokenStore }, config);
    const emailService = new email_service_1.EmailService(config.email, config.getLogger);
    const sessionStore = new fake_session_store_1.default();
    const sessionService = new session_service_1.default({ sessionStore }, config);
    const settingService = new setting_service_1.default({
        settingStore: new fake_setting_store_1.default(),
        eventStore: new fake_event_store_2.default(),
    }, config);
    const service = new user_service_1.default({ userStore, eventStore }, config, {
        accessService,
        resetTokenService,
        emailService,
        sessionService,
        settingService,
    });
    expect(() => service.validatePassword('admin')).toThrow('The password must be at least 10 characters long.');
    expect(() => service.validatePassword('qwertyabcde')).toThrowError(owasp_validation_error_1.default);
});
test('The password must contain at least one uppercase letter.', async () => {
    const userStore = new fake_user_store_1.default();
    const eventStore = new fake_event_store_1.default();
    const accessService = new access_service_mock_1.default();
    const resetTokenStore = new fake_reset_token_store_1.default();
    const resetTokenService = new reset_token_service_1.default({ resetTokenStore }, config);
    const emailService = new email_service_1.EmailService(config.email, config.getLogger);
    const sessionStore = new fake_session_store_1.default();
    const sessionService = new session_service_1.default({ sessionStore }, config);
    const settingService = new setting_service_1.default({
        settingStore: new fake_setting_store_1.default(),
        eventStore: new fake_event_store_2.default(),
    }, config);
    const service = new user_service_1.default({ userStore, eventStore }, config, {
        accessService,
        resetTokenService,
        emailService,
        sessionService,
        settingService,
    });
    expect(() => service.validatePassword('qwertyabcde')).toThrowError('The password must contain at least one uppercase letter.');
    expect(() => service.validatePassword('qwertyabcde')).toThrowError(owasp_validation_error_1.default);
});
test('The password must contain at least one number', async () => {
    const userStore = new fake_user_store_1.default();
    const eventStore = new fake_event_store_1.default();
    const accessService = new access_service_mock_1.default();
    const resetTokenStore = new fake_reset_token_store_1.default();
    const resetTokenService = new reset_token_service_1.default({ resetTokenStore }, config);
    const emailService = new email_service_1.EmailService(config.email, config.getLogger);
    const sessionStore = new fake_session_store_1.default();
    const sessionService = new session_service_1.default({ sessionStore }, config);
    const settingService = new setting_service_1.default({
        settingStore: new fake_setting_store_1.default(),
        eventStore: new fake_event_store_2.default(),
    }, config);
    const service = new user_service_1.default({ userStore, eventStore }, config, {
        accessService,
        resetTokenService,
        emailService,
        sessionService,
        settingService,
    });
    expect(() => service.validatePassword('qwertyabcdE')).toThrowError('The password must contain at least one number.');
    expect(() => service.validatePassword('qwertyabcdE')).toThrowError(owasp_validation_error_1.default);
});
test('The password must contain at least one special character', async () => {
    const userStore = new fake_user_store_1.default();
    const eventStore = new fake_event_store_1.default();
    const accessService = new access_service_mock_1.default();
    const resetTokenStore = new fake_reset_token_store_1.default();
    const resetTokenService = new reset_token_service_1.default({ resetTokenStore }, config);
    const emailService = new email_service_1.EmailService(config.email, config.getLogger);
    const sessionStore = new fake_session_store_1.default();
    const sessionService = new session_service_1.default({ sessionStore }, config);
    const settingService = new setting_service_1.default({
        settingStore: new fake_setting_store_1.default(),
        eventStore: new fake_event_store_2.default(),
    }, config);
    const service = new user_service_1.default({ userStore, eventStore }, config, {
        accessService,
        resetTokenService,
        emailService,
        sessionService,
        settingService,
    });
    expect(() => service.validatePassword('qwertyabcdE2')).toThrowError('The password must contain at least one special character.');
    expect(() => service.validatePassword('qwertyabcdE2')).toThrowError(owasp_validation_error_1.default);
});
test('Should be a valid password with special chars', async () => {
    const userStore = new fake_user_store_1.default();
    const eventStore = new fake_event_store_1.default();
    const accessService = new access_service_mock_1.default();
    const resetTokenStore = new fake_reset_token_store_1.default();
    const resetTokenService = new reset_token_service_1.default({ resetTokenStore }, config);
    const emailService = new email_service_1.EmailService(config.email, config.getLogger);
    const sessionStore = new fake_session_store_1.default();
    const sessionService = new session_service_1.default({ sessionStore }, config);
    const settingService = new setting_service_1.default({
        settingStore: new fake_setting_store_1.default(),
        eventStore: new fake_event_store_2.default(),
    }, config);
    const service = new user_service_1.default({ userStore, eventStore }, config, {
        accessService,
        resetTokenService,
        emailService,
        sessionService,
        settingService,
    });
    const valid = service.validatePassword('this is a strong password!');
    expect(valid).toBe(true);
});
test('Should send password reset email if user exists', async () => {
    const userStore = new fake_user_store_1.default();
    const eventStore = new fake_event_store_1.default();
    const accessService = new access_service_mock_1.default();
    const resetTokenStore = new fake_reset_token_store_1.default();
    const resetTokenService = new reset_token_service_1.default({ resetTokenStore }, config);
    const emailService = new email_service_1.EmailService(config.email, config.getLogger);
    const sessionStore = new fake_session_store_1.default();
    const sessionService = new session_service_1.default({ sessionStore }, config);
    const settingService = new setting_service_1.default({
        settingStore: new fake_setting_store_1.default(),
        eventStore: new fake_event_store_2.default(),
    }, config);
    const service = new user_service_1.default({ userStore, eventStore }, config, {
        accessService,
        resetTokenService,
        emailService,
        sessionService,
        settingService,
    });
    const unknownUser = service.createResetPasswordEmail('unknown@example.com');
    expect(unknownUser).rejects.toThrowError('Could not find user');
    await userStore.insert({
        id: 123,
        name: 'User',
        username: 'Username',
        email: 'known@example.com',
        permissions: [],
        imageUrl: '',
        seenAt: new Date(),
        loginAttempts: 0,
        createdAt: new Date(),
        isAPI: false,
        generateImageUrl: () => '',
    });
    const knownUser = service.createResetPasswordEmail('known@example.com');
    expect(knownUser).resolves.toBeInstanceOf(url_1.URL);
});
test('Should throttle password reset email', async () => {
    const userStore = new fake_user_store_1.default();
    const eventStore = new fake_event_store_1.default();
    const accessService = new access_service_mock_1.default();
    const resetTokenStore = new fake_reset_token_store_1.default();
    const resetTokenService = new reset_token_service_1.default({ resetTokenStore }, config);
    const emailService = new email_service_1.EmailService(config.email, config.getLogger);
    const sessionStore = new fake_session_store_1.default();
    const sessionService = new session_service_1.default({ sessionStore }, config);
    const settingService = new setting_service_1.default({
        settingStore: new fake_setting_store_1.default(),
        eventStore: new fake_event_store_2.default(),
    }, config);
    const service = new user_service_1.default({ userStore, eventStore }, config, {
        accessService,
        resetTokenService,
        emailService,
        sessionService,
        settingService,
    });
    await userStore.insert({
        id: 123,
        name: 'User',
        username: 'Username',
        email: 'known@example.com',
        permissions: [],
        imageUrl: '',
        seenAt: new Date(),
        loginAttempts: 0,
        createdAt: new Date(),
        isAPI: false,
        generateImageUrl: () => '',
    });
    jest.useFakeTimers();
    const attempt1 = service.createResetPasswordEmail('known@example.com');
    await expect(attempt1).resolves.toBeInstanceOf(url_1.URL);
    const attempt2 = service.createResetPasswordEmail('known@example.com');
    await expect(attempt2).resolves.toBe(undefined);
    jest.runAllTimers();
    const attempt3 = service.createResetPasswordEmail('known@example.com');
    await expect(attempt3).resolves.toBeInstanceOf(url_1.URL);
});
//# sourceMappingURL=user-service.test.js.map