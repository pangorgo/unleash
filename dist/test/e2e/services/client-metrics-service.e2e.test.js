"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const instance_service_1 = __importDefault(require("../../../lib/services/client-metrics/instance-service"));
const date_fns_1 = require("date-fns");
const test_config_1 = require("../../config/test-config");
const faker = require('faker');
const dbInit = require('../helpers/database-init');
const getLogger = require('../../fixtures/no-logger');
const { APPLICATION_CREATED } = require('../../../lib/types/events');
let stores;
let db;
let clientInstanceService;
let config;
beforeAll(async () => {
    db = await dbInit('client_metrics_service_serial', getLogger);
    stores = db.stores;
    config = (0, test_config_1.createTestConfig)({});
    const bulkInterval = (0, date_fns_1.secondsToMilliseconds)(0.5);
    const announcementInterval = (0, date_fns_1.secondsToMilliseconds)(2);
    clientInstanceService = new instance_service_1.default(stores, config, bulkInterval, announcementInterval);
});
afterAll(async () => {
    await clientInstanceService.destroy();
    await db.destroy();
});
test('Apps registered should be announced', async () => {
    expect.assertions(3);
    const clientRegistration = {
        appName: faker.internet.domainName(),
        instanceId: faker.datatype.uuid(),
        strategies: ['default'],
        started: Date.now(),
        interval: faker.datatype.number(),
        icon: '',
        description: faker.company.catchPhrase(),
        color: faker.internet.color(),
    };
    const differentClient = {
        appName: faker.datatype.uuid(),
        instanceId: faker.datatype.uuid(),
        strategies: ['default'],
        started: Date.now(),
        interval: faker.datatype.number(),
        icon: '',
        description: faker.company.catchPhrase(),
        color: faker.internet.color(),
    };
    await clientInstanceService.registerClient(clientRegistration, '127.0.0.1');
    await clientInstanceService.registerClient(differentClient, '127.0.0.1');
    await new Promise((res) => setTimeout(res, 1200));
    const first = await stores.clientApplicationsStore.getUnannounced();
    expect(first.length).toBe(2);
    await clientInstanceService.registerClient(clientRegistration, '127.0.0.1');
    await new Promise((res) => setTimeout(res, (0, date_fns_1.secondsToMilliseconds)(2)));
    const second = await stores.clientApplicationsStore.getUnannounced();
    expect(second.length).toBe(0);
    const events = await stores.eventStore.getEvents();
    const appCreatedEvents = events.filter((e) => e.type === APPLICATION_CREATED);
    expect(appCreatedEvents.length).toBe(2);
});
//# sourceMappingURL=client-metrics-service.e2e.test.js.map