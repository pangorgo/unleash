"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFeatureSchema = void 0;
exports.validateFeatureSchema = {
    $id: '#/components/schemas/validateFeatureSchema',
    type: 'object',
    required: ['name'],
    description: "Data used to validate a feature toggle's name.",
    properties: {
        name: {
            description: 'The feature name to validate.',
            type: 'string',
            example: 'my-feature-3',
        },
    },
    components: {},
};
//# sourceMappingURL=validate-feature-schema.js.map