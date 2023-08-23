"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../../helpers/test-helper");
const database_init_1 = __importDefault(require("../../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../../fixtures/no-logger"));
const api_token_1 = require("../../../../lib/types/models/api-token");
const constants_1 = require("../../../../lib/util/constants");
let app;
let db;
let apiTokenService;
const environment = 'testing';
const project = 'default';
const project2 = 'some';
const tokenName = 'test';
const feature1 = 'f1.token.access';
const feature2 = 'f2.token.access';
const feature3 = 'f3.p2.token.access';
beforeAll(async () => {
    db = await (0, database_init_1.default)('feature_api_api_access_client', no_logger_1.default);
    app = await (0, test_helper_1.setupAppWithAuth)(db.stores);
    apiTokenService = app.services.apiTokenService;
    const { featureToggleServiceV2, environmentService } = app.services;
    const { environmentStore, projectStore } = db.stores;
    await environmentStore.create({
        name: environment,
        type: 'test',
    });
    await projectStore.create({
        id: project2,
        name: 'Test Project 2',
        description: '',
        mode: 'open',
    });
    await environmentService.addEnvironmentToProject(environment, project);
    await environmentService.addEnvironmentToProject(environment, project2);
    await featureToggleServiceV2.createFeatureToggle(project, {
        name: feature1,
        description: 'the #1 feature',
    }, tokenName);
    await featureToggleServiceV2.createStrategy({
        name: 'default',
        constraints: [],
        parameters: {},
    }, { projectId: project, featureName: feature1, environment: constants_1.DEFAULT_ENV }, tokenName);
    await featureToggleServiceV2.createStrategy({
        name: 'custom-testing',
        constraints: [],
        parameters: {},
    }, { projectId: project, featureName: feature1, environment }, tokenName);
    // create feature 2
    await featureToggleServiceV2.createFeatureToggle(project, {
        name: feature2,
    }, tokenName);
    await featureToggleServiceV2.createStrategy({
        name: 'default',
        constraints: [],
        parameters: {},
    }, { projectId: project, featureName: feature2, environment }, tokenName);
    // create feature 3
    await featureToggleServiceV2.createFeatureToggle(project2, {
        name: feature3,
    }, tokenName);
    await featureToggleServiceV2.createStrategy({
        name: 'default',
        constraints: [],
        parameters: {},
    }, { projectId: project2, featureName: feature3, environment }, tokenName);
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
test('returns feature toggle with "default" config', async () => {
    const token = await apiTokenService.createApiToken({
        type: api_token_1.ApiTokenType.CLIENT,
        tokenName,
        environment: constants_1.DEFAULT_ENV,
        project,
    });
    await app.request
        .get('/api/client/features')
        .set('Authorization', token.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        const { features } = res.body;
        const f1 = features.find((f) => f.name === feature1);
        const f2 = features.find((f) => f.name === feature2);
        expect(features).toHaveLength(2);
        expect(f1.strategies).toHaveLength(1);
        expect(f2.strategies).toHaveLength(0);
    });
});
test('returns feature toggle with testing environment config', async () => {
    const token = await apiTokenService.createApiToken({
        type: api_token_1.ApiTokenType.CLIENT,
        tokenName: tokenName,
        environment,
        project,
    });
    await app.request
        .get('/api/client/features')
        .set('Authorization', token.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        const { features, query } = res.body;
        const f1 = features.find((f) => f.name === feature1);
        const f2 = features.find((f) => f.name === feature2);
        expect(features).toHaveLength(2);
        expect(f1.strategies).toHaveLength(1);
        expect(f1.strategies[0].name).toBe('custom-testing');
        expect(f2.strategies).toHaveLength(1);
        expect(query.project[0]).toBe(project);
        expect(query.environment).toBe(environment);
    });
});
test('returns feature toggle for project2', async () => {
    const token = await apiTokenService.createApiToken({
        type: api_token_1.ApiTokenType.CLIENT,
        tokenName: tokenName,
        environment,
        project: project2,
    });
    await app.request
        .get('/api/client/features')
        .set('Authorization', token.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        const { features } = res.body;
        const f3 = features.find((f) => f.name === feature3);
        expect(features).toHaveLength(1);
        expect(f3.strategies).toHaveLength(1);
    });
});
test('returns feature toggle for all projects', async () => {
    const token = await apiTokenService.createApiToken({
        type: api_token_1.ApiTokenType.CLIENT,
        tokenName: tokenName,
        environment,
        project: '*',
    });
    await app.request
        .get('/api/client/features')
        .set('Authorization', token.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        const { features } = res.body;
        expect(features).toHaveLength(3);
    });
});
//# sourceMappingURL=feature.token.access.e2e.test.js.map