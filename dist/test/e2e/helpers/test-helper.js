"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAppWithBaseUrl = exports.setupAppWithCustomAuth = exports.setupAppWithAuth = exports.setupAppWithCustomConfig = exports.setupApp = void 0;
const supertest_1 = __importDefault(require("supertest"));
const events_1 = __importDefault(require("events"));
const app_1 = __importDefault(require("../../../lib/app"));
const test_config_1 = require("../../config/test-config");
const option_1 = require("../../../lib/types/option");
const services_1 = require("../../../lib/services");
const session_db_1 = __importDefault(require("../../../lib/middleware/session-db"));
const types_1 = require("../../../lib/types");
const util_1 = require("../../../lib/util");
process.env.NODE_ENV = 'test';
function httpApis(request, config) {
    const base = config.server.baseUriPath || '';
    return {
        createFeature: (feature, project = types_1.DEFAULT_PROJECT, expectedResponseCode = 201) => {
            let body = feature;
            if (typeof feature === 'string') {
                body = {
                    name: feature,
                };
            }
            return request
                .post(`${base}/api/admin/projects/${project}/features`)
                .send(body)
                .set('Content-Type', 'application/json')
                .expect(expectedResponseCode);
        },
        getFeatures(name, expectedResponseCode = 200) {
            const featuresUrl = `/api/admin/features${name ? `/${name}` : ''}`;
            return request
                .get(featuresUrl)
                .set('Content-Type', 'application/json')
                .expect(expectedResponseCode);
        },
        getProjectFeatures(project = types_1.DEFAULT_PROJECT, name, expectedResponseCode = 200) {
            const featuresUrl = `/api/admin/projects/${project}/features${name ? `/${name}` : ''}`;
            return request
                .get(featuresUrl)
                .set('Content-Type', 'application/json')
                .expect(expectedResponseCode);
        },
        archiveFeature(name, project = types_1.DEFAULT_PROJECT, expectedResponseCode = 202) {
            return request
                .delete(`${base}/api/admin/projects/${project}/features/${name}`)
                .set('Content-Type', 'application/json')
                .expect(expectedResponseCode);
        },
        createContextField(contextField, expectedResponseCode = 201) {
            return request
                .post(`${base}/api/admin/context`)
                .send(contextField)
                .expect(expectedResponseCode);
        },
        linkProjectToEnvironment(project, environment = util_1.DEFAULT_ENV, expectedResponseCode = 200) {
            return request
                .post(`${base}/api/admin/projects/${project}/environments`)
                .send({
                environment,
            })
                .expect(expectedResponseCode);
        },
        importToggles(importPayload, expectedResponseCode = 200) {
            return request
                .post('/api/admin/features-batch/import')
                .send(importPayload)
                .set('Content-Type', 'application/json')
                .expect(expectedResponseCode);
        },
    };
}
async function createApp(stores, adminAuthentication = option_1.IAuthType.NONE, preHook, customOptions, db) {
    const config = (0, test_config_1.createTestConfig)({
        authentication: {
            type: adminAuthentication,
            customAuthHandler: preHook,
        },
        server: {
            unleashUrl: 'http://localhost:4242',
        },
        disableScheduler: true,
        ...{
            ...customOptions,
            experimental: {
                ...(customOptions?.experimental ?? {}),
                flags: {
                    strictSchemaValidation: true,
                    ...(customOptions?.experimental?.flags ?? {}),
                },
            },
        },
    });
    const services = (0, services_1.createServices)(stores, config, db);
    const unleashSession = (0, session_db_1.default)(config, undefined);
    const emitter = new events_1.default();
    emitter.setMaxListeners(0);
    const app = await (0, app_1.default)(config, stores, services, unleashSession, db);
    const request = supertest_1.default.agent(app);
    const destroy = async () => {
        services.versionService.destroy();
        services.clientInstanceService.destroy();
        services.clientMetricsServiceV2.destroy();
        services.proxyService.destroy();
    };
    // TODO: use create from server-impl instead?
    return {
        request,
        destroy,
        services,
        config,
        ...httpApis(request, config),
    };
}
async function setupApp(stores) {
    return createApp(stores);
}
exports.setupApp = setupApp;
async function setupAppWithCustomConfig(stores, 
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
customOptions, db) {
    return createApp(stores, undefined, undefined, customOptions, db);
}
exports.setupAppWithCustomConfig = setupAppWithCustomConfig;
async function setupAppWithAuth(stores, 
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
customOptions, db) {
    return createApp(stores, option_1.IAuthType.DEMO, undefined, customOptions, db);
}
exports.setupAppWithAuth = setupAppWithAuth;
async function setupAppWithCustomAuth(stores, preHook, 
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
customOptions) {
    return createApp(stores, option_1.IAuthType.CUSTOM, preHook, customOptions);
}
exports.setupAppWithCustomAuth = setupAppWithCustomAuth;
async function setupAppWithBaseUrl(stores) {
    return createApp(stores, undefined, undefined, {
        server: {
            unleashUrl: 'http://localhost:4242',
            basePathUri: '/hosted',
        },
    });
}
exports.setupAppWithBaseUrl = setupAppWithBaseUrl;
//# sourceMappingURL=test-helper.js.map