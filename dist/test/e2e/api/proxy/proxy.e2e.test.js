"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApiToken = void 0;
const test_helper_1 = require("../../helpers/test-helper");
const database_init_1 = __importDefault(require("../../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../../fixtures/no-logger"));
const util_1 = require("../../../../lib/util");
const api_token_1 = require("../../../../lib/types/models/api-token");
const date_fns_1 = require("date-fns");
const types_1 = require("../../../../lib/types");
const proxy_1 = require("../../../../lib/proxy");
let app;
let db;
beforeAll(async () => {
    db = await (0, database_init_1.default)('proxy', no_logger_1.default);
    app = await (0, test_helper_1.setupAppWithAuth)(db.stores, {
        frontendApiOrigins: ['https://example.com'],
    });
});
afterEach(() => {
    app.services.proxyService.stopAll();
    jest.clearAllMocks();
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
beforeEach(async () => {
    await db.stores.segmentStore.deleteAll();
    await db.stores.featureToggleStore.deleteAll();
    await db.stores.clientMetricsStoreV2.deleteAll();
    await db.stores.apiTokenStore.deleteAll();
});
const createApiToken = (type, overrides = {}) => {
    return app.services.apiTokenService.createApiTokenWithProjects({
        type,
        projects: ['*'],
        environment: 'default',
        tokenName: `${type}-token-${(0, util_1.randomId)()}`,
        ...overrides,
    });
};
exports.createApiToken = createApiToken;
const createFeatureToggle = async ({ name, project = 'default', environment = 'default', strategies, enabled, }) => {
    const createdFeature = await app.services.featureToggleService.createFeatureToggle(project, { name }, 'userName', true);
    const createdStrategies = await Promise.all((strategies ?? []).map(async (s) => app.services.featureToggleService.createStrategy(s, { projectId: project, featureName: name, environment }, 'userName')));
    await app.services.featureToggleService.updateEnabled(project, name, environment, enabled, 'userName');
    return [createdFeature, createdStrategies];
};
const createProject = async (id, name) => {
    const user = await db.stores.userStore.insert({
        name: (0, util_1.randomId)(),
        email: `${(0, util_1.randomId)()}@example.com`,
    });
    await app.services.projectService.createProject({ id, name, mode: 'open', defaultStickiness: 'default' }, user);
};
test('should require a frontend token or an admin token', async () => {
    await app.request
        .get('/api/frontend')
        .expect('Content-Type', /json/)
        .expect(401);
});
test('should not allow requests with a client token', async () => {
    const clientToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.CLIENT);
    await app.request
        .get('/api/frontend')
        .set('Authorization', clientToken.secret)
        .expect('Content-Type', /json/)
        .expect(403);
});
test('should allow requests with a token secret alias', async () => {
    const featureA = (0, util_1.randomId)();
    const featureB = (0, util_1.randomId)();
    const envA = (0, util_1.randomId)();
    const envB = (0, util_1.randomId)();
    await db.stores.environmentStore.create({ name: envA, type: 'test' });
    await db.stores.environmentStore.create({ name: envB, type: 'test' });
    await db.stores.projectStore.addEnvironmentToProject('default', envA);
    await db.stores.projectStore.addEnvironmentToProject('default', envB);
    await createFeatureToggle({
        name: featureA,
        enabled: true,
        environment: envA,
        strategies: [{ name: 'default', constraints: [], parameters: {} }],
    });
    await createFeatureToggle({
        name: featureB,
        enabled: true,
        environment: envB,
        strategies: [{ name: 'default', constraints: [], parameters: {} }],
    });
    const tokenA = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND, {
        alias: (0, util_1.randomId)(),
        environment: envA,
    });
    const tokenB = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND, {
        alias: (0, util_1.randomId)(),
        environment: envB,
    });
    await app.request
        .get('/api/frontend')
        .expect('Content-Type', /json/)
        .expect(401);
    await app.request
        .get('/api/frontend')
        .set('Authorization', '')
        .expect('Content-Type', /json/)
        .expect(401);
    await app.request
        .get('/api/frontend')
        .set('Authorization', 'null')
        .expect('Content-Type', /json/)
        .expect(401);
    await app.request
        .get('/api/frontend')
        .set('Authorization', (0, util_1.randomId)())
        .expect('Content-Type', /json/)
        .expect(401);
    await app.request
        .get('/api/frontend')
        .set('Authorization', tokenA.secret.slice(0, -1))
        .expect('Content-Type', /json/)
        .expect(401);
    await app.request
        .get('/api/frontend')
        .set('Authorization', tokenA.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.toggles).toHaveLength(1))
        .expect((res) => expect(res.body.toggles[0].name).toEqual(featureA));
    await app.request
        .get('/api/frontend')
        .set('Authorization', tokenB.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.toggles).toHaveLength(1))
        .expect((res) => expect(res.body.toggles[0].name).toEqual(featureB));
    await app.request
        .get('/api/frontend')
        .set('Authorization', tokenA.alias)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.toggles).toHaveLength(1))
        .expect((res) => expect(res.body.toggles[0].name).toEqual(featureA));
    await app.request
        .get('/api/frontend')
        .set('Authorization', tokenB.alias)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.toggles).toHaveLength(1))
        .expect((res) => expect(res.body.toggles[0].name).toEqual(featureB));
});
test('should allow requests with an admin token', async () => {
    const featureA = (0, util_1.randomId)();
    await createFeatureToggle({
        name: featureA,
        enabled: true,
        strategies: [{ name: 'default', constraints: [], parameters: {} }],
    });
    const adminToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.ADMIN, {
        projects: ['*'],
        environment: '*',
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', adminToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.toggles).toHaveLength(1))
        .expect((res) => expect(res.body.toggles[0].name).toEqual(featureA));
});
test('should not allow admin requests with a frontend token', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await app.request
        .get('/api/admin/features')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(403);
});
test('should not allow client requests with a frontend token', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await app.request
        .get('/api/client/features')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(403);
});
test('should not allow requests with an invalid frontend token', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendToken.secret.slice(0, -1))
        .expect('Content-Type', /json/)
        .expect(401);
});
test('should allow requests with a frontend token', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body).toEqual({ toggles: [] }));
});
test('should return 405 from unimplemented endpoints', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await app.request
        .post('/api/frontend')
        .send({})
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(405);
    await app.request
        .get('/api/frontend/client/features')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(405);
    await app.request
        .get('/api/frontend/health')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(405);
    await app.request
        .get('/api/frontend/internal-backstage/prometheus')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(405);
});
test('should enforce frontend API CORS config', async () => {
    const allowedOrigin = 'https://example.com';
    const unknownOrigin = 'https://example.org';
    const origin = 'access-control-allow-origin';
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await app.request
        .options('/api/frontend')
        .set('Origin', unknownOrigin)
        .set('Authorization', frontendToken.secret)
        .expect((res) => expect(res.headers[origin]).toBeUndefined());
    await app.request
        .options('/api/frontend')
        .set('Origin', allowedOrigin)
        .set('Authorization', frontendToken.secret)
        .expect((res) => expect(res.headers[origin]).toEqual(allowedOrigin));
    await app.request
        .get('/api/frontend')
        .set('Origin', unknownOrigin)
        .set('Authorization', frontendToken.secret)
        .expect((res) => expect(res.headers[origin]).toBeUndefined());
    await app.request
        .get('/api/frontend')
        .set('Origin', allowedOrigin)
        .set('Authorization', frontendToken.secret)
        .expect((res) => expect(res.headers[origin]).toEqual(allowedOrigin));
});
test('should accept client registration requests', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await app.request
        .post('/api/frontend/client/register')
        .set('Authorization', frontendToken.secret)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);
    await app.request
        .post('/api/frontend/client/register')
        .set('Authorization', frontendToken.secret)
        .send({
        appName: (0, util_1.randomId)(),
        instanceId: (0, util_1.randomId)(),
        sdkVersion: (0, util_1.randomId)(),
        environment: 'default',
        interval: 10000,
        started: new Date(),
        strategies: ['default'],
    })
        .expect(200)
        .expect((res) => expect(res.text).toEqual('OK'));
});
test('should store proxy client metrics', async () => {
    const now = new Date();
    const appName = (0, util_1.randomId)();
    const instanceId = (0, util_1.randomId)();
    const featureName = (0, util_1.randomId)();
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    const adminToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.ADMIN, {
        projects: ['*'],
        environment: '*',
    });
    await app.request
        .get(`/api/admin/client-metrics/features/${featureName}`)
        .set('Authorization', adminToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
        expect(res.body).toEqual({
            featureName,
            lastHourUsage: [],
            maturity: 'stable',
            seenApplications: [],
            version: 1,
        });
    });
    await app.request
        .post('/api/frontend/client/metrics')
        .set('Authorization', frontendToken.secret)
        .send({
        appName,
        instanceId,
        bucket: {
            start: now,
            stop: now,
            toggles: { [featureName]: { yes: 1, no: 10 } },
        },
    })
        .expect(200)
        .expect((res) => expect(res.text).toEqual('OK'));
    await app.request
        .post('/api/frontend/client/metrics')
        .set('Authorization', frontendToken.secret)
        .send({
        appName,
        instanceId,
        bucket: {
            start: now,
            stop: now,
            toggles: { [featureName]: { yes: 2, no: 20 } },
        },
    })
        .expect(200)
        .expect((res) => expect(res.text).toEqual('OK'));
    await app.services.clientMetricsServiceV2.bulkAdd();
    await app.request
        .get(`/api/admin/client-metrics/features/${featureName}`)
        .set('Authorization', adminToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
        expect(res.body).toEqual({
            featureName,
            lastHourUsage: [
                {
                    environment: 'default',
                    timestamp: (0, date_fns_1.startOfHour)(now).toISOString(),
                    yes: 3,
                    no: 30,
                },
            ],
            maturity: 'stable',
            seenApplications: [appName],
            version: 1,
        });
    });
});
test('should filter features by enabled/disabled', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await createFeatureToggle({
        name: 'enabledFeature1',
        enabled: true,
        strategies: [{ name: 'default', constraints: [], parameters: {} }],
    });
    await createFeatureToggle({
        name: 'enabledFeature2',
        enabled: true,
        strategies: [{ name: 'default', constraints: [], parameters: {} }],
    });
    await createFeatureToggle({
        name: 'disabledFeature',
        enabled: false,
        strategies: [{ name: 'default', constraints: [], parameters: {} }],
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body).toEqual({
            toggles: [
                {
                    name: 'enabledFeature1',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
                {
                    name: 'enabledFeature2',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
            ],
        });
    });
});
test('should filter features by strategies', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await createFeatureToggle({
        name: 'featureWithoutStrategies',
        enabled: false,
        strategies: [],
    });
    await createFeatureToggle({
        name: 'featureWithUnknownStrategy',
        enabled: true,
        strategies: [{ name: 'unknown', constraints: [], parameters: {} }],
    });
    await createFeatureToggle({
        name: 'featureWithMultipleStrategies',
        enabled: true,
        strategies: [
            { name: 'default', constraints: [], parameters: {} },
            { name: 'unknown', constraints: [], parameters: {} },
        ],
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body).toEqual({
            toggles: [
                {
                    name: 'featureWithMultipleStrategies',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
            ],
        });
    });
});
test('should filter features by constraints', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await createFeatureToggle({
        name: 'featureWithAppNameA',
        enabled: true,
        strategies: [
            {
                name: 'default',
                constraints: [
                    { contextName: 'appName', operator: 'IN', values: ['a'] },
                ],
                parameters: {},
            },
        ],
    });
    await createFeatureToggle({
        name: 'featureWithAppNameAorB',
        enabled: true,
        strategies: [
            {
                name: 'default',
                constraints: [
                    {
                        contextName: 'appName',
                        operator: 'IN',
                        values: ['a', 'b'],
                    },
                ],
                parameters: {},
            },
        ],
    });
    await app.request
        .get('/api/frontend?appName=a')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.toggles).toHaveLength(2));
    await app.request
        .get('/api/frontend?appName=b')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.toggles).toHaveLength(1));
    await app.request
        .get('/api/frontend?appName=c')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.toggles).toHaveLength(0));
});
test('should be able to set environment as a context variable', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    const featureName = 'featureWithEnvironmentConstraint';
    await createFeatureToggle({
        name: featureName,
        enabled: true,
        strategies: [
            {
                name: 'default',
                constraints: [
                    {
                        contextName: 'environment',
                        operator: 'IN',
                        values: ['staging'],
                    },
                ],
                parameters: {},
            },
        ],
    });
    await app.request
        .get('/api/frontend?environment=staging')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.toggles).toHaveLength(1);
        expect(res.body.toggles[0].name).toBe(featureName);
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.toggles).toHaveLength(0);
    });
});
test('should filter features by project', async () => {
    const projectA = 'projectA';
    const projectB = 'projectB';
    await createProject(projectA, (0, util_1.randomId)());
    await createProject(projectB, (0, util_1.randomId)());
    const frontendTokenDefault = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND, {
        projects: ['default'],
    });
    const frontendTokenProjectA = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND, {
        projects: [projectA],
    });
    const frontendTokenProjectAB = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND, {
        projects: [projectA, projectB],
    });
    await createFeatureToggle({
        name: 'featureInProjectDefault',
        enabled: true,
        strategies: [{ name: 'default', parameters: {} }],
    });
    await createFeatureToggle({
        name: 'featureInProjectA',
        project: projectA,
        enabled: true,
        strategies: [{ name: 'default', parameters: {} }],
    });
    await createFeatureToggle({
        name: 'featureInProjectB',
        project: projectB,
        enabled: true,
        strategies: [{ name: 'default', parameters: {} }],
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendTokenDefault.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body).toEqual({
            toggles: [
                {
                    name: 'featureInProjectDefault',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
            ],
        });
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendTokenProjectA.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body).toEqual({
            toggles: [
                {
                    name: 'featureInProjectA',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
            ],
        });
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendTokenProjectAB.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body).toEqual({
            toggles: [
                {
                    name: 'featureInProjectA',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
                {
                    name: 'featureInProjectB',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
            ],
        });
    });
});
test('should filter features by environment', async () => {
    const environmentA = 'environmentA';
    const environmentB = 'environmentB';
    await db.stores.environmentStore.create({
        name: environmentA,
        type: 'production',
    });
    await db.stores.environmentStore.create({
        name: environmentB,
        type: 'production',
    });
    await app.services.environmentService.addEnvironmentToProject(environmentA, 'default');
    await app.services.environmentService.addEnvironmentToProject(environmentB, 'default');
    const frontendTokenEnvironmentDefault = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    const frontendTokenEnvironmentA = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND, {
        environment: environmentA,
    });
    const frontendTokenEnvironmentB = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND, {
        environment: environmentB,
    });
    await createFeatureToggle({
        name: 'featureInEnvironmentDefault',
        enabled: true,
        strategies: [{ name: 'default', parameters: {} }],
    });
    await createFeatureToggle({
        name: 'featureInEnvironmentA',
        environment: environmentA,
        enabled: true,
        strategies: [{ name: 'default', parameters: {} }],
    });
    await createFeatureToggle({
        name: 'featureInEnvironmentB',
        environment: environmentB,
        enabled: true,
        strategies: [{ name: 'default', parameters: {} }],
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendTokenEnvironmentDefault.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body).toEqual({
            toggles: [
                {
                    name: 'featureInEnvironmentDefault',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
            ],
        });
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendTokenEnvironmentA.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body).toEqual({
            toggles: [
                {
                    name: 'featureInEnvironmentA',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
            ],
        });
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendTokenEnvironmentB.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body).toEqual({
            toggles: [
                {
                    name: 'featureInEnvironmentB',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
            ],
        });
    });
});
test('should filter features by segment', async () => {
    const [featureA, [strategyA]] = await createFeatureToggle({
        name: (0, util_1.randomId)(),
        enabled: true,
        strategies: [{ name: 'default', parameters: {} }],
    });
    const [featureB, [strategyB]] = await createFeatureToggle({
        name: (0, util_1.randomId)(),
        enabled: true,
        strategies: [{ name: 'default', parameters: {} }],
    });
    const constraintA = {
        operator: 'IN',
        contextName: 'appName',
        values: ['a'],
    };
    const constraintB = {
        operator: 'IN',
        contextName: 'appName',
        values: ['b'],
    };
    const segmentA = await app.services.segmentService.create({ name: (0, util_1.randomId)(), constraints: [constraintA] }, { email: 'test@example.com' });
    const segmentB = await app.services.segmentService.create({ name: (0, util_1.randomId)(), constraints: [constraintB] }, { email: 'test@example.com' });
    await app.services.segmentService.addToStrategy(segmentA.id, strategyA.id);
    await app.services.segmentService.addToStrategy(segmentB.id, strategyB.id);
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body).toEqual({ toggles: [] }));
    await app.request
        .get('/api/frontend?appName=a')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.toggles).toHaveLength(1))
        .expect((res) => expect(res.body.toggles[0].name).toEqual(featureA.name));
    await app.request
        .get('/api/frontend?appName=b')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body.toggles).toHaveLength(1))
        .expect((res) => expect(res.body.toggles[0].name).toEqual(featureB.name));
    await app.request
        .get('/api/frontend?appName=c')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => expect(res.body).toEqual({ toggles: [] }));
});
test('Should sync proxy for keys on an interval', async () => {
    jest.useFakeTimers();
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    const user = await app.services.apiTokenService.getUserForToken(frontendToken.secret);
    const spy = jest.spyOn(proxy_1.ProxyRepository.prototype, 'featuresForToken');
    expect(user).not.toBeNull();
    const proxyRepository = new proxy_1.ProxyRepository({
        getLogger: no_logger_1.default,
        frontendApi: { refreshIntervalInMs: 5000 },
    }, db.stores, app.services, user);
    await proxyRepository.start();
    jest.advanceTimersByTime(60000);
    proxyRepository.stop();
    expect(spy.mock.calls.length > 6).toBe(true);
    jest.useRealTimers();
});
test('Should change fetch interval', async () => {
    jest.useFakeTimers();
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    const user = await app.services.apiTokenService.getUserForToken(frontendToken.secret);
    const spy = jest.spyOn(proxy_1.ProxyRepository.prototype, 'featuresForToken');
    const proxyRepository = new proxy_1.ProxyRepository({
        getLogger: no_logger_1.default,
        frontendApi: { refreshIntervalInMs: 1000 },
    }, db.stores, app.services, user);
    await proxyRepository.start();
    jest.advanceTimersByTime(60000);
    proxyRepository.stop();
    expect(spy.mock.calls.length > 30).toBe(true);
    jest.useRealTimers();
});
test('Should not recursively set off timers on events', async () => {
    jest.useFakeTimers();
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    const user = await app.services.apiTokenService.getUserForToken(frontendToken.secret);
    const spy = jest.spyOn(proxy_1.ProxyRepository.prototype, 'dataPolling');
    const proxyRepository = new proxy_1.ProxyRepository({
        getLogger: no_logger_1.default,
        frontendApi: { refreshIntervalInMs: 5000 },
    }, db.stores, app.services, user);
    await proxyRepository.start();
    db.stores.eventStore.emit(types_1.FEATURE_UPDATED);
    jest.advanceTimersByTime(10000);
    proxyRepository.stop();
    expect(spy.mock.calls.length < 3).toBe(true);
    jest.useRealTimers();
});
test('should return maxAge header on options call', async () => {
    await app.request
        .options('/api/frontend')
        .set('Origin', 'https://example.com')
        .expect(204)
        .expect((res) => {
        expect(res.headers['access-control-max-age']).toBe('86400');
    });
});
test('should terminate data polling when stop is called', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    const user = await app.services.apiTokenService.getUserForToken(frontendToken.secret);
    const logTrap = [];
    const getDebugLogger = () => {
        return {
            /* eslint-disable-next-line */
            debug: (message, ...args) => {
                logTrap.push(message);
            },
            /* eslint-disable-next-line */
            info: (...args) => { },
            /* eslint-disable-next-line */
            warn: (...args) => { },
            /* eslint-disable-next-line */
            error: (...args) => { },
            /* eslint-disable-next-line */
            fatal: (...args) => { },
        };
    };
    /* eslint-disable-next-line */
    const proxyRepository = new proxy_1.ProxyRepository({
        getLogger: getDebugLogger,
        frontendApi: { refreshIntervalInMs: 1 },
    }, db.stores, app.services, user);
    await proxyRepository.start();
    proxyRepository.stop();
    // Polling here is an async recursive call, so we gotta give it a bit of time
    await new Promise((r) => setTimeout(r, 10));
    expect(logTrap).toContain('Shutting down data polling for proxy repository');
});
test('should evaluate strategies when returning toggles', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await createFeatureToggle({
        name: 'enabledFeature',
        enabled: true,
        strategies: [
            {
                name: 'flexibleRollout',
                constraints: [],
                parameters: {
                    rollout: '100',
                    stickiness: 'default',
                    groupId: 'some-new',
                },
            },
        ],
    });
    await createFeatureToggle({
        name: 'disabledFeature',
        enabled: true,
        strategies: [
            {
                name: 'flexibleRollout',
                constraints: [],
                parameters: {
                    rollout: '0',
                    stickiness: 'default',
                    groupId: 'some-new',
                },
            },
        ],
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body).toEqual({
            toggles: [
                {
                    name: 'enabledFeature',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
            ],
        });
    });
});
test('should not return all features', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await createFeatureToggle({
        name: 'enabledFeature1',
        enabled: true,
        strategies: [{ name: 'default', constraints: [], parameters: {} }],
    });
    await createFeatureToggle({
        name: 'enabledFeature2',
        enabled: true,
        strategies: [
            {
                name: 'flexibleRollout',
                constraints: [],
                parameters: {
                    rollout: '100',
                    stickiness: 'default',
                    groupId: 'some-new',
                },
            },
        ],
    });
    await createFeatureToggle({
        name: 'disabledFeature',
        enabled: true,
        strategies: [
            {
                name: 'flexibleRollout',
                constraints: [],
                parameters: {
                    rollout: '0',
                    stickiness: 'default',
                    groupId: 'some-new',
                },
            },
        ],
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body).toEqual({
            toggles: [
                {
                    name: 'enabledFeature1',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
                {
                    name: 'enabledFeature2',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
            ],
        });
    });
});
test('should NOT evaluate disabled strategies when returning toggles', async () => {
    const frontendToken = await (0, exports.createApiToken)(api_token_1.ApiTokenType.FRONTEND);
    await createFeatureToggle({
        name: 'enabledFeature',
        enabled: true,
        strategies: [
            {
                name: 'flexibleRollout',
                constraints: [],
                parameters: {
                    rollout: '100',
                    stickiness: 'default',
                    groupId: 'some-new',
                },
            },
        ],
    });
    await createFeatureToggle({
        name: 'disabledFeature',
        enabled: false,
        strategies: [
            {
                name: 'flexibleRollout',
                constraints: [],
                disabled: true,
                parameters: {
                    rollout: '100',
                    stickiness: 'default',
                    groupId: 'some-new',
                },
            },
        ],
    });
    await createFeatureToggle({
        name: 'disabledFeature2',
        enabled: true,
        strategies: [
            {
                name: 'flexibleRollout',
                constraints: [],
                disabled: true,
                parameters: {
                    rollout: '100',
                    stickiness: 'default',
                    groupId: 'some-new',
                },
            },
            {
                name: 'flexibleRollout',
                constraints: [],
                disabled: false,
                parameters: {
                    rollout: '0',
                    stickiness: 'default',
                    groupId: 'some-new',
                },
            },
        ],
    });
    await createFeatureToggle({
        name: 'disabledFeature3',
        enabled: false,
        strategies: [
            {
                name: 'flexibleRollout',
                constraints: [],
                disabled: true,
                parameters: {
                    rollout: '100',
                    stickiness: 'default',
                    groupId: 'some-new',
                },
            },
        ],
    });
    await app.request
        .get('/api/frontend')
        .set('Authorization', frontendToken.secret)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body).toEqual({
            toggles: [
                {
                    name: 'enabledFeature',
                    enabled: true,
                    impressionData: false,
                    variant: { enabled: false, name: 'disabled' },
                },
            ],
        });
    });
});
//# sourceMappingURL=proxy.e2e.test.js.map