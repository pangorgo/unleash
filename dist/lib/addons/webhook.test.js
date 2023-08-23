"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../types/events");
const webhook_1 = __importDefault(require("./webhook"));
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
test('Should handle event without "bodyTemplate"', () => {
    const addon = new webhook_1.default({ getLogger: no_logger_1.default });
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
        url: 'http://test.webhook.com',
    };
    addon.handleEvent(event, parameters);
    expect(fetchRetryCalls.length).toBe(1);
    expect(fetchRetryCalls[0].url).toBe(parameters.url);
    expect(fetchRetryCalls[0].options.body).toBe(JSON.stringify(event));
});
test('Should format event with "bodyTemplate"', () => {
    const addon = new webhook_1.default({ getLogger: no_logger_1.default });
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
        url: 'http://test.webhook.com/plain',
        bodyTemplate: '{{event.type}} on toggle {{event.data.name}}',
        contentType: 'text/plain',
    };
    addon.handleEvent(event, parameters);
    const call = fetchRetryCalls[0];
    expect(fetchRetryCalls.length).toBe(1);
    expect(call.url).toBe(parameters.url);
    expect(call.options.headers['Content-Type']).toBe('text/plain');
    expect(call.options.body).toBe('feature-created on toggle some-toggle');
});
test('Should format event with "authorization"', () => {
    const addon = new webhook_1.default({ getLogger: no_logger_1.default });
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
        url: 'http://test.webhook.com/plain',
        bodyTemplate: '{{event.type}} on toggle {{event.data.name}}',
        contentType: 'text/plain',
        authorization: 'API KEY 123abc',
    };
    addon.handleEvent(event, parameters);
    const call = fetchRetryCalls[0];
    expect(fetchRetryCalls.length).toBe(1);
    expect(call.url).toBe(parameters.url);
    expect(call.options.headers.Authorization).toBe(parameters.authorization);
    expect(call.options.body).toBe('feature-created on toggle some-toggle');
});
test('Should handle custom headers', async () => {
    const addon = new webhook_1.default({ getLogger: no_logger_1.default });
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
        url: 'http://test.webhook.com/plain',
        bodyTemplate: '{{event.type}} on toggle {{event.data.name}}',
        contentType: 'text/plain',
        authorization: 'API KEY 123abc',
        customHeaders: `{ "MY_CUSTOM_HEADER": "MY_CUSTOM_VALUE" }`,
    };
    addon.handleEvent(event, parameters);
    const call = fetchRetryCalls[0];
    expect(fetchRetryCalls.length).toBe(1);
    expect(call.url).toBe(parameters.url);
    expect(call.options.headers.Authorization).toBe(parameters.authorization);
    expect(call.options.headers.MY_CUSTOM_HEADER).toBe('MY_CUSTOM_VALUE');
    expect(call.options.body).toBe('feature-created on toggle some-toggle');
});
//# sourceMappingURL=webhook.test.js.map