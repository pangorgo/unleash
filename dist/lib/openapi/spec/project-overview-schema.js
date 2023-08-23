"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectOverviewSchema = void 0;
const parameters_schema_1 = require("./parameters-schema");
const variant_schema_1 = require("./variant-schema");
const override_schema_1 = require("./override-schema");
const feature_strategy_schema_1 = require("./feature-strategy-schema");
const feature_schema_1 = require("./feature-schema");
const constraint_schema_1 = require("./constraint-schema");
const environment_schema_1 = require("./environment-schema");
const feature_environment_schema_1 = require("./feature-environment-schema");
const project_stats_schema_1 = require("./project-stats-schema");
const create_feature_strategy_schema_1 = require("./create-feature-strategy-schema");
const project_environment_schema_1 = require("./project-environment-schema");
const create_strategy_variant_schema_1 = require("./create-strategy-variant-schema");
const strategy_variant_schema_1 = require("./strategy-variant-schema");
exports.projectOverviewSchema = {
    $id: '#/components/schemas/projectOverviewSchema',
    type: 'object',
    additionalProperties: false,
    required: ['version', 'name'],
    description: 'A high-level overview of a project. It contains information such as project statistics, the name of the project, what members and what features it contains, etc.',
    properties: {
        stats: {
            $ref: '#/components/schemas/projectStatsSchema',
            description: 'Project statistics',
        },
        version: {
            type: 'integer',
            example: 1,
            description: 'The schema version used to describe the project overview',
        },
        name: {
            type: 'string',
            example: 'dx-squad',
            description: 'The name of this project',
        },
        description: {
            type: 'string',
            nullable: true,
            example: 'DX squad feature release',
            description: 'Additional information about the project',
        },
        defaultStickiness: {
            type: 'string',
            example: 'userId',
            description: 'A default stickiness for the project affecting the default stickiness value for variants and Gradual Rollout strategy',
        },
        mode: {
            type: 'string',
            enum: ['open', 'protected'],
            example: 'open',
            description: "The project's [collaboration mode](https://docs.getunleash.io/reference/project-collaboration-mode). Determines whether non-project members can submit change requests or not.",
        },
        featureLimit: {
            type: 'number',
            nullable: true,
            example: 100,
            description: 'A limit on the number of features allowed in the project. Null if no limit.',
        },
        members: {
            type: 'number',
            example: 4,
            description: 'The number of members this project has',
        },
        health: {
            type: 'number',
            example: 50,
            description: "An indicator of the [project's health](https://docs.getunleash.io/reference/technical-debt#health-rating) on a scale from 0 to 100",
        },
        environments: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/projectEnvironmentSchema',
            },
            example: [
                { environment: 'development' },
                {
                    environment: 'production',
                    defaultStrategy: {
                        name: 'flexibleRollout',
                        constraints: [],
                        parameters: {
                            rollout: '50',
                            stickiness: 'customAppName',
                            groupId: 'stickytoggle',
                        },
                    },
                },
            ],
            description: 'The environments that are enabled for this project',
        },
        features: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/featureSchema',
            },
            description: 'The full list of features in this project (excluding archived features)',
        },
        updatedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2023-02-10T08:36:35.262Z',
            description: 'When the project was last updated.',
        },
        createdAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2023-02-10T08:36:35.262Z',
            description: 'When the project was created.',
        },
        favorite: {
            type: 'boolean',
            example: true,
            description: '`true` if the project was favorited, otherwise `false`.',
        },
    },
    components: {
        schemas: {
            environmentSchema: environment_schema_1.environmentSchema,
            projectEnvironmentSchema: project_environment_schema_1.projectEnvironmentSchema,
            createFeatureStrategySchema: create_feature_strategy_schema_1.createFeatureStrategySchema,
            createStrategyVariantSchema: create_strategy_variant_schema_1.createStrategyVariantSchema,
            constraintSchema: constraint_schema_1.constraintSchema,
            featureSchema: feature_schema_1.featureSchema,
            featureEnvironmentSchema: feature_environment_schema_1.featureEnvironmentSchema,
            overrideSchema: override_schema_1.overrideSchema,
            parametersSchema: parameters_schema_1.parametersSchema,
            featureStrategySchema: feature_strategy_schema_1.featureStrategySchema,
            strategyVariantSchema: strategy_variant_schema_1.strategyVariantSchema,
            variantSchema: variant_schema_1.variantSchema,
            projectStatsSchema: project_stats_schema_1.projectStatsSchema,
        },
    },
};
//# sourceMappingURL=project-overview-schema.js.map