"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_token_service_1 = require("./api-token-service");
const test_config_1 = require("../../test/config/test-config");
const api_token_1 = require("../types/models/api-token");
const fake_api_token_store_1 = __importDefault(require("../../test/fixtures/fake-api-token-store"));
const fake_environment_store_1 = __importDefault(require("../../test/fixtures/fake-environment-store"));
const fake_event_store_1 = __importDefault(require("../../test/fixtures/fake-event-store"));
const types_1 = require("../types");
const date_fns_1 = require("date-fns");
test('Should init api token', async () => {
    const token = {
        environment: '*',
        project: '*',
        secret: '*:*:some-random-string',
        type: api_token_1.ApiTokenType.ADMIN,
        tokenName: 'admin',
    };
    const config = (0, test_config_1.createTestConfig)({
        authentication: {
            initApiTokens: [token],
        },
    });
    const apiTokenStore = new fake_api_token_store_1.default();
    const environmentStore = new fake_environment_store_1.default();
    const eventStore = new fake_event_store_1.default();
    const insertCalled = new Promise((resolve) => {
        apiTokenStore.on('insert', resolve);
    });
    new api_token_service_1.ApiTokenService({ apiTokenStore, environmentStore, eventStore }, config);
    await insertCalled;
    const tokens = await apiTokenStore.getAll();
    expect(tokens).toHaveLength(1);
});
test("Shouldn't return frontend token when secret is undefined", async () => {
    const token = {
        environment: 'default',
        projects: ['*'],
        secret: '*:*:some-random-string',
        type: api_token_1.ApiTokenType.FRONTEND,
        tokenName: 'front',
        expiresAt: null,
    };
    const config = (0, test_config_1.createTestConfig)({});
    const apiTokenStore = new fake_api_token_store_1.default();
    const environmentStore = new fake_environment_store_1.default();
    const eventStore = new fake_event_store_1.default();
    await environmentStore.create({
        name: 'default',
        enabled: true,
        protected: true,
        type: 'test',
        sortOrder: 1,
    });
    const apiTokenService = new api_token_service_1.ApiTokenService({ apiTokenStore, environmentStore, eventStore }, config);
    await apiTokenService.createApiTokenWithProjects(token);
    await apiTokenService.fetchActiveTokens();
    expect(apiTokenService.getUserForToken(undefined)).toEqual(undefined);
    expect(apiTokenService.getUserForToken('')).toEqual(undefined);
});
test('Api token operations should all have events attached', async () => {
    const token = {
        environment: 'default',
        projects: ['*'],
        secret: '*:*:some-random-string',
        type: api_token_1.ApiTokenType.FRONTEND,
        tokenName: 'front',
        expiresAt: null,
    };
    const config = (0, test_config_1.createTestConfig)({});
    const apiTokenStore = new fake_api_token_store_1.default();
    const environmentStore = new fake_environment_store_1.default();
    const eventStore = new fake_event_store_1.default();
    await environmentStore.create({
        name: 'default',
        enabled: true,
        protected: true,
        type: 'test',
        sortOrder: 1,
    });
    const apiTokenService = new api_token_service_1.ApiTokenService({ apiTokenStore, environmentStore, eventStore }, config);
    let saved = await apiTokenService.createApiTokenWithProjects(token);
    let newExpiry = (0, date_fns_1.addDays)(new Date(), 30);
    await apiTokenService.updateExpiry(saved.secret, newExpiry, 'test');
    await apiTokenService.delete(saved.secret, 'test');
    const events = await eventStore.getEvents();
    const createdApiTokenEvents = events.filter((e) => e.type === types_1.API_TOKEN_CREATED);
    expect(createdApiTokenEvents).toHaveLength(1);
    expect(createdApiTokenEvents[0].preData).toBeUndefined();
    expect(createdApiTokenEvents[0].data.secret).toBeUndefined();
    const updatedApiTokenEvents = events.filter((e) => e.type === types_1.API_TOKEN_UPDATED);
    expect(updatedApiTokenEvents).toHaveLength(1);
    expect(updatedApiTokenEvents[0].preData.expiresAt).toBeDefined();
    expect(updatedApiTokenEvents[0].preData.secret).toBeUndefined();
    expect(updatedApiTokenEvents[0].data.secret).toBeUndefined();
    expect(updatedApiTokenEvents[0].data.expiresAt).toBe(newExpiry);
    const deletedApiTokenEvents = events.filter((e) => e.type === types_1.API_TOKEN_DELETED);
    expect(deletedApiTokenEvents).toHaveLength(1);
    expect(deletedApiTokenEvents[0].data).toBeUndefined();
    expect(deletedApiTokenEvents[0].preData).toBeDefined();
    expect(deletedApiTokenEvents[0].preData.secret).toBeUndefined();
});
//# sourceMappingURL=api-token-service.test.js.map