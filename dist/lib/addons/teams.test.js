"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../types/events");
const teams_1 = __importDefault(require("./teams"));
const no_logger_1 = __importDefault(require("../../test/fixtures/no-logger"));
let fetchRetryCalls;
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
test('Should call teams webhook', async () => {
    const addon = new teams_1.default({
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
        url: 'http://hooks.office.com',
    };
    await addon.handleEvent(event, parameters);
    expect(fetchRetryCalls.length).toBe(1);
    expect(fetchRetryCalls[0].url).toBe(parameters.url);
    expect(fetchRetryCalls[0].options.body).toMatchSnapshot();
});
test('Should call teams webhook for archived toggle', async () => {
    const addon = new teams_1.default({
        getLogger: no_logger_1.default,
        unleashUrl: 'http://some-url.com',
    });
    const event = {
        id: 1,
        createdAt: new Date(),
        type: events_1.FEATURE_ARCHIVED,
        createdBy: 'some@user.com',
        featureName: 'some-toggle',
        data: {
            name: 'some-toggle',
        },
    };
    const parameters = {
        url: 'http://hooks.office.com',
    };
    await addon.handleEvent(event, parameters);
    expect(fetchRetryCalls.length).toBe(1);
    expect(fetchRetryCalls[0].url).toBe(parameters.url);
    expect(fetchRetryCalls[0].options.body).toMatchSnapshot();
});
test('Should call teams webhook for archived toggle with project info', async () => {
    const addon = new teams_1.default({
        getLogger: no_logger_1.default,
        unleashUrl: 'http://some-url.com',
    });
    const event = {
        id: 1,
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
        url: 'http://hooks.office.com',
    };
    await addon.handleEvent(event, parameters);
    expect(fetchRetryCalls.length).toBe(1);
    expect(fetchRetryCalls[0].url).toBe(parameters.url);
    expect(fetchRetryCalls[0].options.body).toMatchSnapshot();
});
test(`Should call teams webhook for toggled environment`, async () => {
    const addon = new teams_1.default({
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
    };
    await addon.handleEvent(event, parameters);
    expect(fetchRetryCalls).toHaveLength(1);
    expect(fetchRetryCalls[0].url).toBe(parameters.url);
    expect(fetchRetryCalls[0].options.body).toMatch(/disabled/);
    expect(fetchRetryCalls[0].options.body).toMatchSnapshot();
});
test('Should include custom headers in call to teams', async () => {
    const addon = new teams_1.default({
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
        customHeaders: `{ "MY_CUSTOM_HEADER": "MY_CUSTOM_VALUE" }`,
    };
    await addon.handleEvent(event, parameters);
    expect(fetchRetryCalls).toHaveLength(1);
    expect(fetchRetryCalls[0].url).toBe(parameters.url);
    expect(fetchRetryCalls[0].options.body).toMatch(/disabled/);
    expect(fetchRetryCalls[0].options.body).toMatchSnapshot();
    expect(fetchRetryCalls[0].options.headers).toMatchSnapshot();
});
//# sourceMappingURL=teams.test.js.map