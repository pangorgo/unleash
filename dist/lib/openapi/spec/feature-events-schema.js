"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureEventsSchema = void 0;
const event_schema_1 = require("./event-schema");
const tag_schema_1 = require("./tag-schema");
exports.featureEventsSchema = {
    $id: '#/components/schemas/featureEventsSchema',
    type: 'object',
    additionalProperties: false,
    required: ['events'],
    description: 'One or more events happening to a specific feature toggle',
    properties: {
        version: {
            type: 'integer',
            description: 'An API versioning number',
            minimum: 1,
            enum: [1],
            example: 1,
        },
        toggleName: {
            description: 'The name of the feature toggle these events relate to',
            type: 'string',
            example: 'my.first.feature.toggle',
        },
        events: {
            description: 'The list of events',
            type: 'array',
            items: { $ref: event_schema_1.eventSchema.$id },
        },
        totalEvents: {
            description: 'How many events are there for this feature toggle',
            type: 'integer',
            minimum: 0,
            example: 13,
        },
    },
    components: {
        schemas: {
            eventSchema: event_schema_1.eventSchema,
            tagSchema: tag_schema_1.tagSchema,
        },
    },
};
//# sourceMappingURL=feature-events-schema.js.map