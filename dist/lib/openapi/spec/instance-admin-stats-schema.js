"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceAdminStatsSchema = void 0;
exports.instanceAdminStatsSchema = {
    $id: '#/components/schemas/instanceAdminStatsSchema',
    type: 'object',
    additionalProperties: false,
    description: 'Information about an instance and statistics about usage of various features of Unleash',
    required: ['instanceId'],
    properties: {
        instanceId: {
            type: 'string',
            description: 'A unique identifier for this instance. Generated by the database migration scripts at first run. Typically a UUID.',
            example: 'ed3861ae-78f9-4e8c-8e57-b57efc15f82b',
        },
        timestamp: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            description: 'When these statistics were produced',
            example: '2023-06-12T12:25:06Z',
        },
        versionOSS: {
            type: 'string',
            description: 'The version of Unleash OSS that is bundled in this instance',
            example: '5.1.7',
        },
        versionEnterprise: {
            type: 'string',
            description: 'The version of Unleash Enterprise that is bundled in this instance',
            example: '5.1.7',
        },
        users: {
            type: 'number',
            description: 'The number of users this instance has',
            example: 8,
            minimum: 0,
        },
        featureToggles: {
            type: 'number',
            description: 'The number of feature-toggles this instance has',
            example: 47,
            minimum: 0,
        },
        projects: {
            type: 'number',
            description: 'The number of projects defined in this instance.',
            example: 3,
            minimum: 0,
        },
        contextFields: {
            type: 'number',
            description: 'The number of context fields defined in this instance.',
            example: 7,
            minimum: 0,
        },
        roles: {
            type: 'number',
            description: 'The number of roles defined in this instance',
            example: 5,
            minimum: 0,
        },
        groups: {
            type: 'number',
            description: 'The number of groups defined in this instance',
            example: 12,
            minimum: 0,
        },
        environments: {
            type: 'number',
            description: 'The number of environments defined in this instance',
            example: 3,
            minimum: 0,
        },
        segments: {
            type: 'number',
            description: 'The number of segments defined in this instance',
            example: 19,
            minimum: 0,
        },
        strategies: {
            type: 'number',
            description: 'The number of strategies defined in this instance',
            example: 8,
            minimum: 0,
        },
        SAMLenabled: {
            type: 'boolean',
            description: 'Whether or not SAML authentication is enabled for this instance',
            example: false,
        },
        OIDCenabled: {
            type: 'boolean',
            description: 'Whether or not OIDC authentication is enabled for this instance',
            example: true,
        },
        clientApps: {
            type: 'array',
            description: 'A count of connected applications in the last week, last month and all time since last restart',
            items: {
                type: 'object',
                description: 'An entry describing how many client applications has been observed over the defined range',
                properties: {
                    range: {
                        type: 'string',
                        description: 'A description of a time range',
                        enum: ['allTime', '30d', '7d'],
                        example: '30d',
                    },
                    count: {
                        type: 'number',
                        description: 'The number of client applications that have been observed in this period',
                        example: 1,
                    },
                },
            },
        },
        sum: {
            type: 'string',
            description: 'A SHA-256 checksum of the instance statistics to be used to verify that the data in this object has not been tampered with',
            example: 'b023323477abb1eb145bebf3cdb30a1c2063e3edc1f7ae474ed8ed6c80de9a3b',
        },
    },
    components: {},
};
//# sourceMappingURL=instance-admin-stats-schema.js.map