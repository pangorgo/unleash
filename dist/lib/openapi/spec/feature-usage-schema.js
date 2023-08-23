"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureUsageSchema = void 0;
const feature_environment_metrics_schema_1 = require("./feature-environment-metrics-schema");
const date_schema_1 = require("./date-schema");
exports.featureUsageSchema = {
    $id: '#/components/schemas/featureUsageSchema',
    type: 'object',
    additionalProperties: false,
    description: 'How many applications have seen this feature toggle, as well as how this feature was evaluated the last hour',
    required: [
        'version',
        'maturity',
        'featureName',
        'lastHourUsage',
        'seenApplications',
    ],
    properties: {
        version: {
            description: 'The version of this schema',
            type: 'integer',
            minimum: 1,
        },
        maturity: {
            description: 'The maturity level of this API (alpha, beta, stable, deprecated)',
            type: 'string',
            example: 'stable',
        },
        featureName: {
            description: 'The name of the feature',
            type: 'string',
            example: 'my.special.feature',
        },
        lastHourUsage: {
            description: 'Last hour statistics. Accumulated per feature per environment. Contains counts for evaluations to true (yes) and to false (no)',
            type: 'array',
            items: {
                $ref: '#/components/schemas/featureEnvironmentMetricsSchema',
            },
        },
        seenApplications: {
            description: 'A list of applications seen using this feature',
            type: 'array',
            items: {
                type: 'string',
            },
            example: ['accounting', 'billing', 'booking'],
        },
    },
    components: {
        schemas: {
            featureEnvironmentMetricsSchema: feature_environment_metrics_schema_1.featureEnvironmentMetricsSchema,
            dateSchema: date_schema_1.dateSchema,
        },
    },
};
//# sourceMappingURL=feature-usage-schema.js.map