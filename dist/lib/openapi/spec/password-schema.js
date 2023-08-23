"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordSchema = void 0;
exports.passwordSchema = {
    $id: '#/components/schemas/passwordSchema',
    type: 'object',
    additionalProperties: false,
    required: ['password'],
    description: 'Fields used to create new password or update old password',
    properties: {
        password: {
            type: 'string',
            example: 'k!5As3HquUrQ',
            description: 'The new password to change or validate.',
        },
        oldPassword: {
            type: 'string',
            example: 'Oldk!5As3HquUrQ',
            description: 'The old password the user is changing. This field is for the non-admin users changing their own password.',
        },
        confirmPassword: {
            type: 'string',
            example: 'k!5As3HquUrQ',
            description: 'The confirmation of the new password. This field is for the non-admin users changing their own password.',
        },
    },
    components: {},
};
//# sourceMappingURL=password-schema.js.map