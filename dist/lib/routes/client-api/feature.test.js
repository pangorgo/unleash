"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const store_1 = __importDefault(require("../../../test/fixtures/store"));
const no_logger_1 = __importDefault(require("../../../test/fixtures/no-logger"));
const app_1 = __importDefault(require("../../app"));
const services_1 = require("../../services");
const feature_1 = __importDefault(require("./feature"));
const test_config_1 = require("../../../test/config/test-config");
const date_fns_1 = require("date-fns");
const client_spec_service_1 = require("../../services/client-spec-service");
async function getSetup() {
    const base = `/random${Math.round(Math.random() * 1000)}`;
    const stores = (0, store_1.default)();
    const config = (0, test_config_1.createTestConfig)({
        server: { baseUriPath: base },
    });
    const services = (0, services_1.createServices)(stores, config);
    const app = await (0, app_1.default)(config, stores, services);
    return {
        base,
        featureToggleStore: stores.featureToggleStore,
        featureToggleClientStore: stores.featureToggleClientStore,
        request: (0, supertest_1.default)(app),
        destroy: () => {
            services.versionService.destroy();
            services.clientInstanceService.destroy();
        },
    };
}
const callGetAll = async (controller) => {
    await controller.getAll(
    // @ts-expect-error
    { query: {}, header: () => undefined, headers: {} }, {
        json: () => { },
        setHeader: () => undefined,
    });
};
let base;
let request;
let destroy;
let featureToggleClientStore;
let flagResolver;
beforeEach(async () => {
    const setup = await getSetup();
    base = setup.base;
    request = setup.request;
    featureToggleClientStore = setup.featureToggleClientStore;
    destroy = setup.destroy;
    flagResolver = {
        isEnabled: () => {
            return false;
        },
    };
});
afterEach(() => {
    destroy();
});
test('should get empty getFeatures via client', () => {
    expect.assertions(1);
    return request
        .get(`${base}/api/client/features`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.features.length === 0).toBe(true);
    });
});
test('if caching is enabled should memoize', async () => {
    const getClientFeatures = jest.fn().mockReturnValue([]);
    const getActive = jest.fn().mockReturnValue([]);
    const getActiveForClient = jest.fn().mockReturnValue([]);
    const respondWithValidation = jest.fn().mockReturnValue({});
    const validPath = jest.fn().mockReturnValue(jest.fn());
    const clientSpecService = new client_spec_service_1.ClientSpecService({ getLogger: no_logger_1.default });
    const openApiService = { respondWithValidation, validPath };
    const featureToggleServiceV2 = { getClientFeatures };
    const segmentService = { getActive, getActiveForClient };
    const configurationRevisionService = { getMaxRevisionId: () => 1 };
    const controller = new feature_1.default({
        clientSpecService,
        // @ts-expect-error due to partial implementation
        openApiService,
        // @ts-expect-error due to partial implementation
        featureToggleServiceV2,
        // @ts-expect-error due to partial implementation
        segmentService,
        // @ts-expect-error due to partial implementation
        configurationRevisionService,
    }, {
        getLogger: no_logger_1.default,
        clientFeatureCaching: {
            enabled: true,
            maxAge: (0, date_fns_1.secondsToMilliseconds)(10),
        },
        flagResolver,
    });
    await callGetAll(controller);
    await callGetAll(controller);
    expect(getClientFeatures).toHaveBeenCalledTimes(1);
});
test('if caching is not enabled all calls goes to service', async () => {
    const getClientFeatures = jest.fn().mockReturnValue([]);
    const getActive = jest.fn().mockReturnValue([]);
    const getActiveForClient = jest.fn().mockReturnValue([]);
    const respondWithValidation = jest.fn().mockReturnValue({});
    const validPath = jest.fn().mockReturnValue(jest.fn());
    const clientSpecService = new client_spec_service_1.ClientSpecService({ getLogger: no_logger_1.default });
    const featureToggleServiceV2 = { getClientFeatures };
    const segmentService = { getActive, getActiveForClient };
    const openApiService = { respondWithValidation, validPath };
    const configurationRevisionService = { getMaxRevisionId: () => 1 };
    const controller = new feature_1.default({
        clientSpecService,
        // @ts-expect-error due to partial implementation
        openApiService,
        // @ts-expect-error due to partial implementation
        featureToggleServiceV2,
        // @ts-expect-error due to partial implementation
        segmentService,
        // @ts-expect-error due to partial implementation
        configurationRevisionService,
    }, {
        getLogger: no_logger_1.default,
        clientFeatureCaching: {
            enabled: false,
            maxAge: (0, date_fns_1.secondsToMilliseconds)(10),
        },
        flagResolver,
    });
    await callGetAll(controller);
    await callGetAll(controller);
    expect(getClientFeatures).toHaveBeenCalledTimes(2);
});
test('fetch single feature', async () => {
    expect.assertions(1);
    await featureToggleClientStore.createFeature({
        name: 'test_',
        strategies: [{ name: 'default' }],
    });
    return request
        .get(`${base}/api/client/features/test_`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.name === 'test_').toBe(true);
    });
});
test('support name prefix', async () => {
    expect.assertions(2);
    await featureToggleClientStore.createFeature({ name: 'a_test1' });
    await featureToggleClientStore.createFeature({ name: 'a_test2' });
    await featureToggleClientStore.createFeature({ name: 'b_test1' });
    await featureToggleClientStore.createFeature({ name: 'b_test2' });
    const namePrefix = 'b_';
    return request
        .get(`${base}/api/client/features?namePrefix=${namePrefix}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.features.length).toBe(2);
        expect(res.body.features[1].name).toBe('b_test2');
    });
});
test('support filtering on project', async () => {
    expect.assertions(2);
    await featureToggleClientStore.createFeature({
        name: 'a_test1',
        project: 'projecta',
    });
    await featureToggleClientStore.createFeature({
        name: 'b_test2',
        project: 'projectb',
    });
    return request
        .get(`${base}/api/client/features?project=projecta`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
        expect(res.body.features).toHaveLength(1);
        expect(res.body.features[0].name).toBe('a_test1');
    });
});
//# sourceMappingURL=feature.test.js.map