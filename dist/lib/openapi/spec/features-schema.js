"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featuresSchema = void 0;
const feature_schema_1 = require("./feature-schema");
const parameters_schema_1 = require("./parameters-schema");
const variant_schema_1 = require("./variant-schema");
const override_schema_1 = require("./override-schema");
const constraint_schema_1 = require("./constraint-schema");
const feature_strategy_schema_1 = require("./feature-strategy-schema");
const environment_schema_1 = require("./environment-schema");
const feature_environment_schema_1 = require("./feature-environment-schema");
const strategy_variant_schema_1 = require("./strategy-variant-schema");
exports.featuresSchema = {
    $id: '#/components/schemas/featuresSchema',
    type: 'object',
    additionalProperties: false,
    required: ['version', 'features'],
    description: 'A list of features',
    deprecated: true,
    properties: {
        version: {
            type: 'integer',
            description: "The version of the feature's schema",
        },
        features: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/featureSchema',
            },
            description: 'A list of features',
        },
    },
    components: {
        schemas: {
            constraintSchema: constraint_schema_1.constraintSchema,
            environmentSchema: environment_schema_1.environmentSchema,
            featureSchema: feature_schema_1.featureSchema,
            overrideSchema: override_schema_1.overrideSchema,
            featureEnvironmentSchema: feature_environment_schema_1.featureEnvironmentSchema,
            featureStrategySchema: feature_strategy_schema_1.featureStrategySchema,
            strategyVariantSchema: strategy_variant_schema_1.strategyVariantSchema,
            parametersSchema: parameters_schema_1.parametersSchema,
            variantSchema: variant_schema_1.variantSchema,
        },
    },
};
//# sourceMappingURL=features-schema.js.map