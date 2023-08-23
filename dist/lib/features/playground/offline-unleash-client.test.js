"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offlineUnleashClientNode = void 0;
const offline_unleash_client_1 = require("./offline-unleash-client");
const unleash_client_1 = require("unleash-client");
const events_1 = require("events");
const playground_strategy_schema_1 = require("../../openapi/spec/playground-strategy-schema");
const offlineUnleashClientNode = async ({ features, context, logError, segments, }) => {
    const client = new unleash_client_1.Unleash({
        ...context,
        appName: context.appName,
        disableMetrics: true,
        refreshInterval: 0,
        skipInstanceCountWarning: true,
        url: 'not-needed',
        storageProvider: new unleash_client_1.InMemStorageProvider(),
        bootstrap: {
            data: (0, offline_unleash_client_1.mapFeaturesForClient)(features),
            segments: (0, offline_unleash_client_1.mapSegmentsForClient)(segments),
        },
    });
    client.on('error', logError);
    client.start();
    await (0, events_1.once)(client, 'ready');
    return client;
};
exports.offlineUnleashClientNode = offlineUnleashClientNode;
describe('offline client', () => {
    it('considers enabled variants with a default strategy to be on', async () => {
        const name = 'toggle-name';
        const client = await (0, offline_unleash_client_1.offlineUnleashClient)({
            features: [
                {
                    name,
                    project: 'default',
                    enabled: true,
                    strategies: [{ name: 'default' }],
                    variants: [],
                    type: '',
                    stale: false,
                },
            ],
            context: { appName: 'other-app', environment: 'default' },
            logError: console.log,
        });
        expect(client.isEnabled(name).result).toBeTruthy();
    });
    it('constrains on appName', async () => {
        const enabledFeature = 'toggle-name';
        const disabledFeature = 'other-toggle';
        const appName = 'app-name';
        const client = await (0, offline_unleash_client_1.offlineUnleashClient)({
            features: [
                {
                    name: enabledFeature,
                    enabled: true,
                    project: 'default',
                    strategies: [
                        {
                            name: 'default',
                            constraints: [
                                {
                                    contextName: 'appName',
                                    operator: 'IN',
                                    values: [appName],
                                },
                            ],
                        },
                    ],
                    variants: [],
                    type: '',
                    stale: false,
                },
                {
                    name: disabledFeature,
                    enabled: true,
                    project: 'default',
                    strategies: [
                        {
                            name: 'default',
                            constraints: [
                                {
                                    contextName: 'appName',
                                    operator: 'IN',
                                    values: ['otherApp'],
                                },
                            ],
                        },
                    ],
                    variants: [],
                    type: '',
                    stale: false,
                },
            ],
            context: { appName, environment: 'default' },
            logError: console.log,
        });
        expect(client.isEnabled(enabledFeature).result).toBeTruthy();
        expect(client.isEnabled(disabledFeature).result).toBeFalsy();
    });
    it('considers disabled features with a default strategy to be enabled', async () => {
        const name = 'toggle-name';
        const context = { appName: 'client-test' };
        const client = await (0, offline_unleash_client_1.offlineUnleashClient)({
            features: [
                {
                    strategies: [
                        {
                            name: 'default',
                        },
                    ],
                    project: 'default',
                    stale: false,
                    enabled: false,
                    name,
                    type: 'experiment',
                    variants: [],
                },
            ],
            context,
            logError: console.log,
        });
        const result = client.isEnabled(name, context);
        expect(result.result).toBe(true);
    });
    it('considers disabled variants with a default strategy and variants to be on', async () => {
        const name = 'toggle-name';
        const client = await (0, offline_unleash_client_1.offlineUnleashClient)({
            features: [
                {
                    strategies: [
                        {
                            name: 'default',
                        },
                    ],
                    project: 'default',
                    stale: false,
                    enabled: false,
                    name,
                    type: 'experiment',
                    variants: [
                        {
                            name: 'a',
                            weight: 500,
                            weightType: 'variable',
                            stickiness: 'default',
                            overrides: [],
                        },
                        {
                            name: 'b',
                            weight: 500,
                            weightType: 'variable',
                            stickiness: 'default',
                            overrides: [],
                        },
                    ],
                },
            ],
            context: { appName: 'client-test' },
            logError: console.log,
        });
        expect(client.isEnabled(name).result).toBe(true);
    });
    it("returns variant {name: 'disabled', enabled: false } if the toggle isn't enabled", async () => {
        const name = 'toggle-name';
        const client = await (0, offline_unleash_client_1.offlineUnleashClient)({
            features: [
                {
                    strategies: [],
                    stale: false,
                    enabled: false,
                    name,
                    project: 'default',
                    type: 'experiment',
                    variants: [
                        {
                            name: 'a',
                            weight: 500,
                            weightType: 'variable',
                            stickiness: 'default',
                            overrides: [],
                        },
                        {
                            name: 'b',
                            weight: 500,
                            weightType: 'variable',
                            stickiness: 'default',
                            overrides: [],
                        },
                    ],
                },
            ],
            context: { appName: 'client-test' },
            logError: console.log,
        });
        expect(client.isEnabled(name).result).toBeFalsy();
        expect(client.getVariant(name).name).toEqual('disabled');
        expect(client.getVariant(name).enabled).toBeFalsy();
    });
    it('returns the disabled variant if there are no variants', async () => {
        const name = 'toggle-name';
        const client = await (0, offline_unleash_client_1.offlineUnleashClient)({
            features: [
                {
                    strategies: [
                        {
                            name: 'default',
                            constraints: [],
                        },
                    ],
                    project: 'default',
                    stale: false,
                    enabled: true,
                    name,
                    type: 'experiment',
                    variants: [],
                },
            ],
            context: { appName: 'client-test' },
            logError: console.log,
        });
        expect(client.getVariant(name, {}).name).toEqual('disabled');
        expect(client.getVariant(name, {}).enabled).toBeFalsy();
        expect(client.isEnabled(name, {}).result).toBeTruthy();
    });
    it('returns strategy variant over feature variant', async () => {
        const name = 'toggle-name';
        const client = await (0, offline_unleash_client_1.offlineUnleashClient)({
            features: [
                {
                    strategies: [
                        {
                            name: 'default',
                            constraints: [
                                {
                                    values: ['my-app-name'],
                                    inverted: false,
                                    operator: 'IN',
                                    contextName: 'appName',
                                    caseInsensitive: false,
                                },
                            ],
                            variants: [
                                {
                                    name: 'ignoreNonMatchingStrategyVariant',
                                    weightType: 'variable',
                                    weight: 1000,
                                    stickiness: 'default',
                                },
                            ],
                        },
                        {
                            name: 'default',
                            constraints: [
                                {
                                    values: ['client-test'],
                                    inverted: false,
                                    operator: 'IN',
                                    contextName: 'appName',
                                    caseInsensitive: false,
                                },
                            ],
                            variants: [
                                {
                                    name: 'strategyVariant',
                                    weightType: 'variable',
                                    weight: 1000,
                                    stickiness: 'default',
                                },
                            ],
                        },
                    ],
                    project: 'default',
                    stale: false,
                    enabled: true,
                    name,
                    type: 'experiment',
                    variants: [
                        {
                            name: 'ignoreFeatureStrategyVariant',
                            weightType: 'variable',
                            weight: 1000,
                            stickiness: 'default',
                        },
                    ],
                },
            ],
            context: { appName: 'client-test' },
            logError: console.log,
        });
        expect(client.getVariant(name, {}).name).toEqual('strategyVariant');
        expect(client.getVariant(name, {}).enabled).toBeTruthy();
        expect(client.isEnabled(name, {}).result).toBeTruthy();
    });
    it(`returns '${playground_strategy_schema_1.playgroundStrategyEvaluation.unknownResult}' if it can't evaluate a feature`, async () => {
        const name = 'toggle-name';
        const context = { appName: 'client-test' };
        const client = await (0, offline_unleash_client_1.offlineUnleashClient)({
            features: [
                {
                    strategies: [
                        {
                            name: 'unimplemented-custom-strategy',
                            constraints: [],
                        },
                    ],
                    project: 'default',
                    stale: false,
                    enabled: true,
                    name,
                    type: 'experiment',
                    variants: [],
                },
            ],
            context,
            logError: console.log,
        });
        const result = client.isEnabled(name, context);
        result.strategies.forEach((strategy) => expect(strategy.result.enabled).toEqual(playground_strategy_schema_1.playgroundStrategyEvaluation.unknownResult));
        expect(result.result).toEqual(playground_strategy_schema_1.playgroundStrategyEvaluation.unknownResult);
    });
    it(`returns '${playground_strategy_schema_1.playgroundStrategyEvaluation.unknownResult}' for the application hostname strategy`, async () => {
        const name = 'toggle-name';
        const context = { appName: 'client-test' };
        const client = await (0, offline_unleash_client_1.offlineUnleashClient)({
            features: [
                {
                    strategies: [
                        {
                            name: 'applicationHostname',
                            constraints: [],
                        },
                    ],
                    project: 'default',
                    stale: false,
                    enabled: true,
                    name,
                    type: 'experiment',
                    variants: [],
                },
            ],
            context,
            logError: console.log,
        });
        const result = client.isEnabled(name, context);
        result.strategies.forEach((strategy) => expect(strategy.result.enabled).toEqual(playground_strategy_schema_1.playgroundStrategyEvaluation.unknownResult));
        expect(result.result).toEqual(playground_strategy_schema_1.playgroundStrategyEvaluation.unknownResult);
    });
    it('returns strategies in the order they are provided', async () => {
        const featureName = 'featureName';
        const strategies = [
            {
                name: 'default',
                constraints: [],
                parameters: {},
            },
            {
                name: 'default',
                constraints: [
                    {
                        values: ['my-app-name'],
                        inverted: false,
                        operator: 'IN',
                        contextName: 'appName',
                        caseInsensitive: false,
                    },
                ],
                parameters: {},
            },
            {
                name: 'applicationHostname',
                constraints: [],
                parameters: {
                    hostNames: 'myhostname.com',
                },
            },
            {
                name: 'flexibleRollout',
                constraints: [],
                parameters: {
                    groupId: 'killer',
                    rollout: '34',
                    stickiness: 'userId',
                },
            },
            {
                name: 'userWithId',
                constraints: [],
                parameters: {
                    userIds: 'uoea,ueoa',
                },
            },
            {
                name: 'remoteAddress',
                constraints: [],
                parameters: {
                    IPs: '196.6.6.05',
                },
            },
        ];
        const context = { appName: 'client-test' };
        const client = await (0, offline_unleash_client_1.offlineUnleashClient)({
            features: [
                {
                    strategies,
                    // impressionData: false,
                    enabled: true,
                    name: featureName,
                    project: 'default',
                    // description: '',
                    // project: 'heartman-for-test',
                    stale: false,
                    type: 'kill-switch',
                    variants: [
                        {
                            name: 'a',
                            weight: 334,
                            weightType: 'variable',
                            stickiness: 'default',
                            overrides: [],
                            payload: {
                                type: 'json',
                                value: '{"hello": "world"}',
                            },
                        },
                        {
                            name: 'b',
                            weight: 333,
                            weightType: 'variable',
                            stickiness: 'default',
                            overrides: [],
                            payload: {
                                type: 'string',
                                value: 'ueoau',
                            },
                        },
                        {
                            name: 'c',
                            weight: 333,
                            weightType: 'variable',
                            stickiness: 'default',
                            payload: {
                                type: 'csv',
                                value: '1,2,3',
                            },
                            overrides: [],
                        },
                    ],
                },
            ],
            context,
            logError: console.log,
        });
        const evaluatedStrategies = client
            .isEnabled(featureName, context)
            .strategies.map((strategy) => strategy.name);
        expect(evaluatedStrategies).toEqual(strategies.map((strategy) => strategy.name));
    });
});
//# sourceMappingURL=offline-unleash-client.test.js.map