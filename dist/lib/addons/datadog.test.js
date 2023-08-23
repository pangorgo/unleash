"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../types/events");
const datadog_1 = __importDefault(require("./datadog"));
const no_logger_1 = __importDefault(require("../../test/fixtures/no-logger"));
let fetchRetryCalls = [];
jest.mock('./addon', () => class Addon {
    constructor(definition, { getLogger }) {
        this.logger = getLogger('addon/test');
        fetchRetryCalls = [];
    }
    async fetchRetry(url, options, retries, backoff) {
        fetchRetryCalls.push({
            url,
            options,
            retries,
            backoff,
        });
        return Promise.resolve({ status: 200 });
    }
});
test('Should call datadog webhook', async () => {
    const addon = new datadog_1.default({
        getLogger: no_logger_1.default,
        unleashUrl: 'http://some-url.com',
    });
    const event = {
        id: 1,
        createdAt: new Date(),
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        featureName: 'some-toggle',
        data: {
            name: 'some-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    };
    const parameters = {
        url: 'http://api.datadoghq.com/api/v1/events',
        apiKey: 'fakeKey',
    };
    await addon.handleEvent(event, parameters);
    expect(fetchRetryCalls.length).toBe(1);
    expect(fetchRetryCalls[0].url).toBe(parameters.url);
    expect(fetchRetryCalls[0].options.body).toMatchSnapshot();
});
test('Should call datadog webhook  for archived toggle', async () => {
    const addon = new datadog_1.default({
        getLogger: no_logger_1.default,
        unleashUrl: 'http://some-url.com',
    });
    const event = {
        id: 2,
        createdAt: new Date(),
        type: events_1.FEATURE_ARCHIVED,
        createdBy: 'some@user.com',
        featureName: 'some-toggle',
        data: {
            name: 'some-toggle',
        },
    };
    const parameters = {
        url: 'http://api.datadoghq.com/api/v1/events',
        apiKey: 'fakeKey',
    };
    await addon.handleEvent(event, parameters);
    expect(fetchRetryCalls.length).toBe(1);
    expect(fetchRetryCalls[0].url).toBe(parameters.url);
    expect(fetchRetryCalls[0].options.body).toMatchSnapshot();
});
test('Should call datadog webhook  for archived toggle with project info', async () => {
    const addon = new datadog_1.default({
        getLogger: no_logger_1.default,
        unleashUrl: 'http://some-url.com',
    });
    const event = {
        id: 2,
        createdAt: new Date(),
        type: events_1.FEATURE_ARCHIVED,
        createdBy: 'some@user.com',
        featureName: 'some-toggle',
        project: 'some-project',
        data: {
            name: 'some-toggle',
        },
    };
    const parameters = {
        url: 'http://api.datadoghq.com/api/v1/events',
        apiKey: 'fakeKey',
    };
    await addon.handleEvent(event, parameters);
    expect(fetchRetryCalls.length).toBe(1);
    expect(fetchRetryCalls[0].url).toBe(parameters.url);
    expect(fetchRetryCalls[0].options.body).toMatchSnapshot();
});
test(`Should call datadog webhook for toggled environment`, async () => {
    const addon = new datadog_1.default({
        getLogger: no_logger_1.default,
        unleashUrl: 'http://some-url.com',
    });
    const event = {
        id: 2,
        createdAt: new Date(),
        type: events_1.FEATURE_ENVIRONMENT_DISABLED,
        createdBy: 'some@user.com',
        environment: 'development',
        project: 'default',
        featureName: 'some-toggle',
        data: {
            name: 'some-toggle',
        },
    };
    const parameters = {
        url: 'http://hooks.slack.com',
        apiKey: 'fakeKey',
    };
    await addon.handleEvent(event, parameters);
    expect(fetchRetryCalls).toHaveLength(1);
    expect(fetchRetryCalls[0].url).toBe(parameters.url);
    expect(fetchRetryCalls[0].options.body).toMatch(/disabled/);
    expect(fetchRetryCalls[0].options.body).toMatchSnapshot();
});
test(`Should include customHeaders in headers when calling service`, async () => {
    const addon = new datadog_1.default({
        getLogger: no_logger_1.default,
        unleashUrl: 'http://some-url.com',
    });
    const event = {
        id: 2,
        createdAt: new Date(),
        type: events_1.FEATURE_ENVIRONMENT_DISABLED,
        createdBy: 'some@user.com',
        environment: 'development',
        project: 'default',
        featureName: 'some-toggle',
        data: {
            name: 'some-toggle',
        },
    };
    const parameters = {
        url: 'http://hooks.slack.com',
        apiKey: 'fakeKey',
        customHeaders: `{ "MY_CUSTOM_HEADER": "MY_CUSTOM_VALUE" }`,
    };
    await addon.handleEvent(event, parameters);
    expect(fetchRetryCalls).toHaveLength(1);
    expect(fetchRetryCalls[0].url).toBe(parameters.url);
    expect(fetchRetryCalls[0].options.body).toMatch(/disabled/);
    expect(fetchRetryCalls[0].options.body).toMatchSnapshot();
    expect(fetchRetryCalls[0].options.headers).toMatchSnapshot();
});
test(`Should not include source_type_name when included in the config`, async () => {
    const addon = new datadog_1.default({
        getLogger: no_logger_1.default,
        unleashUrl: 'http://some-url.com',
    });
    const event = {
        id: 2,
        createdAt: new Date(),
        type: events_1.FEATURE_ENVIRONMENT_DISABLED,
        createdBy: 'some@user.com',
        environment: 'development',
        project: 'default',
        featureName: 'some-toggle',
        data: {
            name: 'some-toggle',
        },
    };
    const parameters = {
        url: 'http://hooks.slack.com',
        apiKey: 'fakeKey',
        sourceTypeName: 'my-custom-source-type',
    };
    await addon.handleEvent(event, parameters);
    expect(fetchRetryCalls).toHaveLength(1);
    expect(fetchRetryCalls[0].url).toBe(parameters.url);
    expect(fetchRetryCalls[0].options.body).toMatch(/"source_type_name":"my-custom-source-type"/);
    expect(fetchRetryCalls[0].options.body).toMatchSnapshot();
    expect(fetchRetryCalls[0].options.headers).toMatchSnapshot();
});
//# sourceMappingURL=datadog.test.js.map