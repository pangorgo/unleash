"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../fixtures/no-logger"));
const api_token_service_1 = require("../../../lib/services/api-token-service");
const test_config_1 = require("../../config/test-config");
const api_token_1 = require("../../../lib/types/models/api-token");
const constants_1 = require("../../../lib/util/constants");
const date_fns_1 = require("date-fns");
const project_service_1 = __importDefault(require("../../../lib/services/project-service"));
const feature_toggle_service_1 = __importDefault(require("../../../lib/services/feature-toggle-service"));
const access_service_1 = require("../../../lib/services/access-service");
const segment_service_1 = require("../../../lib/services/segment-service");
const group_service_1 = require("../../../lib/services/group-service");
const services_1 = require("../../../lib/services");
const sql_change_request_access_read_model_1 = require("../../../lib/features/change-request-access-service/sql-change-request-access-read-model");
let db;
let stores;
let apiTokenService;
let projectService;
let favoritesService;
beforeAll(async () => {
    const config = (0, test_config_1.createTestConfig)({
        server: { baseUriPath: '/test' },
    });
    db = await (0, database_init_1.default)('api_token_service_serial', no_logger_1.default);
    stores = db.stores;
    const groupService = new group_service_1.GroupService(stores, config);
    const accessService = new access_service_1.AccessService(stores, config, groupService);
    const changeRequestAccessReadModel = new sql_change_request_access_read_model_1.ChangeRequestAccessReadModel(db.rawDatabase, accessService);
    const featureToggleService = new feature_toggle_service_1.default(stores, config, new segment_service_1.SegmentService(stores, changeRequestAccessReadModel, config), accessService, changeRequestAccessReadModel);
    const project = {
        id: 'test-project',
        name: 'Test Project',
        description: 'Fancy',
        mode: 'open',
        defaultStickiness: 'clientId',
    };
    const user = await stores.userStore.insert({
        name: 'Some Name',
        email: 'test@getunleash.io',
    });
    favoritesService = new services_1.FavoritesService(stores, config);
    projectService = new project_service_1.default(stores, config, accessService, featureToggleService, groupService, favoritesService);
    await projectService.createProject(project, user);
    apiTokenService = new api_token_service_1.ApiTokenService(stores, config);
});
afterAll(async () => {
    if (db) {
        await db.destroy();
    }
});
afterEach(async () => {
    const tokens = await stores.apiTokenStore.getAll();
    const deleteAll = tokens.map((t) => stores.apiTokenStore.delete(t.secret));
    await Promise.all(deleteAll);
});
test('should have empty list of tokens', async () => {
    const allTokens = await apiTokenService.getAllTokens();
    const activeTokens = await apiTokenService.getAllTokens();
    expect(allTokens.length).toBe(0);
    expect(activeTokens.length).toBe(0);
});
test('should create client token', async () => {
    const token = await apiTokenService.createApiToken({
        tokenName: 'default-client',
        type: api_token_1.ApiTokenType.CLIENT,
        project: '*',
        environment: constants_1.DEFAULT_ENV,
    });
    const allTokens = await apiTokenService.getAllTokens();
    expect(allTokens.length).toBe(1);
    expect(token.secret.length > 32).toBe(true);
    expect(token.type).toBe(api_token_1.ApiTokenType.CLIENT);
    expect(token.username).toBe('default-client');
    expect(allTokens[0].secret).toBe(token.secret);
});
test('should create admin token', async () => {
    const token = await apiTokenService.createApiToken({
        tokenName: 'admin',
        type: api_token_1.ApiTokenType.ADMIN,
        project: '*',
        environment: '*',
    });
    expect(token.secret.length > 32).toBe(true);
    expect(token.type).toBe(api_token_1.ApiTokenType.ADMIN);
});
test('should set expiry of token', async () => {
    const time = new Date('2022-01-01');
    await apiTokenService.createApiToken({
        tokenName: 'default-client',
        type: api_token_1.ApiTokenType.CLIENT,
        expiresAt: time,
        project: '*',
        environment: constants_1.DEFAULT_ENV,
    });
    const [token] = await apiTokenService.getAllTokens();
    expect(token.expiresAt).toEqual(time);
});
test('should update expiry of token', async () => {
    const time = new Date('2022-01-01');
    const newTime = new Date('2023-01-01');
    const token = await apiTokenService.createApiToken({
        tokenName: 'default-client',
        type: api_token_1.ApiTokenType.CLIENT,
        expiresAt: time,
        project: '*',
        environment: constants_1.DEFAULT_ENV,
    }, 'tester');
    await apiTokenService.updateExpiry(token.secret, newTime, 'tester');
    const [updatedToken] = await apiTokenService.getAllTokens();
    expect(updatedToken.expiresAt).toEqual(newTime);
});
test('should only return valid tokens', async () => {
    const now = Date.now();
    const yesterday = (0, date_fns_1.subDays)(now, 1);
    const tomorrow = (0, date_fns_1.addDays)(now, 1);
    await apiTokenService.createApiToken({
        tokenName: 'default-expired',
        type: api_token_1.ApiTokenType.CLIENT,
        expiresAt: yesterday,
        project: '*',
        environment: constants_1.DEFAULT_ENV,
    });
    const activeToken = await apiTokenService.createApiToken({
        tokenName: 'default-valid',
        type: api_token_1.ApiTokenType.CLIENT,
        expiresAt: tomorrow,
        project: '*',
        environment: constants_1.DEFAULT_ENV,
    });
    const tokens = await apiTokenService.getAllActiveTokens();
    expect(tokens.length).toBe(1);
    expect(activeToken.secret).toBe(tokens[0].secret);
});
test('should create client token with project list', async () => {
    const token = await apiTokenService.createApiToken({
        tokenName: 'default-client',
        type: api_token_1.ApiTokenType.CLIENT,
        projects: ['default', 'test-project'],
        environment: constants_1.DEFAULT_ENV,
    });
    expect(token.secret.slice(0, 2)).toEqual('[]');
    expect(token.projects).toStrictEqual(['default', 'test-project']);
});
test('should strip all other projects if ALL_PROJECTS is present', async () => {
    const token = await apiTokenService.createApiToken({
        tokenName: 'default-client',
        type: api_token_1.ApiTokenType.CLIENT,
        projects: ['*', 'default'],
        environment: constants_1.DEFAULT_ENV,
    });
    expect(token.projects).toStrictEqual(['*']);
});
test('should return user with multiple projects', async () => {
    const now = Date.now();
    const tomorrow = (0, date_fns_1.addDays)(now, 1);
    await apiTokenService.createApiToken({
        tokenName: 'default-valid',
        type: api_token_1.ApiTokenType.CLIENT,
        expiresAt: tomorrow,
        projects: ['test-project', 'default'],
        environment: constants_1.DEFAULT_ENV,
    });
    await apiTokenService.createApiToken({
        tokenName: 'default-also-valid',
        type: api_token_1.ApiTokenType.CLIENT,
        expiresAt: tomorrow,
        projects: ['test-project'],
        environment: constants_1.DEFAULT_ENV,
    });
    const tokens = await apiTokenService.getAllActiveTokens();
    const multiProjectUser = await apiTokenService.getUserForToken(tokens[0].secret);
    const singleProjectUser = await apiTokenService.getUserForToken(tokens[1].secret);
    expect(multiProjectUser.projects).toStrictEqual([
        'test-project',
        'default',
    ]);
    expect(singleProjectUser.projects).toStrictEqual(['test-project']);
});
test('should not partially create token if projects are invalid', async () => {
    try {
        await apiTokenService.createApiTokenWithProjects({
            tokenName: 'default-client',
            type: api_token_1.ApiTokenType.CLIENT,
            projects: ['non-existent-project'],
            environment: constants_1.DEFAULT_ENV,
        });
    }
    catch (e) { }
    const allTokens = await apiTokenService.getAllTokens();
    expect(allTokens.length).toBe(0);
});
//# sourceMappingURL=api-token-service.e2e.test.js.map