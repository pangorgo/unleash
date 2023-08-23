"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playgroundStrategySchema = exports.strategyEvaluationResults = exports.playgroundStrategyEvaluation = void 0;
const parameters_schema_1 = require("./parameters-schema");
const playground_constraint_schema_1 = require("./playground-constraint-schema");
const playground_segment_schema_1 = require("./playground-segment-schema");
const variant_schema_1 = require("./variant-schema");
const override_schema_1 = require("./override-schema");
exports.playgroundStrategyEvaluation = {
    evaluationComplete: 'complete',
    evaluationIncomplete: 'incomplete',
    unknownResult: 'unknown',
};
exports.strategyEvaluationResults = {
    anyOf: [
        {
            type: 'object',
            additionalProperties: false,
            required: ['evaluationStatus', 'enabled'],
            properties: {
                evaluationStatus: {
                    type: 'string',
                    description: "Signals that this strategy could not be evaluated. This is most likely because you're using a custom strategy that Unleash doesn't know about.",
                    enum: [exports.playgroundStrategyEvaluation.evaluationIncomplete],
                },
                enabled: {
                    description: "Whether this strategy resolves to `false` or if it might resolve to `true`. Because Unleash can't evaluate the strategy, it can't say for certain whether it will be `true`, but if you have failing constraints or segments, it _can_ determine that your strategy would be `false`.",
                    anyOf: [
                        { type: 'boolean', enum: [false] },
                        {
                            type: 'string',
                            enum: [exports.playgroundStrategyEvaluation.unknownResult],
                        },
                    ],
                },
            },
        },
        {
            type: 'object',
            additionalProperties: false,
            required: ['evaluationStatus', 'enabled'],
            properties: {
                evaluationStatus: {
                    description: 'Signals that this strategy was evaluated successfully.',
                    type: 'string',
                    enum: ['complete'],
                },
                enabled: {
                    type: 'boolean',
                    description: 'Whether this strategy evaluates to true or not.',
                },
                variant: {
                    description: `The feature variant you receive based on the provided context or the _disabled
                          variant_. If a feature is disabled or doesn't have any
                          variants, you would get the _disabled variant_.
                          Otherwise, you'll get one of the feature's defined variants.`,
                    type: 'object',
                    additionalProperties: false,
                    required: ['name', 'enabled'],
                    properties: {
                        name: {
                            type: 'string',
                            description: "The variant's name. If there is no variant or if the toggle is disabled, this will be `disabled`",
                            example: 'red-variant',
                        },
                        enabled: {
                            type: 'boolean',
                            description: "Whether the variant is enabled or not. If the feature is disabled or if it doesn't have variants, this property will be `false`",
                        },
                        payload: {
                            type: 'object',
                            additionalProperties: false,
                            required: ['type', 'value'],
                            description: 'An optional payload attached to the variant.',
                            properties: {
                                type: {
                                    description: 'The format of the payload.',
                                    type: 'string',
                                    enum: ['json', 'csv', 'string'],
                                },
                                value: {
                                    type: 'string',
                                    description: 'The payload value stringified.',
                                    example: '{"property": "value"}',
                                },
                            },
                        },
                    },
                    nullable: true,
                    example: { name: 'green', enabled: true },
                },
                variants: {
                    type: 'array',
                    description: 'The feature variants.',
                    items: { $ref: variant_schema_1.variantSchema.$id },
                },
            },
        },
    ],
};
exports.playgroundStrategySchema = {
    $id: '#/components/schemas/playgroundStrategySchema',
    type: 'object',
    description: 'An evaluated feature toggle strategy as used by the Playground',
    additionalProperties: false,
    required: [
        'id',
        'name',
        'result',
        'segments',
        'constraints',
        'parameters',
        'disabled',
        'links',
    ],
    properties: {
        name: {
            description: "The strategy's name.",
            type: 'string',
        },
        title: {
            type: 'string',
            example: 'Beta rollout',
            description: "Description of the feature's purpose.",
        },
        id: {
            description: "The strategy's id.",
            type: 'string',
            example: '3AECCF7E-FF82-4174-8287-8EBE06079A50',
        },
        result: {
            description: `The strategy's evaluation result. If the strategy is a custom strategy that Unleash can't evaluate, \`evaluationStatus\` will be \`${exports.playgroundStrategyEvaluation.unknownResult}\`. Otherwise, it will be \`true\` or \`false\``,
            ...exports.strategyEvaluationResults,
        },
        disabled: {
            type: 'boolean',
            description: "The strategy's status. Disabled strategies are not evaluated",
            example: false,
            nullable: true,
        },
        segments: {
            type: 'array',
            description: "The strategy's segments and their evaluation results.",
            items: {
                $ref: playground_segment_schema_1.playgroundSegmentSchema.$id,
            },
        },
        constraints: {
            type: 'array',
            description: "The strategy's constraints and their evaluation results.",
            items: {
                $ref: playground_constraint_schema_1.playgroundConstraintSchema.$id,
            },
        },
        parameters: {
            description: "The strategy's constraints and their evaluation results.",
            example: {
                myParam1: 'param value',
            },
            $ref: parameters_schema_1.parametersSchema.$id,
        },
        links: {
            description: 'A set of links to actions you can perform on this strategy',
            type: 'object',
            required: ['edit'],
            properties: {
                edit: {
                    type: 'string',
                    example: '/projects/some-project/features/some-feature/strategies/edit?environmentId=some-env&strategyId= 3AECCF7E-FF82-4174-8287-8EBE06079A50',
                },
            },
        },
    },
    components: {
        schemas: {
            playgroundConstraintSchema: playground_constraint_schema_1.playgroundConstraintSchema,
            playgroundSegmentSchema: playground_segment_schema_1.playgroundSegmentSchema,
            parametersSchema: parameters_schema_1.parametersSchema,
            variantSchema: variant_schema_1.variantSchema,
            overrideSchema: override_schema_1.overrideSchema,
        },
    },
};
//# sourceMappingURL=playground-strategy-schema.js.map