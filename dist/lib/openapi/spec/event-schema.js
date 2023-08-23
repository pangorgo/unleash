"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventSchema = void 0;
const tag_schema_1 = require("./tag-schema");
const types_1 = require("../../types");
const variant_schema_1 = require("./variant-schema");
const eventDataSchema = {
    type: 'object',
    nullable: true,
    'x-enforcer-exception-skip-codes': 'WSCH006',
    description: 'Extra associated data related to the event, such as feature toggle state, segment configuration, etc., if applicable.',
    example: {
        name: 'new-feature',
        description: 'Toggle description',
        type: 'release',
        project: 'my-project',
        stale: false,
        variants: [],
        createdAt: '2022-05-31T13:32:20.547Z',
        lastSeenAt: null,
        impressionData: true,
    },
};
exports.eventSchema = {
    $id: '#/components/schemas/eventSchema',
    type: 'object',
    additionalProperties: false,
    required: ['id', 'createdAt', 'type', 'createdBy'],
    description: 'An event describing something happening in the system',
    properties: {
        id: {
            type: 'integer',
            minimum: 1,
            description: 'The ID of the event. An increasing natural number.',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The time the event happened as a RFC 3339-conformant timestamp.',
            example: '2023-07-05T12:56:00.000Z',
        },
        type: {
            type: 'string',
            description: 'What [type](https://docs.getunleash.io/reference/api/legacy/unleash/admin/events#event-type-description) of event this is',
            enum: types_1.IEventTypes,
            example: 'feature-created',
        },
        createdBy: {
            type: 'string',
            description: 'Which user created this event',
            example: 'johndoe',
        },
        environment: {
            type: 'string',
            description: 'The feature toggle environment the event relates to, if applicable.',
            nullable: true,
            example: 'development',
        },
        project: {
            type: 'string',
            nullable: true,
            description: 'The project the event relates to, if applicable.',
            example: 'default',
        },
        featureName: {
            type: 'string',
            nullable: true,
            description: 'The name of the feature toggle the event relates to, if applicable.',
            example: 'my.first.feature',
        },
        data: eventDataSchema,
        preData: {
            ...eventDataSchema,
            description: "Data relating to the previous state of the event's subject.",
        },
        tags: {
            type: 'array',
            items: {
                $ref: tag_schema_1.tagSchema.$id,
            },
            nullable: true,
            description: 'Any tags related to the event, if applicable.',
        },
    },
    components: {
        schemas: {
            tagSchema: tag_schema_1.tagSchema,
            variantSchema: variant_schema_1.variantSchema,
        },
    },
};
//# sourceMappingURL=event-schema.js.map