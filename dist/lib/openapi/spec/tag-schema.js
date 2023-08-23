"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagSchema = exports.TAG_MAX_LENGTH = exports.TAG_MIN_LENGTH = void 0;
exports.TAG_MIN_LENGTH = 2;
exports.TAG_MAX_LENGTH = 50;
exports.tagSchema = {
    $id: '#/components/schemas/tagSchema',
    type: 'object',
    description: 'Representation of a [tag](https://docs.getunleash.io/reference/tags)',
    additionalProperties: false,
    required: ['value', 'type'],
    properties: {
        value: {
            type: 'string',
            minLength: exports.TAG_MIN_LENGTH,
            maxLength: exports.TAG_MAX_LENGTH,
            description: 'The value of the tag',
            example: 'a-tag-value',
        },
        type: {
            type: 'string',
            minLength: exports.TAG_MIN_LENGTH,
            maxLength: exports.TAG_MAX_LENGTH,
            default: 'simple',
            description: 'The [type](https://docs.getunleash.io/reference/tags#tag-types) of the tag',
            example: 'simple',
        },
    },
    components: {},
};
//# sourceMappingURL=tag-schema.js.map