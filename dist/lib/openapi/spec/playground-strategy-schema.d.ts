import { FromSchema } from 'json-schema-to-ts';
export declare const playgroundStrategyEvaluation: {
    readonly evaluationComplete: "complete";
    readonly evaluationIncomplete: "incomplete";
    readonly unknownResult: "unknown";
};
export declare const strategyEvaluationResults: {
    readonly anyOf: readonly [{
        readonly type: "object";
        readonly additionalProperties: false;
        readonly required: readonly ["evaluationStatus", "enabled"];
        readonly properties: {
            readonly evaluationStatus: {
                readonly type: "string";
                readonly description: "Signals that this strategy could not be evaluated. This is most likely because you're using a custom strategy that Unleash doesn't know about.";
                readonly enum: readonly ["incomplete"];
            };
            readonly enabled: {
                readonly description: "Whether this strategy resolves to `false` or if it might resolve to `true`. Because Unleash can't evaluate the strategy, it can't say for certain whether it will be `true`, but if you have failing constraints or segments, it _can_ determine that your strategy would be `false`.";
                readonly anyOf: readonly [{
                    readonly type: "boolean";
                    readonly enum: readonly [false];
                }, {
                    readonly type: "string";
                    readonly enum: readonly ["unknown"];
                }];
            };
        };
    }, {
        readonly type: "object";
        readonly additionalProperties: false;
        readonly required: readonly ["evaluationStatus", "enabled"];
        readonly properties: {
            readonly evaluationStatus: {
                readonly description: "Signals that this strategy was evaluated successfully.";
                readonly type: "string";
                readonly enum: readonly ["complete"];
            };
            readonly enabled: {
                readonly type: "boolean";
                readonly description: "Whether this strategy evaluates to true or not.";
            };
            readonly variant: {
                readonly description: "The feature variant you receive based on the provided context or the _disabled\n                          variant_. If a feature is disabled or doesn't have any\n                          variants, you would get the _disabled variant_.\n                          Otherwise, you'll get one of the feature's defined variants.";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["name", "enabled"];
                readonly properties: {
                    readonly name: {
                        readonly type: "string";
                        readonly description: "The variant's name. If there is no variant or if the toggle is disabled, this will be `disabled`";
                        readonly example: "red-variant";
                    };
                    readonly enabled: {
                        readonly type: "boolean";
                        readonly description: "Whether the variant is enabled or not. If the feature is disabled or if it doesn't have variants, this property will be `false`";
                    };
                    readonly payload: {
                        readonly type: "object";
                        readonly additionalProperties: false;
                        readonly required: readonly ["type", "value"];
                        readonly description: "An optional payload attached to the variant.";
                        readonly properties: {
                            readonly type: {
                                readonly description: "The format of the payload.";
                                readonly type: "string";
                                readonly enum: readonly ["json", "csv", "string"];
                            };
                            readonly value: {
                                readonly type: "string";
                                readonly description: "The payload value stringified.";
                                readonly example: "{\"property\": \"value\"}";
                            };
                        };
                    };
                };
                readonly nullable: true;
                readonly example: {
                    readonly name: "green";
                    readonly enabled: true;
                };
            };
            readonly variants: {
                readonly type: "array";
                readonly description: "The feature variants.";
                readonly items: {
                    readonly $ref: "#/components/schemas/variantSchema";
                };
            };
        };
    }];
};
export declare const playgroundStrategySchema: {
    readonly $id: "#/components/schemas/playgroundStrategySchema";
    readonly type: "object";
    readonly description: "An evaluated feature toggle strategy as used by the Playground";
    readonly additionalProperties: false;
    readonly required: readonly ["id", "name", "result", "segments", "constraints", "parameters", "disabled", "links"];
    readonly properties: {
        readonly name: {
            readonly description: "The strategy's name.";
            readonly type: "string";
        };
        readonly title: {
            readonly type: "string";
            readonly example: "Beta rollout";
            readonly description: "Description of the feature's purpose.";
        };
        readonly id: {
            readonly description: "The strategy's id.";
            readonly type: "string";
            readonly example: "3AECCF7E-FF82-4174-8287-8EBE06079A50";
        };
        readonly result: {
            readonly anyOf: readonly [{
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["evaluationStatus", "enabled"];
                readonly properties: {
                    readonly evaluationStatus: {
                        readonly type: "string";
                        readonly description: "Signals that this strategy could not be evaluated. This is most likely because you're using a custom strategy that Unleash doesn't know about.";
                        readonly enum: readonly ["incomplete"];
                    };
                    readonly enabled: {
                        readonly description: "Whether this strategy resolves to `false` or if it might resolve to `true`. Because Unleash can't evaluate the strategy, it can't say for certain whether it will be `true`, but if you have failing constraints or segments, it _can_ determine that your strategy would be `false`.";
                        readonly anyOf: readonly [{
                            readonly type: "boolean";
                            readonly enum: readonly [false];
                        }, {
                            readonly type: "string";
                            readonly enum: readonly ["unknown"];
                        }];
                    };
                };
            }, {
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["evaluationStatus", "enabled"];
                readonly properties: {
                    readonly evaluationStatus: {
                        readonly description: "Signals that this strategy was evaluated successfully.";
                        readonly type: "string";
                        readonly enum: readonly ["complete"];
                    };
                    readonly enabled: {
                        readonly type: "boolean";
                        readonly description: "Whether this strategy evaluates to true or not.";
                    };
                    readonly variant: {
                        readonly description: "The feature variant you receive based on the provided context or the _disabled\n                          variant_. If a feature is disabled or doesn't have any\n                          variants, you would get the _disabled variant_.\n                          Otherwise, you'll get one of the feature's defined variants.";
                        readonly type: "object";
                        readonly additionalProperties: false;
                        readonly required: readonly ["name", "enabled"];
                        readonly properties: {
                            readonly name: {
                                readonly type: "string";
                                readonly description: "The variant's name. If there is no variant or if the toggle is disabled, this will be `disabled`";
                                readonly example: "red-variant";
                            };
                            readonly enabled: {
                                readonly type: "boolean";
                                readonly description: "Whether the variant is enabled or not. If the feature is disabled or if it doesn't have variants, this property will be `false`";
                            };
                            readonly payload: {
                                readonly type: "object";
                                readonly additionalProperties: false;
                                readonly required: readonly ["type", "value"];
                                readonly description: "An optional payload attached to the variant.";
                                readonly properties: {
                                    readonly type: {
                                        readonly description: "The format of the payload.";
                                        readonly type: "string";
                                        readonly enum: readonly ["json", "csv", "string"];
                                    };
                                    readonly value: {
                                        readonly type: "string";
                                        readonly description: "The payload value stringified.";
                                        readonly example: "{\"property\": \"value\"}";
                                    };
                                };
                            };
                        };
                        readonly nullable: true;
                        readonly example: {
                            readonly name: "green";
                            readonly enabled: true;
                        };
                    };
                    readonly variants: {
                        readonly type: "array";
                        readonly description: "The feature variants.";
                        readonly items: {
                            readonly $ref: "#/components/schemas/variantSchema";
                        };
                    };
                };
            }];
            readonly description: "The strategy's evaluation result. If the strategy is a custom strategy that Unleash can't evaluate, `evaluationStatus` will be `unknown`. Otherwise, it will be `true` or `false`";
        };
        readonly disabled: {
            readonly type: "boolean";
            readonly description: "The strategy's status. Disabled strategies are not evaluated";
            readonly example: false;
            readonly nullable: true;
        };
        readonly segments: {
            readonly type: "array";
            readonly description: "The strategy's segments and their evaluation results.";
            readonly items: {
                readonly $ref: "#/components/schemas/playgroundSegmentSchema";
            };
        };
        readonly constraints: {
            readonly type: "array";
            readonly description: "The strategy's constraints and their evaluation results.";
            readonly items: {
                readonly $ref: "#/components/schemas/playgroundConstraintSchema";
            };
        };
        readonly parameters: {
            readonly description: "The strategy's constraints and their evaluation results.";
            readonly example: {
                readonly myParam1: "param value";
            };
            readonly $ref: "#/components/schemas/parametersSchema";
        };
        readonly links: {
            readonly description: "A set of links to actions you can perform on this strategy";
            readonly type: "object";
            readonly required: readonly ["edit"];
            readonly properties: {
                readonly edit: {
                    readonly type: "string";
                    readonly example: "/projects/some-project/features/some-feature/strategies/edit?environmentId=some-env&strategyId= 3AECCF7E-FF82-4174-8287-8EBE06079A50";
                };
            };
        };
    };
    readonly components: {
        readonly schemas: {
            readonly playgroundConstraintSchema: {
                readonly required: readonly ["contextName", "operator", "result"];
                readonly properties: {
                    readonly result: {
                        readonly description: "Whether this was evaluated as true or false.";
                        readonly type: "boolean";
                    };
                    readonly contextName: {
                        readonly description: "The name of the context field that this constraint should apply to.";
                        readonly example: "appName";
                        readonly type: "string";
                    };
                    readonly operator: {
                        readonly description: "The operator to use when evaluating this constraint. For more information about the various operators, refer to [the strategy constraint operator documentation](https://docs.getunleash.io/reference/strategy-constraints#strategy-constraint-operators).";
                        readonly type: "string";
                        readonly enum: readonly ["NOT_IN", "IN", "STR_ENDS_WITH", "STR_STARTS_WITH", "STR_CONTAINS", "NUM_EQ", "NUM_GT", "NUM_GTE", "NUM_LT", "NUM_LTE", "DATE_AFTER", "DATE_BEFORE", "SEMVER_EQ", "SEMVER_GT", "SEMVER_LT"];
                        readonly example: "IN";
                    };
                    readonly caseInsensitive: {
                        readonly description: "Whether the operator should be case sensitive or not. Defaults to `false` (being case sensitive).";
                        readonly type: "boolean";
                        readonly default: false;
                    };
                    readonly inverted: {
                        readonly description: "Whether the result should be negated or not. If `true`, will turn a `true` result into a `false` result and vice versa.";
                        readonly type: "boolean";
                        readonly default: false;
                    };
                    readonly values: {
                        readonly type: "array";
                        readonly description: "The context values that should be used for constraint evaluation. Use this property instead of `value` for properties that accept multiple values.";
                        readonly items: {
                            readonly type: "string";
                        };
                        readonly example: readonly ["my-app", "my-other-app"];
                    };
                    readonly value: {
                        readonly description: "The context value that should be used for constraint evaluation. Use this property instead of `values` for properties that only accept single values.";
                        readonly type: "string";
                        readonly example: "my-app";
                    };
                };
                readonly type: "object";
                readonly description: "A strategy constraint. For more information, refer to [the strategy constraint reference documentation](https://docs.getunleash.io/reference/strategy-constraints)";
                readonly components: {};
                readonly $id: "#/components/schemas/playgroundConstraintSchema";
                readonly additionalProperties: false;
            };
            readonly playgroundSegmentSchema: {
                readonly $id: "#/components/schemas/playgroundSegmentSchema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly description: "The evaluated result of a segment as used by the Playground.";
                readonly required: readonly ["name", "id", "constraints", "result"];
                readonly properties: {
                    readonly id: {
                        readonly description: "The segment's id.";
                        readonly type: "integer";
                    };
                    readonly name: {
                        readonly description: "The name of the segment.";
                        readonly example: "segment A";
                        readonly type: "string";
                    };
                    readonly result: {
                        readonly description: "Whether this was evaluated as true or false.";
                        readonly type: "boolean";
                    };
                    readonly constraints: {
                        readonly type: "array";
                        readonly description: "The list of constraints in this segment.";
                        readonly items: {
                            readonly $ref: "#/components/schemas/playgroundConstraintSchema";
                        };
                    };
                };
                readonly components: {
                    readonly schemas: {
                        readonly playgroundConstraintSchema: {
                            readonly required: readonly ["contextName", "operator", "result"];
                            readonly properties: {
                                readonly result: {
                                    readonly description: "Whether this was evaluated as true or false.";
                                    readonly type: "boolean";
                                };
                                readonly contextName: {
                                    readonly description: "The name of the context field that this constraint should apply to.";
                                    readonly example: "appName";
                                    readonly type: "string";
                                };
                                readonly operator: {
                                    readonly description: "The operator to use when evaluating this constraint. For more information about the various operators, refer to [the strategy constraint operator documentation](https://docs.getunleash.io/reference/strategy-constraints#strategy-constraint-operators).";
                                    readonly type: "string";
                                    readonly enum: readonly ["NOT_IN", "IN", "STR_ENDS_WITH", "STR_STARTS_WITH", "STR_CONTAINS", "NUM_EQ", "NUM_GT", "NUM_GTE", "NUM_LT", "NUM_LTE", "DATE_AFTER", "DATE_BEFORE", "SEMVER_EQ", "SEMVER_GT", "SEMVER_LT"];
                                    readonly example: "IN";
                                };
                                readonly caseInsensitive: {
                                    readonly description: "Whether the operator should be case sensitive or not. Defaults to `false` (being case sensitive).";
                                    readonly type: "boolean";
                                    readonly default: false;
                                };
                                readonly inverted: {
                                    readonly description: "Whether the result should be negated or not. If `true`, will turn a `true` result into a `false` result and vice versa.";
                                    readonly type: "boolean";
                                    readonly default: false;
                                };
                                readonly values: {
                                    readonly type: "array";
                                    readonly description: "The context values that should be used for constraint evaluation. Use this property instead of `value` for properties that accept multiple values.";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                    readonly example: readonly ["my-app", "my-other-app"];
                                };
                                readonly value: {
                                    readonly description: "The context value that should be used for constraint evaluation. Use this property instead of `values` for properties that only accept single values.";
                                    readonly type: "string";
                                    readonly example: "my-app";
                                };
                            };
                            readonly type: "object";
                            readonly description: "A strategy constraint. For more information, refer to [the strategy constraint reference documentation](https://docs.getunleash.io/reference/strategy-constraints)";
                            readonly components: {};
                            readonly $id: "#/components/schemas/playgroundConstraintSchema";
                            readonly additionalProperties: false;
                        };
                    };
                };
            };
            readonly parametersSchema: {
                readonly $id: "#/components/schemas/parametersSchema";
                readonly type: "object";
                readonly description: "A list of parameters for a strategy";
                readonly additionalProperties: {
                    readonly type: "string";
                };
                readonly components: {};
            };
            readonly variantSchema: {
                readonly $id: "#/components/schemas/variantSchema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly description: "A variant allows for further separation of users into segments. See [our excellent documentation](https://docs.getunleash.io/reference/feature-toggle-variants#what-are-variants) for a more detailed description";
                readonly required: readonly ["name", "weight"];
                readonly properties: {
                    readonly name: {
                        readonly type: "string";
                        readonly description: "The variants name. Is unique for this feature toggle";
                        readonly example: "blue_group";
                    };
                    readonly weight: {
                        readonly type: "number";
                        readonly description: "The weight is the likelihood of any one user getting this variant. It is a number between 0 and 1000. See the section on [variant weights](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight) for more information";
                        readonly minimum: 0;
                        readonly maximum: 1000;
                    };
                    readonly weightType: {
                        readonly description: "Set to fix if this variant must have exactly the weight allocated to it. If the type is variable, the weight will adjust so that the total weight of all variants adds up to 1000";
                        readonly type: "string";
                        readonly example: "variable";
                        readonly enum: readonly ["variable", "fix"];
                    };
                    readonly stickiness: {
                        readonly type: "string";
                        readonly description: "[Stickiness](https://docs.getunleash.io/reference/feature-toggle-variants#variant-stickiness) is how Unleash guarantees that the same user gets the same variant every time";
                        readonly example: "custom.context.field";
                    };
                    readonly payload: {
                        readonly type: "object";
                        readonly required: readonly ["type", "value"];
                        readonly description: "Extra data configured for this variant";
                        readonly additionalProperties: false;
                        readonly properties: {
                            readonly type: {
                                readonly description: "The type of the value. Commonly used types are string, json and csv.";
                                readonly type: "string";
                                readonly enum: readonly ["json", "csv", "string"];
                            };
                            readonly value: {
                                readonly description: "The actual value of payload";
                                readonly type: "string";
                            };
                        };
                        readonly example: {
                            readonly type: "json";
                            readonly value: "{\"color\": \"red\"}";
                        };
                    };
                    readonly overrides: {
                        readonly description: "Overrides assigning specific variants to specific users. The weighting system automatically assigns users to specific groups for you, but any overrides in this list will take precedence.";
                        readonly type: "array";
                        readonly items: {
                            readonly $ref: "#/components/schemas/overrideSchema";
                        };
                    };
                };
                readonly components: {
                    readonly schemas: {
                        readonly overrideSchema: {
                            readonly $id: "#/components/schemas/overrideSchema";
                            readonly type: "object";
                            readonly additionalProperties: false;
                            readonly required: readonly ["contextName", "values"];
                            readonly description: "An override for deciding which variant should be assigned to a user based on the context name";
                            readonly properties: {
                                readonly contextName: {
                                    readonly description: "The name of the context field used to determine overrides";
                                    readonly type: "string";
                                    readonly example: "userId";
                                };
                                readonly values: {
                                    readonly description: "Which values that should be overriden";
                                    readonly type: "array";
                                    readonly items: {
                                        readonly type: "string";
                                    };
                                    readonly example: readonly ["red", "blue"];
                                };
                            };
                            readonly components: {};
                        };
                    };
                };
            };
            readonly overrideSchema: {
                readonly $id: "#/components/schemas/overrideSchema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["contextName", "values"];
                readonly description: "An override for deciding which variant should be assigned to a user based on the context name";
                readonly properties: {
                    readonly contextName: {
                        readonly description: "The name of the context field used to determine overrides";
                        readonly type: "string";
                        readonly example: "userId";
                    };
                    readonly values: {
                        readonly description: "Which values that should be overriden";
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                        readonly example: readonly ["red", "blue"];
                    };
                };
                readonly components: {};
            };
        };
    };
};
export declare type PlaygroundStrategySchema = FromSchema<typeof playgroundStrategySchema>;
