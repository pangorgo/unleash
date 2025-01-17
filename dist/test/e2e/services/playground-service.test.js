"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabaseForPlaygroundTest = void 0;
const playground_service_1 = require("../../../lib/features/playground/playground-service");
const arbitraries_test_1 = require("../../arbitraries.test");
const sdk_context_schema_test_1 = require("../../../lib/openapi/spec/sdk-context-schema.test");
const fast_check_1 = __importDefault(require("fast-check"));
const test_config_1 = require("../../config/test-config");
const database_init_1 = __importDefault(require("../helpers/database-init"));
const feature_toggle_service_1 = __importDefault(require("../../../lib/services/feature-toggle-service"));
const segment_service_1 = require("../../../lib/services/segment-service");
const model_1 = require("../../../lib/types/model");
const offline_unleash_client_test_1 = require("../../../lib/features/playground/offline-unleash-client.test");
const playground_strategy_schema_1 = require("../../../lib/openapi/spec/playground-strategy-schema");
const group_service_1 = require("../../../lib/services/group-service");
const access_service_1 = require("../../../lib/services/access-service");
const sql_change_request_access_read_model_1 = require("../../../lib/features/change-request-access-service/sql-change-request-access-read-model");
let stores;
let db;
let service;
let featureToggleService;
let segmentService;
beforeAll(async () => {
    const config = (0, test_config_1.createTestConfig)();
    db = await (0, database_init_1.default)('playground_service_serial', config.getLogger);
    stores = db.stores;
    const groupService = new group_service_1.GroupService(stores, config);
    const accessService = new access_service_1.AccessService(stores, config, groupService);
    const changeRequestAccessReadModel = new sql_change_request_access_read_model_1.ChangeRequestAccessReadModel(db.rawDatabase, accessService);
    segmentService = new segment_service_1.SegmentService(stores, changeRequestAccessReadModel, config);
    featureToggleService = new feature_toggle_service_1.default(stores, config, segmentService, accessService, changeRequestAccessReadModel);
    service = new playground_service_1.PlaygroundService(config, {
        featureToggleServiceV2: featureToggleService,
        segmentService,
    });
});
afterAll(async () => {
    await db.destroy();
});
const cleanup = async () => {
    await stores.segmentStore.deleteAll();
    await stores.featureToggleStore.deleteAll();
    await stores.eventStore.deleteAll();
    await stores.featureStrategiesStore.deleteAll();
    await stores.segmentStore.deleteAll();
};
afterEach(cleanup);
const testParams = {
    interruptAfterTimeLimit: 4000,
    markInterruptAsFailure: false, // When set to false, timeout during initial cases will not be considered as a failure
};
const mapSegmentSchemaToISegment = (segment, index) => ({
    ...segment,
    name: segment.name || `test-segment ${index ?? 'unnumbered'}`,
    createdAt: new Date(),
});
const seedDatabaseForPlaygroundTest = async (database, features, environment, segments) => {
    if (segments) {
        await Promise.all(segments.map(async (segment, index) => database.stores.segmentStore.create(mapSegmentSchemaToISegment(segment, index), { username: 'test' })));
    }
    return Promise.all(features.map(async (feature) => {
        // create environment if necessary
        await database.stores.environmentStore
            .create({
            name: environment,
            type: 'development',
            enabled: true,
        })
            .catch(() => {
            // purposefully left empty: env creation may fail if the
            // env already exists, and because of the async nature
            // of things, this is the easiest way to make it work.
        });
        // create feature
        const toggle = await database.stores.featureToggleStore.create(feature.project, {
            ...feature,
            createdAt: undefined,
            variants: null,
        });
        // enable/disable the feature in environment
        await database.stores.featureEnvironmentStore.addEnvironmentToFeature(feature.name, environment, feature.enabled);
        await database.stores.featureToggleStore.saveVariants(feature.project, feature.name, [
            ...(feature.variants ?? []).map((variant) => ({
                ...variant,
                weightType: model_1.WeightType.VARIABLE,
                stickiness: 'default',
            })),
        ]);
        // assign strategies
        await Promise.all((feature.strategies || []).map(async ({ segments: strategySegments, ...strategy }) => {
            await database.stores.featureStrategiesStore.createStrategyFeatureEnv({
                parameters: {},
                constraints: [],
                ...strategy,
                featureName: feature.name,
                environment,
                strategyName: strategy.name,
                projectId: feature.project,
            });
            if (strategySegments) {
                await Promise.all(strategySegments.map((segmentId) => database.stores.segmentStore.addToStrategy(segmentId, strategy.id)));
            }
        }));
        return toggle;
    }));
};
exports.seedDatabaseForPlaygroundTest = seedDatabaseForPlaygroundTest;
describe('the playground service (e2e)', () => {
    const isDisabledVariant = ({ name, enabled, }) => name === 'disabled' && !enabled;
    const insertAndEvaluateFeatures = async ({ features, context, env = 'default', segments, }) => {
        await (0, exports.seedDatabaseForPlaygroundTest)(db, features, env, segments);
        //     const activeSegments = await db.stores.segmentStore.getAllFeatureStrategySegments()
        // console.log("active segments db seeding", activeSegments)
        const projects = '*';
        const serviceFeatures = await service.evaluateQuery(projects, env, context);
        return serviceFeatures;
    };
    test('should return the same enabled toggles as the raw SDK correctly mapped', async () => {
        await fast_check_1.default.assert(fast_check_1.default
            .asyncProperty((0, arbitraries_test_1.clientFeaturesAndSegments)({ minLength: 1 }), fast_check_1.default
            .tuple((0, sdk_context_schema_test_1.generate)(), (0, arbitraries_test_1.commonISOTimestamp)())
            .map(([context, currentTime]) => ({
            ...context,
            userId: 'constant',
            sessionId: 'constant2',
            currentTime,
        })), fast_check_1.default.context(), async ({ segments, features }, context, ctx) => {
            const serviceToggles = await insertAndEvaluateFeatures({
                features: features,
                context,
                segments,
            });
            const [head, ...rest] = await featureToggleService.getClientFeatures();
            if (!head) {
                return serviceToggles.length === 0;
            }
            const client = await (0, offline_unleash_client_test_1.offlineUnleashClientNode)({
                features: [head, ...rest],
                context,
                logError: console.log,
                segments: segments.map(mapSegmentSchemaToISegment),
            });
            const clientContext = {
                ...context,
                currentTime: context.currentTime
                    ? new Date(context.currentTime)
                    : undefined,
            };
            return serviceToggles.every((feature) => {
                ctx.log(`Examining feature ${feature.name}: ${JSON.stringify(feature)}`);
                // the playground differs from a normal SDK in that
                // it _must_ evaluate all strategies and features
                // regardless of whether they're supposed to be
                // enabled in the current environment or not.
                const expectedSDKState = feature.isEnabled;
                const enabledStateMatches = expectedSDKState ===
                    client.isEnabled(feature.name, clientContext);
                ctx.log(`feature.isEnabled, feature.isEnabledInCurrentEnvironment, presumedSDKState: ${feature.isEnabled}, ${feature.isEnabledInCurrentEnvironment}, ${expectedSDKState}`);
                ctx.log(`client.isEnabled: ${client.isEnabled(feature.name, clientContext)}`);
                expect(enabledStateMatches).toBe(true);
                // if x is disabled, then the variant will be the
                // disabled variant.
                if (!feature.isEnabled) {
                    ctx.log(`${feature.name} is not enabled`);
                    ctx.log(JSON.stringify(feature.variant));
                    ctx.log(JSON.stringify(enabledStateMatches));
                    ctx.log(JSON.stringify(feature.variant.name === 'disabled'));
                    ctx.log(JSON.stringify(feature.variant.enabled === false));
                    return (enabledStateMatches &&
                        isDisabledVariant(feature.variant));
                }
                ctx.log('feature is enabled');
                const clientVariant = client.getVariant(feature.name, clientContext);
                // if x is enabled, but its variant is the disabled
                // variant, then the source does not have any
                // variants
                if (isDisabledVariant(feature.variant)) {
                    return (enabledStateMatches &&
                        isDisabledVariant(clientVariant));
                }
                ctx.log(`feature "${feature.name}" has a variant`);
                ctx.log(`Feature variant: ${JSON.stringify(feature.variant)}`);
                ctx.log(`Client variant: ${JSON.stringify(clientVariant)}`);
                ctx.log(`enabledStateMatches: ${enabledStateMatches}`);
                // variants should be the same if the
                // toggle is enabled in both versions. If
                // they're not and one of them has a
                // variant, then they should be different.
                if (expectedSDKState === true) {
                    expect(feature.variant).toEqual(clientVariant);
                }
                else {
                    expect(feature.variant).not.toEqual(clientVariant);
                }
                return enabledStateMatches;
            });
        })
            .afterEach(cleanup), { ...testParams, examples: [] });
    });
    // counterexamples found by fastcheck
    const counterexamples = [
        [
            [
                {
                    name: '-',
                    type: 'release',
                    project: 'A',
                    enabled: true,
                    lastSeenAt: '1970-01-01T00:00:00.000Z',
                    impressionData: null,
                    strategies: [],
                    variants: [
                        {
                            name: '-',
                            weight: 147,
                            weightType: 'variable',
                            stickiness: 'default',
                            payload: { type: 'string', value: '' },
                        },
                        {
                            name: '~3dignissim~gravidaod',
                            weight: 301,
                            weightType: 'variable',
                            stickiness: 'default',
                            payload: {
                                type: 'json',
                                value: '{"Sv7gRNNl=":[true,"Mfs >mp.D","O-jtK","y%i\\"Ub~",null,"J",false,"(\'R"],"F0g+>1X":3.892913121148499e-188,"Fi~k(":-4.882970135331098e+146,"":null,"nPT]":true}',
                            },
                        },
                    ],
                },
            ],
            {
                appName: '"$#',
                currentTime: '9999-12-31T23:59:59.956Z',
                environment: 'r',
            },
            {
                logs: [
                    'feature is enabled',
                    'feature has a variant',
                    '{"name":"-","payload":{"type":"string","value":""},"enabled":true}',
                    '{"name":"~3dignissim~gravidaod","payload":{"type":"json","value":"{\\"Sv7gRNNl=\\":[true,\\"Mfs >mp.D\\",\\"O-jtK\\",\\"y%i\\\\\\"Ub~\\",null,\\"J\\",false,\\"(\'R\\"],\\"F0g+>1X\\":3.892913121148499e-188,\\"Fi~k(\\":-4.882970135331098e+146,\\"\\":null,\\"nPT]\\":true}"},"enabled":true}',
                    'true',
                    'false',
                ],
            },
        ],
        [
            [
                {
                    name: '-',
                    project: '0',
                    enabled: true,
                    strategies: [
                        {
                            name: 'default',
                            constraints: [
                                {
                                    contextName: 'A',
                                    operator: 'NOT_IN',
                                    caseInsensitive: false,
                                    inverted: false,
                                    values: [],
                                    value: '',
                                },
                            ],
                        },
                    ],
                },
            ],
            { appName: ' ', userId: 'constant', sessionId: 'constant2' },
            { logs: [] },
        ],
        [
            [
                {
                    name: 'a',
                    project: 'a',
                    enabled: true,
                    strategies: [
                        {
                            name: 'default',
                            constraints: [
                                {
                                    contextName: '0',
                                    operator: 'NOT_IN',
                                    caseInsensitive: false,
                                    inverted: false,
                                    values: [],
                                    value: '',
                                },
                            ],
                        },
                    ],
                },
                {
                    name: '-',
                    project: 'elementum',
                    enabled: false,
                    strategies: [],
                },
            ],
            { appName: ' ', userId: 'constant', sessionId: 'constant2' },
            {
                logs: [
                    'feature is not enabled',
                    '{"name":"disabled","enabled":false}',
                ],
            },
        ],
        [
            [
                {
                    name: '0',
                    project: '-',
                    enabled: true,
                    strategies: [
                        {
                            name: 'default',
                            constraints: [
                                {
                                    contextName: 'sed',
                                    operator: 'NOT_IN',
                                    caseInsensitive: false,
                                    inverted: false,
                                    values: [],
                                    value: '',
                                },
                            ],
                        },
                    ],
                },
            ],
            { appName: ' ', userId: 'constant', sessionId: 'constant2' },
            {
                logs: [
                    '0 is not enabled',
                    '{"name":"disabled","enabled":false}',
                    'true',
                    'true',
                ],
            },
        ],
        [
            [
                {
                    name: '0',
                    project: 'ac',
                    enabled: true,
                    strategies: [
                        {
                            name: 'default',
                            constraints: [
                                {
                                    contextName: '0',
                                    operator: 'NOT_IN',
                                    caseInsensitive: false,
                                    inverted: false,
                                    values: [],
                                    value: '',
                                },
                            ],
                        },
                    ],
                },
            ],
            { appName: ' ', userId: 'constant', sessionId: 'constant2' },
            {
                logs: [
                    'feature.isEnabled: false',
                    'client.isEnabled: true',
                    '0 is not enabled',
                    '{"name":"disabled","enabled":false}',
                    'false',
                    'true',
                    'true',
                ],
            },
        ],
        [
            [
                {
                    name: '0',
                    project: 'aliquam',
                    enabled: true,
                    strategies: [
                        {
                            name: 'default',
                            constraints: [
                                {
                                    contextName: '-',
                                    operator: 'NOT_IN',
                                    caseInsensitive: false,
                                    inverted: false,
                                    values: [],
                                    value: '',
                                },
                            ],
                        },
                    ],
                },
                {
                    name: '-',
                    project: '-',
                    enabled: false,
                    strategies: [],
                },
            ],
            {
                appName: ' ',
                userId: 'constant',
                sessionId: 'constant2',
                currentTime: '1970-01-01T00:00:00.000Z',
            },
            {
                logs: [
                    'feature.isEnabled: false',
                    'client.isEnabled: true',
                    '0 is not enabled',
                    '{"name":"disabled","enabled":false}',
                    'false',
                    'true',
                    'true',
                ],
            },
        ],
    ];
    // these tests test counterexamples found by fast check. The may seem redundant, but are concrete cases that might break.
    counterexamples.map(async ([features, context], i) => {
        it(`should do the same as the raw SDK: counterexample ${i}`, async () => {
            const serviceFeatures = await insertAndEvaluateFeatures({
                // @ts-expect-error
                features,
                // @ts-expect-error
                context,
            });
            const [head, ...rest] = await featureToggleService.getClientFeatures();
            if (!head) {
                return serviceFeatures.length === 0;
            }
            const client = await (0, offline_unleash_client_test_1.offlineUnleashClientNode)({
                features: [head, ...rest],
                // @ts-expect-error
                context,
                logError: console.log,
            });
            const clientContext = {
                ...context,
                // @ts-expect-error
                currentTime: context.currentTime
                    ? // @ts-expect-error
                        new Date(context.currentTime)
                    : undefined,
            };
            serviceFeatures.forEach((feature) => {
                expect(feature.isEnabled).toEqual(
                //@ts-expect-error
                client.isEnabled(feature.name, clientContext));
            });
        });
    });
    test("should return all of a feature's strategies", async () => {
        await fast_check_1.default.assert(fast_check_1.default
            .asyncProperty((0, arbitraries_test_1.clientFeaturesAndSegments)({ minLength: 1 }), (0, sdk_context_schema_test_1.generate)(), fast_check_1.default.context(), async (data, context, ctx) => {
            const log = (x) => ctx.log(JSON.stringify(x));
            const serviceFeatures = await insertAndEvaluateFeatures({
                ...data,
                context,
            });
            const serviceFeaturesDict = serviceFeatures.reduce((acc, feature) => ({
                ...acc,
                [feature.name]: feature,
            }), {});
            // for each feature, find the corresponding evaluated feature
            // and make sure that the evaluated
            // return genFeat.length === servFeat.length && zip(gen, serv).
            data.features.forEach((feature) => {
                const mappedFeature = serviceFeaturesDict[feature.name];
                // log(feature);
                log(mappedFeature);
                const featureStrategies = feature.strategies ?? [];
                expect(mappedFeature.strategies.data.length).toEqual(featureStrategies.length);
                // we can't guarantee that the order we inserted
                // strategies into the database is the same as it
                // was returned by the service , so we'll need to
                // scan through the list of strats.
                // extract the `result` property, because it
                // doesn't exist in the input
                const removeResult = ({ result, ...rest }) => rest;
                const cleanedReceivedStrategies = mappedFeature.strategies.data.map((strategy) => {
                    const { segments: mappedSegments, ...mappedStrategy } = removeResult(strategy);
                    return {
                        ...mappedStrategy,
                        constraints: mappedStrategy.constraints?.map(removeResult),
                    };
                });
                feature.strategies.forEach(({ segments, ...strategy }) => {
                    expect(cleanedReceivedStrategies).toEqual(expect.arrayContaining([
                        {
                            ...strategy,
                            title: undefined,
                            disabled: false,
                            constraints: strategy.constraints ?? [],
                            parameters: strategy.parameters ?? {},
                        },
                    ]));
                });
            });
        })
            .afterEach(cleanup), testParams);
    });
    test('should return feature strategies with all their segments', async () => {
        await fast_check_1.default.assert(fast_check_1.default
            .asyncProperty((0, arbitraries_test_1.clientFeaturesAndSegments)({ minLength: 1 }), (0, sdk_context_schema_test_1.generate)(), async ({ segments, features: generatedFeatures }, context) => {
            const serviceFeatures = await insertAndEvaluateFeatures({
                features: generatedFeatures,
                context,
                segments,
            });
            const serviceFeaturesDict = serviceFeatures.reduce((acc, feature) => ({
                ...acc,
                [feature.name]: feature,
            }), {});
            // ensure that segments are mapped on to features
            // correctly. We do not need to check whether the
            // evaluation is correct; that is taken care of by other
            // tests.
            // For each feature strategy, find its list of segments and
            // compare it to the input.
            //
            // We can assert three things:
            //
            // 1. The segments lists have the same length
            //
            // 2. All segment ids listed in an input id list are
            // also in the original segments list
            //
            // 3. If a feature is considered enabled, _all_ segments
            // must be true. If a feature is _disabled_, _at least_
            // one segment is not true.
            generatedFeatures.forEach((unmappedFeature) => {
                const strategies = serviceFeaturesDict[unmappedFeature.name].strategies.data.reduce((acc, strategy) => ({
                    ...acc,
                    [strategy.id]: strategy,
                }), {});
                unmappedFeature.strategies?.forEach((unmappedStrategy) => {
                    const mappedStrategySegments = strategies[unmappedStrategy.id]
                        .segments;
                    const unmappedSegments = unmappedStrategy.segments ?? [];
                    // 1. The segments lists have the same length
                    // 2. All segment ids listed in the input exist:
                    expect([
                        ...mappedStrategySegments?.map((segment) => segment.id),
                    ].sort()).toEqual([...unmappedSegments].sort());
                    switch (strategies[unmappedStrategy.id].result) {
                        case true:
                            // If a strategy is considered true, _all_ segments
                            // must be true.
                            expect(mappedStrategySegments.every((segment) => segment.result === true)).toBeTruthy();
                        case false:
                        // empty -- all segments can be true and
                        // the toggle still not enabled. We
                        // can't check for anything here.
                        case 'not found':
                        // empty -- we can't evaluate this
                    }
                });
            });
        })
            .afterEach(cleanup), testParams);
    });
    test("should evaluate a strategy to be unknown if it doesn't recognize the strategy and all constraints pass", async () => {
        await fast_check_1.default.assert(fast_check_1.default
            .asyncProperty((0, arbitraries_test_1.clientFeaturesAndSegments)({ minLength: 1 }).map(({ features, ...rest }) => ({
            ...rest,
            features: features.map((feature) => ({
                ...feature,
                // remove any constraints and use a name that doesn't exist
                strategies: feature.strategies.map((strategy) => ({
                    ...strategy,
                    name: 'bogus-strategy',
                    constraints: [],
                    segments: [],
                })),
            })),
        })), (0, sdk_context_schema_test_1.generate)(), fast_check_1.default.context(), async (featsAndSegments, context, ctx) => {
            const serviceFeatures = await insertAndEvaluateFeatures({
                ...featsAndSegments,
                context,
            });
            serviceFeatures.forEach((feature) => feature.strategies.data.forEach((strategy) => {
                expect(strategy.result.evaluationStatus).toBe(playground_strategy_schema_1.playgroundStrategyEvaluation.evaluationIncomplete);
                expect(strategy.result.enabled).toBe(playground_strategy_schema_1.playgroundStrategyEvaluation.unknownResult);
            }));
            ctx.log(JSON.stringify(serviceFeatures));
            serviceFeatures.forEach((feature) => {
                // if there are strategies and they're all
                // incomplete and unknown, then the feature can't be
                // evaluated fully
                if (feature.strategies.data.length) {
                    expect(feature.isEnabled).toBe(false);
                }
            });
        })
            .afterEach(cleanup), testParams);
    });
    test("should evaluate a strategy as false if it doesn't recognize the strategy and constraint checks fail", async () => {
        await fast_check_1.default.assert(fast_check_1.default
            .asyncProperty(fast_check_1.default
            .tuple(fast_check_1.default.uuid(), (0, arbitraries_test_1.clientFeaturesAndSegments)({ minLength: 1 }))
            .map(([uuid, { features, ...rest }]) => ({
            ...rest,
            features: features.map((feature) => ({
                ...feature,
                // use a constraint that will never be true
                strategies: feature.strategies.map((strategy) => ({
                    ...strategy,
                    name: 'bogusStrategy',
                    constraints: [
                        {
                            contextName: 'appName',
                            operator: 'IN',
                            values: [uuid],
                        },
                    ],
                })),
            })),
        })), (0, sdk_context_schema_test_1.generate)(), fast_check_1.default.context(), async (featsAndSegments, context, ctx) => {
            const serviceFeatures = await insertAndEvaluateFeatures({
                ...featsAndSegments,
                context,
            });
            serviceFeatures.forEach((feature) => feature.strategies.data.forEach((strategy) => {
                expect(strategy.result.evaluationStatus).toBe(playground_strategy_schema_1.playgroundStrategyEvaluation.evaluationIncomplete);
                expect(strategy.result.enabled).toBe(false);
            }));
            ctx.log(JSON.stringify(serviceFeatures));
            serviceFeatures.forEach((feature) => {
                if (feature.strategies.data.length) {
                    // if there are strategies and they're all
                    // incomplete and false, then the feature
                    // is also false
                    expect(feature.isEnabled).toEqual(false);
                }
            });
        })
            .afterEach(cleanup), testParams);
    });
    test('should evaluate a feature as unknown if there is at least one incomplete strategy among all failed strategies', async () => {
        await fast_check_1.default.assert(fast_check_1.default
            .asyncProperty(fast_check_1.default
            .tuple(fast_check_1.default.uuid(), (0, arbitraries_test_1.clientFeaturesAndSegments)({ minLength: 1 }))
            .map(([uuid, { features, ...rest }]) => ({
            ...rest,
            features: features.map((feature) => ({
                ...feature,
                // use a constraint that will never be true
                strategies: [
                    ...feature.strategies.map((strategy) => ({
                        ...strategy,
                        constraints: [
                            {
                                contextName: 'appName',
                                operator: 'IN',
                                values: [uuid],
                            },
                        ],
                    })),
                    { name: 'my-custom-strategy' },
                ],
            })),
        })), (0, sdk_context_schema_test_1.generate)(), async (featsAndSegments, context) => {
            const serviceFeatures = await insertAndEvaluateFeatures({
                ...featsAndSegments,
                context,
            });
            serviceFeatures.forEach((feature) => {
                if (feature.strategies.data.length) {
                    // if there are strategies and they're
                    // all incomplete and unknown, then
                    // the feature is also unknown and
                    // thus 'false' (from an SDK point of
                    // view)
                    expect(feature.isEnabled).toEqual(false);
                }
            });
        })
            .afterEach(cleanup), testParams);
    });
    test("features can't be evaluated to true if they're not enabled in the current environment", async () => {
        await fast_check_1.default.assert(fast_check_1.default
            .asyncProperty((0, arbitraries_test_1.clientFeaturesAndSegments)({ minLength: 1 }).map(({ features, ...rest }) => ({
            ...rest,
            features: features.map((feature) => ({
                ...feature,
                enabled: false,
                // remove any constraints and use a name that doesn't exist
                strategies: [{ name: 'default' }],
            })),
        })), (0, sdk_context_schema_test_1.generate)(), fast_check_1.default.context(), async (featsAndSegments, context, ctx) => {
            const serviceFeatures = await insertAndEvaluateFeatures({
                ...featsAndSegments,
                context,
            });
            serviceFeatures.forEach((feature) => feature.strategies.data.forEach((strategy) => {
                expect(strategy.result.evaluationStatus).toBe(playground_strategy_schema_1.playgroundStrategyEvaluation.evaluationComplete);
                expect(strategy.result.enabled).toBe(true);
            }));
            ctx.log(JSON.stringify(serviceFeatures));
            serviceFeatures.forEach((feature) => {
                expect(feature.isEnabled).toBe(false);
                expect(feature.isEnabledInCurrentEnvironment).toBe(false);
            });
        })
            .afterEach(cleanup), testParams);
    });
    test('output toggles should have the same variants as input toggles', async () => {
        await fast_check_1.default.assert(fast_check_1.default
            .asyncProperty((0, arbitraries_test_1.clientFeaturesAndSegments)({ minLength: 1 }), (0, sdk_context_schema_test_1.generate)(), async ({ features, segments }, context) => {
            const serviceFeatures = await insertAndEvaluateFeatures({
                features,
                segments,
                context,
            });
            const variantsMap = features.reduce((acc, feature) => ({
                ...acc,
                [feature.name]: feature.variants,
            }), {});
            serviceFeatures.forEach((feature) => {
                if (variantsMap[feature.name]) {
                    expect(feature.variants).toEqual(expect.arrayContaining(variantsMap[feature.name]));
                    expect(variantsMap[feature.name]).toEqual(expect.arrayContaining(feature.variants));
                }
                else {
                    expect(feature.variants).toStrictEqual([]);
                }
            });
        })
            .afterEach(cleanup), testParams);
    });
    test('isEnabled matches strategies.results', async () => {
        await fast_check_1.default.assert(fast_check_1.default
            .asyncProperty((0, arbitraries_test_1.clientFeaturesAndSegments)({ minLength: 1 }), (0, sdk_context_schema_test_1.generate)(), async ({ features, segments }, context) => {
            const serviceFeatures = await insertAndEvaluateFeatures({
                features,
                segments,
                context,
            });
            serviceFeatures.forEach((feature) => {
                if (feature.isEnabled) {
                    expect(feature.isEnabledInCurrentEnvironment).toBe(true);
                    expect(feature.strategies.result).toBe(true);
                }
                else {
                    expect(!feature.isEnabledInCurrentEnvironment ||
                        feature.strategies.result !== true).toBe(true);
                }
            });
        })
            .afterEach(cleanup), testParams);
    });
    test('strategies.results matches the individual strategy results', async () => {
        await fast_check_1.default.assert(fast_check_1.default
            .asyncProperty((0, arbitraries_test_1.clientFeaturesAndSegments)({ minLength: 1 }), (0, sdk_context_schema_test_1.generate)(), async ({ features, segments }, context) => {
            const serviceFeatures = await insertAndEvaluateFeatures({
                features,
                segments,
                context,
            });
            serviceFeatures.forEach(({ strategies }) => {
                if (strategies.result === false) {
                    expect(strategies.data.every((strategy) => strategy.result.enabled === false)).toBe(true);
                }
                else if (strategies.result ===
                    playground_strategy_schema_1.playgroundStrategyEvaluation.unknownResult) {
                    expect(strategies.data.some((strategy) => strategy.result.enabled ===
                        playground_strategy_schema_1.playgroundStrategyEvaluation.unknownResult)).toBe(true);
                    expect(strategies.data.every((strategy) => strategy.result.enabled !== true)).toBe(true);
                }
                else {
                    if (strategies.data.length > 0) {
                        expect(strategies.data.some((strategy) => strategy.result.enabled ===
                            true)).toBe(true);
                    }
                }
            });
        })
            .afterEach(cleanup), testParams);
    });
    test('unevaluated features should not have variants', async () => {
        await fast_check_1.default.assert(fast_check_1.default
            .asyncProperty((0, arbitraries_test_1.clientFeaturesAndSegments)({ minLength: 1 }), (0, sdk_context_schema_test_1.generate)(), async ({ features, segments }, context) => {
            const serviceFeatures = await insertAndEvaluateFeatures({
                features,
                segments,
                context,
            });
            serviceFeatures.forEach((feature) => {
                if (feature.strategies.result ===
                    playground_strategy_schema_1.playgroundStrategyEvaluation.unknownResult) {
                    expect(feature.variant).toEqual({
                        name: 'disabled',
                        enabled: false,
                    });
                }
            });
        })
            .afterEach(cleanup), testParams);
    });
});
//# sourceMappingURL=playground-service.test.js.map