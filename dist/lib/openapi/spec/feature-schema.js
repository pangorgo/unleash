"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureSchema = void 0;
const variant_schema_1 = require("./variant-schema");
const constraint_schema_1 = require("./constraint-schema");
const override_schema_1 = require("./override-schema");
const parameters_schema_1 = require("./parameters-schema");
const feature_strategy_schema_1 = require("./feature-strategy-schema");
const tag_schema_1 = require("./tag-schema");
const feature_environment_schema_1 = require("./feature-environment-schema");
const strategy_variant_schema_1 = require("./strategy-variant-schema");
exports.featureSchema = {
    $id: '#/components/schemas/featureSchema',
    type: 'object',
    additionalProperties: false,
    required: ['name'],
    description: 'A feature toggle definition',
    properties: {
        name: {
            type: 'string',
            example: 'disable-comments',
            description: 'Unique feature name',
        },
        type: {
            type: 'string',
            example: 'kill-switch',
            description: 'Type of the toggle e.g. experiment, kill-switch, release, operational, permission',
        },
        description: {
            type: 'string',
            nullable: true,
            example: 'Controls disabling of the comments section in case of an incident',
            description: 'Detailed description of the feature',
        },
        archived: {
            type: 'boolean',
            example: true,
            description: '`true` if the feature is archived',
        },
        project: {
            type: 'string',
            example: 'dx-squad',
            description: 'Name of the project the feature belongs to',
        },
        enabled: {
            type: 'boolean',
            example: true,
            description: '`true` if the feature is enabled, otherwise `false`.',
        },
        stale: {
            type: 'boolean',
            example: false,
            description: '`true` if the feature is stale based on the age and feature type, otherwise `false`.',
        },
        favorite: {
            type: 'boolean',
            example: true,
            description: '`true` if the feature was favorited, otherwise `false`.',
        },
        impressionData: {
            type: 'boolean',
            example: false,
            description: '`true` if the impression data collection is enabled for the feature, otherwise `false`.',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2023-01-28T15:21:39.975Z',
            description: 'The date the feature was created',
        },
        archivedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2023-01-29T15:21:39.975Z',
            description: 'The date the feature was archived',
        },
        lastSeenAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            deprecated: true,
            example: '2023-01-28T16:21:39.975Z',
            description: 'The date when metrics where last collected for the feature. This field is deprecated, use the one in featureEnvironmentSchema',
        },
        environments: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/featureEnvironmentSchema',
            },
            description: 'The list of environments where the feature can be used',
        },
        variants: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/variantSchema',
            },
            description: 'The list of feature variants',
            deprecated: true,
        },
        strategies: {
            type: 'array',
            items: {
                type: 'object',
            },
            description: 'This is a legacy field that will be deprecated',
            deprecated: true,
        },
        tags: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/tagSchema',
            },
            nullable: true,
            description: 'The list of feature tags',
        },
    },
    components: {
        schemas: {
            constraintSchema: constraint_schema_1.constraintSchema,
            featureEnvironmentSchema: feature_environment_schema_1.featureEnvironmentSchema,
            featureStrategySchema: feature_strategy_schema_1.featureStrategySchema,
            strategyVariantSchema: strategy_variant_schema_1.strategyVariantSchema,
            overrideSchema: override_schema_1.overrideSchema,
            parametersSchema: parameters_schema_1.parametersSchema,
            variantSchema: variant_schema_1.variantSchema,
            tagSchema: tag_schema_1.tagSchema,
        },
    },
};
//# sourceMappingURL=feature-schema.js.map