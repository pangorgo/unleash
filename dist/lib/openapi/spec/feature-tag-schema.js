"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureTagSchema = void 0;
exports.featureTagSchema = {
    $id: '#/components/schemas/featureTagSchema',
    type: 'object',
    description: 'Describes a tag applied to a feature',
    additionalProperties: false,
    required: ['featureName', 'tagValue'],
    properties: {
        featureName: {
            type: 'string',
            example: 'my-feature',
            description: 'The name of the feature this tag is applied to',
        },
        tagType: {
            type: 'string',
            example: 'simple',
            description: 'The [type](https://docs.getunleash.io/reference/tags#tag-types tag types) of the tag',
        },
        tagValue: {
            type: 'string',
            example: 'my-tag',
            description: 'The value of the tag',
        },
        type: {
            deprecated: true,
            type: 'string',
            description: 'The [type](https://docs.getunleash.io/reference/tags#tag-types tag types) of the tag. This property is deprecated and will be removed in a future version of Unleash. Superseded by the `tagType` property.',
        },
        value: {
            deprecated: true,
            type: 'string',
            description: 'The value of the tag. This property is deprecated and will be removed in a future version of Unleash. Superseded by the `tagValue` property.',
        },
    },
    components: {},
};
//# sourceMappingURL=feature-tag-schema.js.map