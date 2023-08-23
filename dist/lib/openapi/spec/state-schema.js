"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateSchema = void 0;
const feature_schema_1 = require("./feature-schema");
const tag_schema_1 = require("./tag-schema");
const tag_type_schema_1 = require("./tag-type-schema");
const feature_tag_schema_1 = require("./feature-tag-schema");
const project_schema_1 = require("./project-schema");
const feature_strategy_schema_1 = require("./feature-strategy-schema");
const feature_environment_schema_1 = require("./feature-environment-schema");
const environment_schema_1 = require("./environment-schema");
const segment_schema_1 = require("./segment-schema");
const feature_strategy_segment_schema_1 = require("./feature-strategy-segment-schema");
const strategy_schema_1 = require("./strategy-schema");
const strategy_variant_schema_1 = require("./strategy-variant-schema");
exports.stateSchema = {
    $id: '#/components/schemas/stateSchema',
    type: 'object',
    deprecated: true,
    description: 'The application state as used by the deprecated export/import APIs.',
    required: ['version'],
    properties: {
        version: {
            type: 'integer',
            description: 'The version of the schema used to describe the state',
            example: 1,
        },
        features: {
            type: 'array',
            description: 'A list of features',
            items: {
                $ref: '#/components/schemas/featureSchema',
            },
        },
        strategies: {
            type: 'array',
            description: 'A list of strategies',
            items: {
                $ref: '#/components/schemas/strategySchema',
            },
        },
        tags: {
            type: 'array',
            description: 'A list of tags',
            items: {
                $ref: '#/components/schemas/tagSchema',
            },
        },
        tagTypes: {
            type: 'array',
            description: 'A list of tag types',
            items: {
                $ref: '#/components/schemas/tagTypeSchema',
            },
        },
        featureTags: {
            type: 'array',
            description: 'A list of tags applied to features',
            items: {
                $ref: '#/components/schemas/featureTagSchema',
            },
        },
        projects: {
            type: 'array',
            description: 'A list of projects',
            items: {
                $ref: '#/components/schemas/projectSchema',
            },
        },
        featureStrategies: {
            type: 'array',
            description: 'A list of feature strategies as applied to features',
            items: {
                $ref: '#/components/schemas/featureStrategySchema',
            },
        },
        featureEnvironments: {
            type: 'array',
            description: 'A list of feature environment configurations',
            items: {
                $ref: '#/components/schemas/featureEnvironmentSchema',
            },
        },
        environments: {
            type: 'array',
            description: 'A list of environments',
            items: {
                $ref: '#/components/schemas/environmentSchema',
            },
        },
        segments: {
            type: 'array',
            description: 'A list of segments',
            items: {
                $ref: '#/components/schemas/segmentSchema',
            },
        },
        featureStrategySegments: {
            type: 'array',
            description: 'A list of segment/strategy pairings',
            items: {
                $ref: '#/components/schemas/featureStrategySegmentSchema',
            },
        },
    },
    components: {
        schemas: {
            featureSchema: feature_schema_1.featureSchema,
            tagSchema: tag_schema_1.tagSchema,
            tagTypeSchema: tag_type_schema_1.tagTypeSchema,
            featureTagSchema: feature_tag_schema_1.featureTagSchema,
            projectSchema: project_schema_1.projectSchema,
            featureStrategySchema: feature_strategy_schema_1.featureStrategySchema,
            strategyVariantSchema: strategy_variant_schema_1.strategyVariantSchema,
            featureEnvironmentSchema: feature_environment_schema_1.featureEnvironmentSchema,
            environmentSchema: environment_schema_1.environmentSchema,
            segmentSchema: segment_schema_1.segmentSchema,
            featureStrategySegmentSchema: feature_strategy_segment_schema_1.featureStrategySegmentSchema,
            strategySchema: strategy_schema_1.strategySchema,
        },
    },
};
//# sourceMappingURL=state-schema.js.map