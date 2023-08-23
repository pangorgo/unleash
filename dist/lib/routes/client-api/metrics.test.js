"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const store_1 = __importDefault(require("../../../test/fixtures/store"));
const app_1 = __importDefault(require("../../app"));
const test_config_1 = require("../../../test/config/test-config");
const schema_1 = require("../../services/client-metrics/schema");
const services_1 = require("../../services");
async function getSetup(opts) {
    const stores = (0, store_1.default)();
    const config = (0, test_config_1.createTestConfig)(opts);
    const services = (0, services_1.createServices)(stores, config);
    const app = await (0, app_1.default)(config, stores, services);
    return {
        request: (0, supertest_1.default)(app),
        stores,
        services,
        destroy: () => {
            services.versionService.destroy();
            services.clientInstanceService.destroy();
        },
    };
}
let request;
let stores;
let services;
let destroy;
beforeEach(async () => {
    const setup = await getSetup();
    request = setup.request;
    stores = setup.stores;
    destroy = setup.destroy;
    services = setup.services;
});
afterEach(() => {
    destroy();
});
test('should validate client metrics', () => {
    return request
        .post('/api/client/metrics')
        .send({ random: 'blush' })
        .expect(400);
});
test('should accept empty client metrics', () => {
    return request
        .post('/api/client/metrics')
        .send({
        appName: 'demo',
        instanceId: '1',
        bucket: {
            start: Date.now(),
            stop: Date.now(),
            toggles: {},
        },
    })
        .expect(202);
});
test('should accept client metrics with yes/no', () => {
    return request
        .post('/api/client/metrics')
        .send({
        appName: 'demo',
        instanceId: '1',
        bucket: {
            start: Date.now(),
            stop: Date.now(),
            toggles: {
                toggleA: {
                    yes: 200,
                    no: 0,
                },
            },
        },
    })
        .expect(202);
});
test('should accept client metrics with yes/no with metricsV2', async () => {
    const testRunner = await getSetup();
    await testRunner.request
        .post('/api/client/metrics')
        .send({
        appName: 'demo',
        instanceId: '1',
        bucket: {
            start: Date.now(),
            stop: Date.now(),
            toggles: {
                toggleA: {
                    yes: 200,
                    no: 0,
                },
            },
        },
    })
        .expect(202);
    testRunner.destroy();
});
test('should accept client metrics with variants', () => {
    return request
        .post('/api/client/metrics')
        .send({
        appName: 'demo',
        instanceId: '1',
        bucket: {
            start: Date.now(),
            stop: Date.now(),
            toggles: {
                toggleA: {
                    yes: 200,
                    no: 0,
                    variants: {
                        variant1: 1,
                        variant2: 2,
                    },
                },
            },
        },
    })
        .expect(202);
});
test('should accept client metrics without yes/no', () => {
    return request
        .post('/api/client/metrics')
        .send({
        appName: 'demo',
        instanceId: '1',
        bucket: {
            start: Date.now(),
            stop: Date.now(),
            toggles: {
                toggleA: {
                    blue: 200,
                    green: 0,
                },
            },
        },
    })
        .expect(202);
});
test('schema allow empty strings', () => {
    const data = {
        appName: 'java-test',
        instanceId: 'instance y',
        bucket: {
            toggles: { Demo2: { yes: '', no: '', variants: {} } },
            start: '2019-05-06T08:30:40.514Z',
            stop: '2019-05-06T09:30:50.515Z',
        },
    };
    const { error, value } = schema_1.clientMetricsSchema.validate(data);
    expect(error).toBeFalsy();
    expect(value.bucket.toggles.Demo2.yes).toBe(0);
    expect(value.bucket.toggles.Demo2.no).toBe(0);
});
test('schema allow yes=<string nbr>', () => {
    const data = {
        appName: 'java-test',
        instanceId: 'instance y',
        bucket: {
            toggles: { Demo2: { yes: '12', no: 256, variants: {} } },
            start: '2019-05-06T08:30:40.514Z',
            stop: '2019-05-06T09:30:50.515Z',
        },
    };
    const { error, value } = schema_1.clientMetricsSchema.validate(data);
    expect(error).toBeFalsy();
    expect(value.bucket.toggles.Demo2.yes).toBe(12);
    expect(value.bucket.toggles.Demo2.no).toBe(256);
});
test('should set lastSeen on toggle', async () => {
    expect.assertions(1);
    stores.featureToggleStore.create('default', {
        name: 'toggleLastSeen',
    });
    await request
        .post('/api/client/metrics')
        .send({
        appName: 'demo',
        bucket: {
            start: Date.now(),
            stop: Date.now(),
            toggles: {
                toggleLastSeen: {
                    yes: 200,
                    no: 0,
                },
            },
        },
    })
        .expect(202);
    await services.lastSeenService.store();
    const toggle = await stores.featureToggleStore.get('toggleLastSeen');
    expect(toggle.lastSeenAt).toBeTruthy();
});
test('should return a 400 when required fields are missing', async () => {
    stores.featureToggleStore.create('default', {
        name: 'toggleLastSeen',
    });
    await request
        .post('/api/client/metrics')
        .send({
        appName: 'demo',
        bucket: {
            start: Date.now(),
            toggles: {
                toggleLastSeen: {
                    yes: 200,
                    no: 0,
                },
            },
        },
    })
        .expect(400);
});
test('should return a 200 if required fields are there', async () => {
    stores.featureToggleStore.create('default', {
        name: 'toggleLastSeen',
    });
    await request
        .post('/api/client/metrics')
        .send({
        appName: 'demo',
        someParam: 'some-value',
        somOtherParam: 'some--other-value',
        bucket: {
            start: Date.now(),
            stop: Date.now(),
            toggles: {
                toggleLastSeen: {
                    yes: 200,
                    no: 0,
                },
            },
        },
    })
        .expect(202);
});
//# sourceMappingURL=metrics.test.js.map