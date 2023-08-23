"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiTokenSchema = void 0;
const api_token_1 = require("../../types/models/api-token");
exports.apiTokenSchema = {
    $id: '#/components/schemas/apiTokenSchema',
    type: 'object',
    additionalProperties: false,
    required: [
        'secret',
        'tokenName',
        'type',
        'project',
        'projects',
        'createdAt',
    ],
    description: 'An overview of an [Unleash API token](https://docs.getunleash.io/reference/api-tokens-and-client-keys).',
    properties: {
        secret: {
            type: 'string',
            description: 'The token used for authentication.',
            example: 'project:environment.xyzrandomstring',
        },
        username: {
            type: 'string',
            deprecated: true,
            description: 'This property was deprecated in Unleash v5. Prefer the `tokenName` property instead.',
            example: 'a-name',
        },
        tokenName: {
            type: 'string',
            description: 'A unique name for this particular token',
            example: 'some-user',
        },
        type: {
            type: 'string',
            enum: Object.values(api_token_1.ApiTokenType),
            description: 'The type of API token',
            example: 'client',
        },
        environment: {
            type: 'string',
            description: 'The environment the token has access to. `*` if it has access to all environments.',
            example: 'development',
        },
        project: {
            type: 'string',
            description: 'The project this token belongs to.',
            example: 'developerexperience',
        },
        projects: {
            type: 'array',
            description: 'The list of projects this token has access to. If the token has access to specific projects they will be listed here. If the token has access to all projects it will be represented as `[*]`',
            items: {
                type: 'string',
            },
            example: ['developerexperience', 'enterprisegrowth'],
        },
        expiresAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            description: `The token's expiration date. NULL if the token doesn't have an expiration set.`,
            example: '2023-04-19T08:15:14.000Z',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2023-04-19T08:15:14.000Z',
            description: 'When the token was created.',
        },
        seenAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2023-04-19T08:15:14.000Z',
            description: 'When the token was last seen/used to authenticate with. NULL if the token has not yet been used for authentication.',
        },
        alias: {
            type: 'string',
            nullable: true,
            description: `Alias is no longer in active use and will often be NULL. It's kept around as a way of allowing old proxy tokens created with the old metadata format to keep working.`,
            example: 'randomid-or-some-alias',
        },
    },
    components: {},
};
//# sourceMappingURL=api-token-schema.js.map