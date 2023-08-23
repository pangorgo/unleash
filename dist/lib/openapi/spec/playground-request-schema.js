"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playgroundRequestSchema = void 0;
const api_token_1 = require("../../types/models/api-token");
const sdk_context_schema_1 = require("./sdk-context-schema");
exports.playgroundRequestSchema = {
    $id: '#/components/schemas/playgroundRequestSchema',
    description: 'Data for the playground API to evaluate toggles',
    type: 'object',
    required: ['environment', 'context'],
    properties: {
        environment: {
            type: 'string',
            example: 'development',
            description: 'The environment to evaluate toggles in.',
        },
        projects: {
            description: 'A list of projects to check for toggles in.',
            oneOf: [
                {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['my-project'],
                    description: 'A list of projects to check for toggles in.',
                },
                {
                    type: 'string',
                    enum: [api_token_1.ALL],
                    description: 'Check toggles in all projects.',
                },
            ],
        },
        context: {
            $ref: sdk_context_schema_1.sdkContextSchema.$id,
        },
    },
    components: {
        schemas: {
            sdkContextSchema: sdk_context_schema_1.sdkContextSchema,
        },
    },
};
//# sourceMappingURL=playground-request-schema.js.map