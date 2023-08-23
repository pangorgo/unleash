"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const feature_event_formatter_md_1 = require("./feature-event-formatter-md");
const util_1 = require("../util");
const testCases = [
    [
        'when groupId changed',
        {
            id: 920,
            type: types_1.FEATURE_STRATEGY_UPDATE,
            createdBy: 'user@company.com',
            createdAt: new Date('2022-06-01T10:03:11.549Z'),
            data: {
                id: '3f4bf713-696c-43a4-8ce7-d6c607108858',
                name: 'flexibleRollout',
                constraints: [],
                parameters: {
                    groupId: 'different-feature',
                    rollout: '32',
                    stickiness: 'default',
                },
            },
            preData: {
                id: '3f4bf713-696c-43a4-8ce7-d6c607108858',
                name: 'flexibleRollout',
                parameters: {
                    groupId: 'new-feature',
                    rollout: '32',
                    stickiness: 'default',
                },
                constraints: [],
            },
            tags: [],
            featureName: 'new-feature',
            project: 'my-other-project',
            environment: 'production',
        },
        'user@company.com updated *[new-feature](unleashUrl/projects/my-other-project/features/new-feature)* in project *my-other-project* by updating strategy flexibleRollout in *production* groupId from new-feature to different-feature',
    ],
    [
        'when rollout percentage changed',
        {
            id: 920,
            type: types_1.FEATURE_STRATEGY_UPDATE,
            createdBy: 'user@company.com',
            createdAt: new Date('2022-06-01T10:03:11.549Z'),
            data: {
                id: '3f4bf713-696c-43a4-8ce7-d6c607108858',
                name: 'flexibleRollout',
                constraints: [],
                parameters: {
                    groupId: 'new-feature',
                    rollout: '32',
                    stickiness: 'default',
                },
            },
            preData: {
                id: '3f4bf713-696c-43a4-8ce7-d6c607108858',
                name: 'flexibleRollout',
                parameters: {
                    groupId: 'new-feature',
                    rollout: '67',
                    stickiness: 'default',
                },
                constraints: [],
            },
            tags: [],
            featureName: 'new-feature',
            project: 'my-other-project',
            environment: 'production',
        },
        'user@company.com updated *[new-feature](unleashUrl/projects/my-other-project/features/new-feature)* in project *my-other-project* by updating strategy flexibleRollout in *production* rollout from 67% to 32%',
    ],
    [
        'when stickiness changed',
        {
            id: 920,
            type: types_1.FEATURE_STRATEGY_UPDATE,
            createdBy: 'user@company.com',
            createdAt: new Date('2022-06-01T10:03:11.549Z'),
            data: {
                id: '3f4bf713-696c-43a4-8ce7-d6c607108858',
                name: 'flexibleRollout',
                constraints: [],
                parameters: {
                    groupId: 'new-feature',
                    rollout: '67',
                    stickiness: 'random',
                },
            },
            preData: {
                id: '3f4bf713-696c-43a4-8ce7-d6c607108858',
                name: 'flexibleRollout',
                parameters: {
                    groupId: 'new-feature',
                    rollout: '67',
                    stickiness: 'default',
                },
                constraints: [],
            },
            tags: [],
            featureName: 'new-feature',
            project: 'my-other-project',
            environment: 'production',
        },
        'user@company.com updated *[new-feature](unleashUrl/projects/my-other-project/features/new-feature)* in project *my-other-project* by updating strategy flexibleRollout in *production* stickiness from default to random',
    ],
    [
        'when constraints and rollout percentage and stickiness changed',
        {
            id: 920,
            type: types_1.FEATURE_STRATEGY_UPDATE,
            createdBy: 'user@company.com',
            createdAt: new Date('2022-06-01T10:03:11.549Z'),
            data: {
                id: '3f4bf713-696c-43a4-8ce7-d6c607108858',
                name: 'flexibleRollout',
                constraints: [
                    {
                        values: ['x', 'y'],
                        inverted: false,
                        operator: util_1.IN,
                        contextName: 'appName',
                        caseInsensitive: false,
                    },
                ],
                parameters: {
                    groupId: 'new-feature',
                    rollout: '32',
                    stickiness: 'random',
                },
            },
            preData: {
                id: '3f4bf713-696c-43a4-8ce7-d6c607108858',
                name: 'flexibleRollout',
                parameters: {
                    groupId: 'new-feature',
                    rollout: '67',
                    stickiness: 'default',
                },
                constraints: [],
            },
            tags: [],
            featureName: 'new-feature',
            project: 'my-other-project',
            environment: 'production',
        },
        'user@company.com updated *[new-feature](unleashUrl/projects/my-other-project/features/new-feature)* in project *my-other-project* by updating strategy flexibleRollout in *production* stickiness from default to random; rollout from 67% to 32%; constraints from empty set of constraints to [appName is one of (x,y)]',
    ],
    [
        'when neither rollout percentage nor stickiness changed',
        {
            id: 920,
            type: types_1.FEATURE_STRATEGY_UPDATE,
            createdBy: 'user@company.com',
            createdAt: new Date('2022-06-01T10:03:11.549Z'),
            data: {
                id: '3f4bf713-696c-43a4-8ce7-d6c607108858',
                name: 'flexibleRollout',
                constraints: [],
                parameters: {
                    groupId: 'new-feature',
                    rollout: '67',
                    stickiness: 'default',
                },
            },
            preData: {
                id: '3f4bf713-696c-43a4-8ce7-d6c607108858',
                name: 'flexibleRollout',
                parameters: {
                    groupId: 'new-feature',
                    rollout: '67',
                    stickiness: 'default',
                },
                constraints: [],
            },
            tags: [],
            featureName: 'new-feature',
            project: 'my-other-project',
            environment: 'production',
        },
        'user@company.com updated *[new-feature](unleashUrl/projects/my-other-project/features/new-feature)* in project *my-other-project* by updating strategy flexibleRollout in *production*',
    ],
    [
        'when strategy added',
        {
            id: 919,
            type: types_1.FEATURE_STRATEGY_ADD,
            createdBy: 'user@company.com',
            createdAt: new Date('2022-06-01T10:03:08.290Z'),
            data: {
                id: '3f4bf713-696c-43a4-8ce7-d6c607108858',
                name: 'flexibleRollout',
                constraints: [],
                parameters: {
                    groupId: 'new-feature',
                    rollout: '67',
                    stickiness: 'default',
                },
            },
            preData: null,
            tags: [],
            featureName: 'new-feature',
            project: 'my-other-project',
            environment: 'production',
        },
        'user@company.com updated *[new-feature](unleashUrl/projects/my-other-project/features/new-feature)* in project *my-other-project* by adding strategy flexibleRollout in *production*',
    ],
    [
        'when strategy removed',
        {
            id: 918,
            type: types_1.FEATURE_STRATEGY_REMOVE,
            createdBy: 'user@company.com',
            createdAt: new Date('2022-06-01T10:03:00.229Z'),
            data: null,
            preData: {
                id: '9591090e-acb0-4088-8958-21faaeb7147d',
                name: 'default',
                parameters: {},
                constraints: [],
            },
            tags: [],
            featureName: 'new-feature',
            project: 'my-other-project',
            environment: 'production',
        },
        'user@company.com updated *[new-feature](unleashUrl/projects/my-other-project/features/new-feature)* in project *my-other-project* by removing strategy default in *production*',
    ],
    ...[
        [util_1.IN, 'is one of'],
        [util_1.NOT_IN, 'is not one of'],
        [util_1.STR_CONTAINS, 'is a string that contains'],
        [util_1.STR_STARTS_WITH, 'is a string that starts with'],
        [util_1.STR_ENDS_WITH, 'is a string that ends with'],
    ].map(([operator, display]) => [
        'when default strategy updated',
        {
            id: 39,
            type: types_1.FEATURE_STRATEGY_UPDATE,
            createdBy: 'admin',
            createdAt: new Date('2023-02-20T20:23:28.791Z'),
            data: {
                id: 'f2d34aac-52ec-49d2-82d3-08d710e89eaa',
                name: 'default',
                constraints: [
                    {
                        values: ['x', 'y'],
                        inverted: false,
                        operator: operator,
                        contextName: 'appName',
                        caseInsensitive: false,
                    },
                    {
                        values: ['x'],
                        inverted: true,
                        operator: operator,
                        contextName: 'appName',
                        caseInsensitive: false,
                    },
                ],
                parameters: {},
                segments: [],
            },
            preData: {
                id: 'f2d34aac-52ec-49d2-82d3-08d710e89eaa',
                name: 'default',
                segments: [],
                parameters: {},
                constraints: [],
            },
            tags: [],
            featureName: 'aaa',
            project: 'default',
            environment: 'production',
        },
        `admin updated *[aaa](unleashUrl/projects/default/features/aaa)* in project *default* by updating strategy default in *production* constraints from empty set of constraints to [appName ${display} (x,y), appName not ${display} (x)]`,
    ]),
    ...[
        [util_1.NUM_EQ, 'is a number equal to'],
        [util_1.NUM_GT, 'is a number greater than'],
        [util_1.NUM_GTE, 'is a number greater than or equal to'],
        [util_1.NUM_LT, 'is a number less than'],
        [util_1.NUM_LTE, 'is a number less than or equal to'],
        [util_1.DATE_BEFORE, 'is a date before'],
        [util_1.DATE_AFTER, 'is a date after'],
        [util_1.SEMVER_EQ, 'is a SemVer equal to'],
        [util_1.SEMVER_GT, 'is a SemVer greater than'],
        [util_1.SEMVER_LT, 'is a SemVer less than'],
    ].map(([operator, display]) => [
        'when default strategy updated with numeric constraint ' +
            operator,
        {
            id: 39,
            type: types_1.FEATURE_STRATEGY_UPDATE,
            createdBy: 'admin',
            createdAt: new Date('2023-02-20T20:23:28.791Z'),
            data: {
                id: 'f2d34aac-52ec-49d2-82d3-08d710e89eaa',
                name: 'default',
                constraints: [],
                parameters: {},
                segments: [],
            },
            preData: {
                id: 'f2d34aac-52ec-49d2-82d3-08d710e89eaa',
                name: 'default',
                segments: [],
                parameters: {},
                constraints: [
                    {
                        value: '4',
                        values: [],
                        inverted: false,
                        operator: operator,
                        contextName: 'appName',
                        caseInsensitive: false,
                    },
                ],
            },
            tags: [],
            featureName: 'aaa',
            project: 'default',
            environment: 'production',
        },
        `admin updated *[aaa](unleashUrl/projects/default/features/aaa)* in project *default* by updating strategy default in *production* constraints from [appName ${display} 4] to empty set of constraints`,
    ]),
    [
        'when userIds changed',
        {
            id: 920,
            type: types_1.FEATURE_STRATEGY_UPDATE,
            createdBy: 'user@company.com',
            createdAt: new Date('2022-06-01T10:03:11.549Z'),
            data: {
                name: 'userWithId',
                constraints: [
                    {
                        values: ['x', 'y'],
                        inverted: false,
                        operator: util_1.IN,
                        contextName: 'appName',
                        caseInsensitive: false,
                    },
                ],
                parameters: {
                    userIds: 'a,b',
                },
                sortOrder: 9999,
                id: '9a995d94-5944-4897-a82f-0f7e65c2fb3f',
            },
            preData: {
                name: 'userWithId',
                constraints: [],
                parameters: {
                    userIds: '',
                },
                sortOrder: 9999,
                id: '9a995d94-5944-4897-a82f-0f7e65c2fb3f',
            },
            tags: [],
            featureName: 'new-feature',
            project: 'my-other-project',
            environment: 'production',
        },
        'user@company.com updated *[new-feature](unleashUrl/projects/my-other-project/features/new-feature)* in project *my-other-project* by updating strategy userWithId in *production* userIds from empty set of userIds to [a,b]; constraints from empty set of constraints to [appName is one of (x,y)]',
    ],
    [
        'when IPs changed',
        {
            id: 920,
            type: types_1.FEATURE_STRATEGY_UPDATE,
            createdBy: 'user@company.com',
            createdAt: new Date('2022-06-01T10:03:11.549Z'),
            data: {
                name: 'remoteAddress',
                constraints: [
                    {
                        values: ['x', 'y'],
                        inverted: false,
                        operator: util_1.IN,
                        contextName: 'appName',
                        caseInsensitive: false,
                    },
                ],
                parameters: {
                    IPs: '127.0.0.1',
                },
            },
            preData: {
                name: 'remoteAddress',
                constraints: [],
                parameters: {
                    IPs: '',
                },
            },
            tags: [],
            featureName: 'new-feature',
            project: 'my-other-project',
            environment: 'production',
        },
        'user@company.com updated *[new-feature](unleashUrl/projects/my-other-project/features/new-feature)* in project *my-other-project* by updating strategy remoteAddress in *production* IPs from empty set of IPs to [127.0.0.1]; constraints from empty set of constraints to [appName is one of (x,y)]',
    ],
    [
        'when host names changed',
        {
            id: 920,
            type: types_1.FEATURE_STRATEGY_UPDATE,
            createdBy: 'user@company.com',
            createdAt: new Date('2022-06-01T10:03:11.549Z'),
            data: {
                name: 'applicationHostname',
                constraints: [
                    {
                        values: ['x', 'y'],
                        inverted: false,
                        operator: util_1.IN,
                        contextName: 'appName',
                        caseInsensitive: false,
                    },
                ],
                parameters: {
                    hostNames: 'unleash.com',
                },
            },
            preData: {
                name: 'applicationHostname',
                constraints: [],
                parameters: {
                    hostNames: '',
                },
            },
            tags: [],
            featureName: 'new-feature',
            project: 'my-other-project',
            environment: 'production',
        },
        'user@company.com updated *[new-feature](unleashUrl/projects/my-other-project/features/new-feature)* in project *my-other-project* by updating strategy applicationHostname in *production* hostNames from empty set of hostNames to [unleash.com]; constraints from empty set of constraints to [appName is one of (x,y)]',
    ],
    [
        'when no specific text for strategy exists yet',
        {
            id: 920,
            type: types_1.FEATURE_STRATEGY_UPDATE,
            createdBy: 'user@company.com',
            createdAt: new Date('2022-06-01T10:03:11.549Z'),
            data: {
                name: 'newStrategy',
                constraints: [
                    {
                        values: ['x', 'y'],
                        inverted: false,
                        operator: util_1.IN,
                        contextName: 'appName',
                        caseInsensitive: false,
                    },
                ],
                parameters: {
                    IPs: '127.0.0.1',
                },
            },
            preData: {
                name: 'newStrategy',
                constraints: [],
                parameters: {
                    IPs: '',
                },
            },
            tags: [],
            featureName: 'new-feature',
            project: 'my-other-project',
            environment: 'production',
        },
        'user@company.com updated *[new-feature](unleashUrl/projects/my-other-project/features/new-feature)* in project *my-other-project* by updating strategy newStrategy in *production*',
    ],
];
testCases.forEach(([description, event, expected]) => test('Should format specialised text for events ' + description, () => {
    const formatter = new feature_event_formatter_md_1.FeatureEventFormatterMd('unleashUrl');
    const actual = formatter.format(event);
    expect(actual).toBe(expected);
}));
//# sourceMappingURL=feature-event-formatter-md.test.js.map