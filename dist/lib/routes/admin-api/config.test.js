"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const test_config_1 = require("../../../test/config/test-config");
const store_1 = __importDefault(require("../../../test/fixtures/store"));
const app_1 = __importDefault(require("../../app"));
const services_1 = require("../../services");
const segments_1 = require("../../util/segments");
const uiConfig = {
    headerBackground: 'red',
    slogan: 'hello',
};
async function getSetup() {
    const base = `/random${Math.round(Math.random() * 1000)}`;
    const config = (0, test_config_1.createTestConfig)({
        server: { baseUriPath: base },
        ui: uiConfig,
    });
    const stores = (0, store_1.default)();
    const services = (0, services_1.createServices)(stores, config);
    const app = await (0, app_1.default)(config, stores, services);
    return {
        base,
        request: (0, supertest_1.default)(app),
        destroy: () => {
            services.versionService.destroy();
            services.clientInstanceService.destroy();
        },
    };
}
let request;
let base;
let destroy;
beforeEach(async () => {
    const setup = await getSetup();
    request = setup.request;
    base = setup.base;
    destroy = setup.destroy;
});
afterEach(() => {
    destroy();
});
test('should get ui config', async () => {
    const { body } = await request
        .get(`${base}/api/admin/ui-config`)
        .expect('Content-Type', /json/)
        .expect(200);
    expect(body.slogan).toEqual('hello');
    expect(body.headerBackground).toEqual('red');
    expect(body.segmentValuesLimit).toEqual(segments_1.DEFAULT_SEGMENT_VALUES_LIMIT);
    expect(body.strategySegmentsLimit).toEqual(segments_1.DEFAULT_STRATEGY_SEGMENTS_LIMIT);
});
//# sourceMappingURL=config.test.js.map