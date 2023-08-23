"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupUserModelSchema = void 0;
const user_schema_1 = require("./user-schema");
exports.groupUserModelSchema = {
    $id: '#/components/schemas/groupUserModelSchema',
    type: 'object',
    additionalProperties: false,
    required: ['user'],
    description: 'Details for a single user belonging to a group',
    properties: {
        joinedAt: {
            description: 'The date when the user joined the group',
            type: 'string',
            format: 'date-time',
            example: '2023-06-30T11:41:00.123Z',
        },
        createdBy: {
            description: 'The username of the user who added this user to this group',
            type: 'string',
            nullable: true,
            example: 'admin',
        },
        user: {
            $ref: '#/components/schemas/userSchema',
        },
    },
    components: {
        schemas: {
            userSchema: user_schema_1.userSchema,
        },
    },
};
//# sourceMappingURL=group-user-model-schema.js.map