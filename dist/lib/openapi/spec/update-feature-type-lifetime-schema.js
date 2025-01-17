"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeatureTypeLifetimeSchema = void 0;
exports.updateFeatureTypeLifetimeSchema = {
    $id: '#/components/schemas/updateFeatureTypeLifetimeSchema',
    type: 'object',
    required: ['lifetimeDays'],
    description: 'Data used when updating the lifetime of a [feature toggle type](https://docs.getunleash.io/reference/feature-toggle-types).',
    properties: {
        lifetimeDays: {
            description: 'The new lifetime (in days) that you want to assign to the feature toggle type. If the value is `null` or `0`, then the feature toggles of that type will never be marked as potentially stale. Otherwise, they will be considered potentially stale after the number of days indicated by this property.',
            example: 7,
            type: 'integer',
            nullable: true,
            minimum: 0,
            maximum: 2147483647, // Postgres' max integer: https://www.postgresql.org/docs/9.1/datatype-numeric.html
        },
    },
    components: {},
};
//# sourceMappingURL=update-feature-type-lifetime-schema.js.map