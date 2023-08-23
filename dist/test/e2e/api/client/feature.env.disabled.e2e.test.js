"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_helper_1 = require("../../helpers/test-helper");
const database_init_1 = __importDefault(require("../../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../../fixtures/no-logger"));
const constants_1 = require("../../../../lib/util/constants");
let app;
let db;
const featureName = 'feature.default.1';
const username = 'test';
const projectId = 'default';
beforeAll(async () => {
    db = await (0, database_init_1.default)('feature_env_api_client', no_logger_1.default);
    app = await (0, test_helper_1.setupApp)(db.stores);
    await app.services.featureToggleServiceV2.createFeatureToggle(projectId, {
        name: featureName,
        description: 'the #1 feature',
    }, username);
    await app.services.featureToggleServiceV2.createStrategy({ name: 'default', constraints: [], parameters: {} }, { projectId, featureName, environment: constants_1.DEFAULT_ENV }, username);
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
test('returns feature toggle for default env', async () => {
    await app.services.featureToggleServiceV2.updateEnabled('default', 'feature.default.1', 'default', true, 'test');
    await app.request
        .get('/api/client/features')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.features).toHaveLength(1);
        expect(res.body.features[0].enabled).toBe(true);
        expect(res.body.features[0].strategies).toHaveLength(1);
    });
});
test('returns feature toggle for default env even if it is removed from project', async () => {
    await db.stores.featureEnvironmentStore.disconnectFeatures('default', 'default');
    await db.stores.featureEnvironmentStore.disconnectProject('default', 'default');
    await app.request
        .get('/api/client/features')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.features).toHaveLength(1);
        expect(res.body.features[0].enabled).toBe(false);
        expect(res.body.features[0].strategies).toHaveLength(1);
    });
});
//# sourceMappingURL=feature.env.disabled.e2e.test.js.map