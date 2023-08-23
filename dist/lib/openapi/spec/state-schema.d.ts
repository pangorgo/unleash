import { FromSchema } from 'json-schema-to-ts';
export declare const stateSchema: {
    readonly $id: "#/components/schemas/stateSchema";
    readonly type: "object";
    readonly deprecated: true;
    readonly description: "The application state as used by the deprecated export/import APIs.";
    readonly required: readonly ["version"];
    readonly properties: {
        readonly version: {
            readonly type: "integer";
            readonly description: "The version of the schema used to describe the state";
            readonly example: 1;
        };
        readonly features: {
            readonly type: "array";
            readonly description: "A list of features";
            readonly items: {
                readonly $ref: "#/components/schemas/featureSchema";
            };
        };
        readonly strategies: {
            readonly type: "array";
            readonly description: "A list of strategies";
            readonly items: {
                readonly $ref: "#/components/schemas/strategySchema";
            };
        };
        readonly tags: {
            readonly type: "array";
            readonly description: "A list of tags";
            readonly items: {
                readonly $ref: "#/components/schemas/tagSchema";
            };
        };
        readonly tagTypes: {
            readonly type: "array";
            readonly description: "A list of tag types";
            readonly items: {
                readonly $ref: "#/components/schemas/tagTypeSchema";
            };
        };
        readonly featureTags: {
            readonly type: "array";
            readonly description: "A list of tags applied to features";
            readonly items: {
                readonly $ref: "#/components/schemas/featureTagSchema";
            };
        };
        readonly projects: {
            readonly type: "array";
            readonly description: "A list of projects";
            readonly items: {
                readonly $ref: "#/components/schemas/projectSchema";
            };
        };
        readonly featureStrategies: {
            readonly type: "array";
            readonly description: "A list of feature strategies as applied to features";
            readonly items: {
                readonly $ref: "#/components/schemas/featureStrategySchema";
            };
        };
        readonly featureEnvironments: {
            readonly type: "array";
            readonly description: "A list of feature environment configurations";
            readonly items: {
                readonly $ref: "#/components/schemas/featureEnvironmentSchema";
            };
        };
        readonly environments: {
            readonly type: "array";
            readonly description: "A list of environments";
            readonly items: {
                readonly $ref: "#/components/schemas/environmentSchema";
            };
        };
        readonly segments: {
            readonly type: "array";
            readonly description: "A list of segments";
            readonly items: {
                readonly $ref: "#/components/schemas/segmentSchema";
            };
        };
        readonly featureStrategySegments: {
            readonly type: "array";
            readonly description: "A list of segment/strategy pairings";
            readonly items: {
                readonly $ref: "#/components/schemas/featureStrategySegmentSchema";
            };
        };
    };
    readonly components: {
        readonly schemas: {
            readonly featureSchema: {
                readonly $id: "#/components/schemas/featureSchema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["name"];
                readonly description: "A feature toggle definition";
                readonly properties: {
                    readonly name: {
                        readonly type: "string";
                        readonly example: "disable-comments";
                        readonly description: "Unique feature name";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly example: "kill-switch";
                        readonly description: "Type of the toggle e.g. experiment, kill-switch, release, operational, permission";
                    };
                    readonly description: {
                        readonly type: "string";
                        readonly nullable: true;
                        readonly example: "Controls disabling of the comments section in case of an incident";
                        readonly description: "Detailed description of the feature";
                    };
                    readonly archived: {
                        readonly type: "boolean";
                        readonly example: true;
                        readonly description: "`true` if the feature is archived";
                    };
                    readonly project: {
                        readonly type: "string";
                        readonly example: "dx-squad";
                        readonly description: "Name of the project the feature belongs to";
                    };
                    readonly enabled: {
                        readonly type: "boolean";
                        readonly example: true;
                        readonly description: "`true` if the feature is enabled, otherwise `false`.";
                    };
                    readonly stale: {
                        readonly type: "boolean";
                        readonly example: false;
                        readonly description: "`true` if the feature is stale based on the age and feature type, otherwise `false`.";
                    };
                    readonly favorite: {
                        readonly type: "boolean";
                        readonly example: true;
                        readonly description: "`true` if the feature was favorited, otherwise `false`.";
                    };
                    readonly impressionData: {
                        readonly type: "boolean";
                        readonly example: false;
                        readonly description: "`true` if the impression data collection is enabled for the feature, otherwise `false`.";
                    };
                    readonly createdAt: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly nullable: true;
                        readonly example: "2023-01-28T15:21:39.975Z";
                        readonly description: "The date the feature was created";
                    };
                    readonly archivedAt: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly nullable: true;
                        readonly example: "2023-01-29T15:21:39.975Z";
                        readonly description: "The date the feature was archived";
                    };
                    readonly lastSeenAt: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly nullable: true;
                        readonly deprecated: true;
                        readonly example: "2023-01-28T16:21:39.975Z";
                        readonly description: "The date when metrics where last collected for the feature. This field is deprecated, use the one in featureEnvironmentSchema";
                    };
                    readonly environments: {
                        readonly type: "array";
                        readonly items: {
                            readonly $ref: "#/components/schemas/featureEnvironmentSchema";
                        };
                        readonly description: "The list of environments where the feature can be used";
                    };
                    readonly variants: {
                        readonly type: "array";
                        readonly items: {
                            readonly $ref: "#/components/schemas/variantSchema";
                        };
                        readonly description: "The list of feature variants";
                        readonly deprecated: true;
                    };
                    readonly strategies: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "object";
                        };
                        readonly description: "This is a legacy field that will be deprecated";
                        readonly deprecated: true;
                    };
                    readonly tags: {
                        readonly type: "array";
                        readonly items: {
                            readonly $ref: "#/components/schemas/tagSchema";
                        };
                        readonly nullable: true;
                        readonly description: "The list of feature tags";
                    };
                };
                readonly components: {
                    readonly schemas: {
                        readonly constraintSchema: {
                            readonly type: "object";
                            readonly required: readonly ["contextName", "operator"];
                            readonly description: "A strategy constraint. For more information, refer to [the strategy constraint reference documentation](https://docs.getunleash.io/reference/strategy-constraints)";
                            readonly properties: {
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
                            readonly components: {};
                            readonly $id: "#/components/schemas/constraintSchema";
                            readonly additionalProperties: false;
                        };
                        readonly featureEnvironmentSchema: {
                            readonly $id: "#/components/schemas/featureEnvironmentSchema";
                            readonly type: "object";
                            readonly additionalProperties: false;
                            readonly required: readonly ["name", "enabled"];
                            readonly description: "A detailed description of the feature environment";
                            readonly properties: {
                                readonly name: {
                                    readonly type: "string";
                                    readonly example: "my-dev-env";
                                    readonly description: "The name of the environment";
                                };
                                readonly featureName: {
                                    readonly type: "string";
                                    readonly example: "disable-comments";
                                    readonly description: "The name of the feature";
                                };
                                readonly environment: {
                                    readonly type: "string";
                                    readonly example: "development";
                                    readonly description: "The name of the environment";
                                };
                                readonly type: {
                                    readonly type: "string";
                                    readonly example: "development";
                                    readonly description: "The type of the environment";
                                };
                                readonly enabled: {
                                    readonly type: "boolean";
                                    readonly example: true;
                                    readonly description: "`true` if the feature is enabled for the environment, otherwise `false`.";
                                };
                                readonly sortOrder: {
                                    readonly type: "number";
                                    readonly example: 3;
                                    readonly description: "The sort order of the feature environment in the feature environments list";
                                };
                                readonly variantCount: {
                                    readonly type: "number";
                                    readonly description: "The number of defined variants";
                                };
                                readonly strategies: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly $ref: "#/components/schemas/featureStrategySchema";
                                    };
                                    readonly description: "A list of activation strategies for the feature environment";
                                };
                                readonly variants: {
                                    readonly type: "array";
                                    readonly items: {
                                        readonly $ref: "#/components/schemas/variantSchema";
                                    };
                                    readonly description: "A list of variants for the feature environment";
                                };
                                readonly lastSeenAt: {
                                    readonly type: "string";
                                    readonly format: "date-time";
                                    readonly nullable: true;
                                    readonly example: "2023-01-28T16:21:39.975Z";
                                    readonly description: "The date when metrics where last collected for the feature environment";
                                };
                            };
                            readonly components: {
                                readonly schemas: {
                                    readonly constraintSchema: {
                                        readonly type: "object";
                                        readonly required: readonly ["contextName", "operator"];
                                        readonly description: "A strategy constraint. For more information, refer to [the strategy constraint reference documentation](https://docs.getunleash.io/reference/strategy-constraints)";
                                        readonly properties: {
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
                                        readonly components: {};
                                        readonly $id: "#/components/schemas/constraintSchema";
                                        readonly additionalProperties: false;
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
                                    readonly featureStrategySchema: {
                                        readonly $id: "#/components/schemas/featureStrategySchema";
                                        readonly description: "A single activation strategy configuration schema for a feature";
                                        readonly type: "object";
                                        readonly additionalProperties: false;
                                        readonly required: readonly ["name"];
                                        readonly properties: {
                                            readonly id: {
                                                readonly type: "string";
                                                readonly description: "A uuid for the feature strategy";
                                                readonly example: "6b5157cb-343a-41e7-bfa3-7b4ec3044840";
                                            };
                                            readonly name: {
                                                readonly type: "string";
                                                readonly description: "The name or type of strategy";
                                                readonly example: "flexibleRollout";
                                            };
                                            readonly title: {
                                                readonly type: "string";
                                                readonly description: "A descriptive title for the strategy";
                                                readonly example: "Gradual Rollout 25-Prod";
                                                readonly nullable: true;
                                            };
                                            readonly disabled: {
                                                readonly type: "boolean";
                                                readonly description: "A toggle to disable the strategy. defaults to false. Disabled strategies are not evaluated or returned to the SDKs";
                                                readonly example: false;
                                                readonly nullable: true;
                                            };
                                            readonly featureName: {
                                                readonly type: "string";
                                                readonly description: "The name or feature the strategy is attached to";
                                                readonly example: "myAwesomeFeature";
                                            };
                                            readonly sortOrder: {
                                                readonly type: "number";
                                                readonly description: "The order of the strategy in the list";
                                                readonly example: 9999;
                                            };
                                            readonly segments: {
                                                readonly type: "array";
                                                readonly description: "A list of segment ids attached to the strategy";
                                                readonly example: readonly [1, 2];
                                                readonly items: {
                                                    readonly type: "number";
                                                };
                                            };
                                            readonly constraints: {
                                                readonly type: "array";
                                                readonly description: "A list of the constraints attached to the strategy. See https://docs.getunleash.io/reference/strategy-constraints";
                                                readonly items: {
                                                    readonly $ref: "#/components/schemas/constraintSchema";
                                                };
                                            };
                                            readonly variants: {
                                                readonly type: "array";
                                                readonly description: "Strategy level variants";
                                                readonly items: {
                                                    readonly $ref: "#/components/schemas/strategyVariantSchema";
                                                };
                                            };
                                            readonly parameters: {
                                                readonly $ref: "#/components/schemas/parametersSchema";
                                            };
                                        };
                                        readonly components: {
                                            readonly schemas: {
                                                readonly constraintSchema: {
                                                    readonly type: "object";
                                                    readonly required: readonly ["contextName", "operator"];
                                                    readonly description: "A strategy constraint. For more information, refer to [the strategy constraint reference documentation](https://docs.getunleash.io/reference/strategy-constraints)";
                                                    readonly properties: {
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
                                                    readonly components: {};
                                                    readonly $id: "#/components/schemas/constraintSchema";
                                                    readonly additionalProperties: false;
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
                                                readonly strategyVariantSchema: {
                                                    readonly $id: "#/components/schemas/strategyVariantSchema";
                                                    readonly type: "object";
                                                    readonly additionalProperties: false;
                                                    readonly description: "This is an experimental property. It may change or be removed as we work on it. Please don't depend on it yet. A strategy variant allows you to attach any data to strategies instead of only returning `true`/`false`. Strategy variants take precedence over feature variants.";
                                                    readonly required: readonly ["name", "weight", "weightType", "stickiness"];
                                                    readonly properties: {
                                                        readonly name: {
                                                            readonly type: "string";
                                                            readonly description: "The variant name. Must be unique for this feature toggle";
                                                            readonly example: "blue_group";
                                                        };
                                                        readonly weight: {
                                                            readonly type: "integer";
                                                            readonly description: "The weight is the likelihood of any one user getting this variant. It is an integer between 0 and 1000. See the section on [variant weights](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight) for more information";
                                                            readonly minimum: 0;
                                                            readonly maximum: 1000;
                                                        };
                                                        readonly weightType: {
                                                            readonly description: "Set to `fix` if this variant must have exactly the weight allocated to it. If the type is `variable`, the weight will adjust so that the total weight of all variants adds up to 1000. Refer to the [variant weight documentation](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight).";
                                                            readonly type: "string";
                                                            readonly example: "fix";
                                                            readonly enum: readonly ["variable", "fix"];
                                                        };
                                                        readonly stickiness: {
                                                            readonly type: "string";
                                                            readonly description: "The [stickiness](https://docs.getunleash.io/reference/feature-toggle-variants#variant-stickiness) to use for distribution of this variant. Stickiness is how Unleash guarantees that the same user gets the same variant every time";
                                                            readonly example: "custom.context.field";
                                                        };
                                                        readonly payload: {
                                                            readonly type: "object";
                                                            readonly required: readonly ["type", "value"];
                                                            readonly description: "Extra data configured for this variant";
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
                                                    };
                                                    readonly components: {};
                                                };
                                            };
                                        };
                                    };
                                    readonly strategyVariantSchema: {
                                        readonly $id: "#/components/schemas/strategyVariantSchema";
                                        readonly type: "object";
                                        readonly additionalProperties: false;
                                        readonly description: "This is an experimental property. It may change or be removed as we work on it. Please don't depend on it yet. A strategy variant allows you to attach any data to strategies instead of only returning `true`/`false`. Strategy variants take precedence over feature variants.";
                                        readonly required: readonly ["name", "weight", "weightType", "stickiness"];
                                        readonly properties: {
                                            readonly name: {
                                                readonly type: "string";
                                                readonly description: "The variant name. Must be unique for this feature toggle";
                                                readonly example: "blue_group";
                                            };
                                            readonly weight: {
                                                readonly type: "integer";
                                                readonly description: "The weight is the likelihood of any one user getting this variant. It is an integer between 0 and 1000. See the section on [variant weights](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight) for more information";
                                                readonly minimum: 0;
                                                readonly maximum: 1000;
                                            };
                                            readonly weightType: {
                                                readonly description: "Set to `fix` if this variant must have exactly the weight allocated to it. If the type is `variable`, the weight will adjust so that the total weight of all variants adds up to 1000. Refer to the [variant weight documentation](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight).";
                                                readonly type: "string";
                                                readonly example: "fix";
                                                readonly enum: readonly ["variable", "fix"];
                                            };
                                            readonly stickiness: {
                                                readonly type: "string";
                                                readonly description: "The [stickiness](https://docs.getunleash.io/reference/feature-toggle-variants#variant-stickiness) to use for distribution of this variant. Stickiness is how Unleash guarantees that the same user gets the same variant every time";
                                                readonly example: "custom.context.field";
                                            };
                                            readonly payload: {
                                                readonly type: "object";
                                                readonly required: readonly ["type", "value"];
                                                readonly description: "Extra data configured for this variant";
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
                                };
                            };
                        };
                        readonly featureStrategySchema: {
                            readonly $id: "#/components/schemas/featureStrategySchema";
                            readonly description: "A single activation strategy configuration schema for a feature";
                            readonly type: "object";
                            readonly additionalProperties: false;
                            readonly required: readonly ["name"];
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "A uuid for the feature strategy";
                                    readonly example: "6b5157cb-343a-41e7-bfa3-7b4ec3044840";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "The name or type of strategy";
                                    readonly example: "flexibleRollout";
                                };
                                readonly title: {
                                    readonly type: "string";
                                    readonly description: "A descriptive title for the strategy";
                                    readonly example: "Gradual Rollout 25-Prod";
                                    readonly nullable: true;
                                };
                                readonly disabled: {
                                    readonly type: "boolean";
                                    readonly description: "A toggle to disable the strategy. defaults to false. Disabled strategies are not evaluated or returned to the SDKs";
                                    readonly example: false;
                                    readonly nullable: true;
                                };
                                readonly featureName: {
                                    readonly type: "string";
                                    readonly description: "The name or feature the strategy is attached to";
                                    readonly example: "myAwesomeFeature";
                                };
                                readonly sortOrder: {
                                    readonly type: "number";
                                    readonly description: "The order of the strategy in the list";
                                    readonly example: 9999;
                                };
                                readonly segments: {
                                    readonly type: "array";
                                    readonly description: "A list of segment ids attached to the strategy";
                                    readonly example: readonly [1, 2];
                                    readonly items: {
                                        readonly type: "number";
                                    };
                                };
                                readonly constraints: {
                                    readonly type: "array";
                                    readonly description: "A list of the constraints attached to the strategy. See https://docs.getunleash.io/reference/strategy-constraints";
                                    readonly items: {
                                        readonly $ref: "#/components/schemas/constraintSchema";
                                    };
                                };
                                readonly variants: {
                                    readonly type: "array";
                                    readonly description: "Strategy level variants";
                                    readonly items: {
                                        readonly $ref: "#/components/schemas/strategyVariantSchema";
                                    };
                                };
                                readonly parameters: {
                                    readonly $ref: "#/components/schemas/parametersSchema";
                                };
                            };
                            readonly components: {
                                readonly schemas: {
                                    readonly constraintSchema: {
                                        readonly type: "object";
                                        readonly required: readonly ["contextName", "operator"];
                                        readonly description: "A strategy constraint. For more information, refer to [the strategy constraint reference documentation](https://docs.getunleash.io/reference/strategy-constraints)";
                                        readonly properties: {
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
                                        readonly components: {};
                                        readonly $id: "#/components/schemas/constraintSchema";
                                        readonly additionalProperties: false;
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
                                    readonly strategyVariantSchema: {
                                        readonly $id: "#/components/schemas/strategyVariantSchema";
                                        readonly type: "object";
                                        readonly additionalProperties: false;
                                        readonly description: "This is an experimental property. It may change or be removed as we work on it. Please don't depend on it yet. A strategy variant allows you to attach any data to strategies instead of only returning `true`/`false`. Strategy variants take precedence over feature variants.";
                                        readonly required: readonly ["name", "weight", "weightType", "stickiness"];
                                        readonly properties: {
                                            readonly name: {
                                                readonly type: "string";
                                                readonly description: "The variant name. Must be unique for this feature toggle";
                                                readonly example: "blue_group";
                                            };
                                            readonly weight: {
                                                readonly type: "integer";
                                                readonly description: "The weight is the likelihood of any one user getting this variant. It is an integer between 0 and 1000. See the section on [variant weights](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight) for more information";
                                                readonly minimum: 0;
                                                readonly maximum: 1000;
                                            };
                                            readonly weightType: {
                                                readonly description: "Set to `fix` if this variant must have exactly the weight allocated to it. If the type is `variable`, the weight will adjust so that the total weight of all variants adds up to 1000. Refer to the [variant weight documentation](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight).";
                                                readonly type: "string";
                                                readonly example: "fix";
                                                readonly enum: readonly ["variable", "fix"];
                                            };
                                            readonly stickiness: {
                                                readonly type: "string";
                                                readonly description: "The [stickiness](https://docs.getunleash.io/reference/feature-toggle-variants#variant-stickiness) to use for distribution of this variant. Stickiness is how Unleash guarantees that the same user gets the same variant every time";
                                                readonly example: "custom.context.field";
                                            };
                                            readonly payload: {
                                                readonly type: "object";
                                                readonly required: readonly ["type", "value"];
                                                readonly description: "Extra data configured for this variant";
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
                                        };
                                        readonly components: {};
                                    };
                                };
                            };
                        };
                        readonly strategyVariantSchema: {
                            readonly $id: "#/components/schemas/strategyVariantSchema";
                            readonly type: "object";
                            readonly additionalProperties: false;
                            readonly description: "This is an experimental property. It may change or be removed as we work on it. Please don't depend on it yet. A strategy variant allows you to attach any data to strategies instead of only returning `true`/`false`. Strategy variants take precedence over feature variants.";
                            readonly required: readonly ["name", "weight", "weightType", "stickiness"];
                            readonly properties: {
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "The variant name. Must be unique for this feature toggle";
                                    readonly example: "blue_group";
                                };
                                readonly weight: {
                                    readonly type: "integer";
                                    readonly description: "The weight is the likelihood of any one user getting this variant. It is an integer between 0 and 1000. See the section on [variant weights](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight) for more information";
                                    readonly minimum: 0;
                                    readonly maximum: 1000;
                                };
                                readonly weightType: {
                                    readonly description: "Set to `fix` if this variant must have exactly the weight allocated to it. If the type is `variable`, the weight will adjust so that the total weight of all variants adds up to 1000. Refer to the [variant weight documentation](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight).";
                                    readonly type: "string";
                                    readonly example: "fix";
                                    readonly enum: readonly ["variable", "fix"];
                                };
                                readonly stickiness: {
                                    readonly type: "string";
                                    readonly description: "The [stickiness](https://docs.getunleash.io/reference/feature-toggle-variants#variant-stickiness) to use for distribution of this variant. Stickiness is how Unleash guarantees that the same user gets the same variant every time";
                                    readonly example: "custom.context.field";
                                };
                                readonly payload: {
                                    readonly type: "object";
                                    readonly required: readonly ["type", "value"];
                                    readonly description: "Extra data configured for this variant";
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
                            };
                            readonly components: {};
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
                        readonly tagSchema: {
                            readonly $id: "#/components/schemas/tagSchema";
                            readonly type: "object";
                            readonly description: "Representation of a [tag](https://docs.getunleash.io/reference/tags)";
                            readonly additionalProperties: false;
                            readonly required: readonly ["value", "type"];
                            readonly properties: {
                                readonly value: {
                                    readonly type: "string";
                                    readonly minLength: 2;
                                    readonly maxLength: 50;
                                    readonly description: "The value of the tag";
                                    readonly example: "a-tag-value";
                                };
                                readonly type: {
                                    readonly type: "string";
                                    readonly minLength: 2;
                                    readonly maxLength: 50;
                                    readonly default: "simple";
                                    readonly description: "The [type](https://docs.getunleash.io/reference/tags#tag-types) of the tag";
                                    readonly example: "simple";
                                };
                            };
                            readonly components: {};
                        };
                    };
                };
            };
            readonly tagSchema: {
                readonly $id: "#/components/schemas/tagSchema";
                readonly type: "object";
                readonly description: "Representation of a [tag](https://docs.getunleash.io/reference/tags)";
                readonly additionalProperties: false;
                readonly required: readonly ["value", "type"];
                readonly properties: {
                    readonly value: {
                        readonly type: "string";
                        readonly minLength: 2;
                        readonly maxLength: 50;
                        readonly description: "The value of the tag";
                        readonly example: "a-tag-value";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly minLength: 2;
                        readonly maxLength: 50;
                        readonly default: "simple";
                        readonly description: "The [type](https://docs.getunleash.io/reference/tags#tag-types) of the tag";
                        readonly example: "simple";
                    };
                };
                readonly components: {};
            };
            readonly tagTypeSchema: {
                readonly $id: "#/components/schemas/tagTypeSchema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly description: "A tag type.";
                readonly required: readonly ["name"];
                readonly properties: {
                    readonly name: {
                        readonly type: "string";
                        readonly description: "The name of the tag type.";
                        readonly example: "color";
                    };
                    readonly description: {
                        readonly type: "string";
                        readonly description: "The description of the tag type.";
                        readonly example: "A tag type for describing the color of a tag.";
                    };
                    readonly icon: {
                        readonly type: "string";
                        readonly nullable: true;
                        readonly description: "The icon of the tag type.";
                        readonly example: "not-really-used";
                    };
                };
                readonly components: {};
            };
            readonly featureTagSchema: {
                readonly $id: "#/components/schemas/featureTagSchema";
                readonly type: "object";
                readonly description: "Describes a tag applied to a feature";
                readonly additionalProperties: false;
                readonly required: readonly ["featureName", "tagValue"];
                readonly properties: {
                    readonly featureName: {
                        readonly type: "string";
                        readonly example: "my-feature";
                        readonly description: "The name of the feature this tag is applied to";
                    };
                    readonly tagType: {
                        readonly type: "string";
                        readonly example: "simple";
                        readonly description: "The [type](https://docs.getunleash.io/reference/tags#tag-types tag types) of the tag";
                    };
                    readonly tagValue: {
                        readonly type: "string";
                        readonly example: "my-tag";
                        readonly description: "The value of the tag";
                    };
                    readonly type: {
                        readonly deprecated: true;
                        readonly type: "string";
                        readonly description: "The [type](https://docs.getunleash.io/reference/tags#tag-types tag types) of the tag. This property is deprecated and will be removed in a future version of Unleash. Superseded by the `tagType` property.";
                    };
                    readonly value: {
                        readonly deprecated: true;
                        readonly type: "string";
                        readonly description: "The value of the tag. This property is deprecated and will be removed in a future version of Unleash. Superseded by the `tagValue` property.";
                    };
                };
                readonly components: {};
            };
            readonly projectSchema: {
                readonly $id: "#/components/schemas/projectSchema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["id", "name"];
                readonly description: "A definition of the project used for projects listing purposes";
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly example: "dx-squad";
                        readonly description: "The id of this project";
                    };
                    readonly name: {
                        readonly type: "string";
                        readonly example: "DX-Squad";
                        readonly description: "The name of this project";
                    };
                    readonly description: {
                        readonly type: "string";
                        readonly nullable: true;
                        readonly example: "DX squad feature release";
                        readonly description: "Additional information about the project";
                    };
                    readonly health: {
                        readonly type: "number";
                        readonly example: 50;
                        readonly description: "An indicator of the [project's health](https://docs.getunleash.io/reference/technical-debt#health-rating) on a scale from 0 to 100";
                    };
                    readonly featureCount: {
                        readonly type: "number";
                        readonly example: 10;
                        readonly description: "The number of features this project has";
                    };
                    readonly memberCount: {
                        readonly type: "number";
                        readonly example: 4;
                        readonly description: "The number of members this project has";
                    };
                    readonly createdAt: {
                        readonly type: "string";
                        readonly description: "When this project was created.";
                        readonly example: "2023-07-27T12:12:28Z";
                        readonly format: "date-time";
                    };
                    readonly updatedAt: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly nullable: true;
                        readonly description: "When this project was last updated.";
                        readonly example: "2023-07-28T12:12:28Z";
                    };
                    readonly favorite: {
                        readonly type: "boolean";
                        readonly example: true;
                        readonly description: "`true` if the project was favorited, otherwise `false`.";
                    };
                    readonly mode: {
                        readonly type: "string";
                        readonly enum: readonly ["open", "protected"];
                        readonly example: "open";
                        readonly description: "The project's [collaboration mode](https://docs.getunleash.io/reference/project-collaboration-mode). Determines whether non-project members can submit change requests or not.";
                    };
                    readonly defaultStickiness: {
                        readonly type: "string";
                        readonly example: "userId";
                        readonly description: "A default stickiness for the project affecting the default stickiness value for variants and Gradual Rollout strategy";
                    };
                };
                readonly components: {};
            };
            readonly featureStrategySchema: {
                readonly $id: "#/components/schemas/featureStrategySchema";
                readonly description: "A single activation strategy configuration schema for a feature";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["name"];
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "A uuid for the feature strategy";
                        readonly example: "6b5157cb-343a-41e7-bfa3-7b4ec3044840";
                    };
                    readonly name: {
                        readonly type: "string";
                        readonly description: "The name or type of strategy";
                        readonly example: "flexibleRollout";
                    };
                    readonly title: {
                        readonly type: "string";
                        readonly description: "A descriptive title for the strategy";
                        readonly example: "Gradual Rollout 25-Prod";
                        readonly nullable: true;
                    };
                    readonly disabled: {
                        readonly type: "boolean";
                        readonly description: "A toggle to disable the strategy. defaults to false. Disabled strategies are not evaluated or returned to the SDKs";
                        readonly example: false;
                        readonly nullable: true;
                    };
                    readonly featureName: {
                        readonly type: "string";
                        readonly description: "The name or feature the strategy is attached to";
                        readonly example: "myAwesomeFeature";
                    };
                    readonly sortOrder: {
                        readonly type: "number";
                        readonly description: "The order of the strategy in the list";
                        readonly example: 9999;
                    };
                    readonly segments: {
                        readonly type: "array";
                        readonly description: "A list of segment ids attached to the strategy";
                        readonly example: readonly [1, 2];
                        readonly items: {
                            readonly type: "number";
                        };
                    };
                    readonly constraints: {
                        readonly type: "array";
                        readonly description: "A list of the constraints attached to the strategy. See https://docs.getunleash.io/reference/strategy-constraints";
                        readonly items: {
                            readonly $ref: "#/components/schemas/constraintSchema";
                        };
                    };
                    readonly variants: {
                        readonly type: "array";
                        readonly description: "Strategy level variants";
                        readonly items: {
                            readonly $ref: "#/components/schemas/strategyVariantSchema";
                        };
                    };
                    readonly parameters: {
                        readonly $ref: "#/components/schemas/parametersSchema";
                    };
                };
                readonly components: {
                    readonly schemas: {
                        readonly constraintSchema: {
                            readonly type: "object";
                            readonly required: readonly ["contextName", "operator"];
                            readonly description: "A strategy constraint. For more information, refer to [the strategy constraint reference documentation](https://docs.getunleash.io/reference/strategy-constraints)";
                            readonly properties: {
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
                            readonly components: {};
                            readonly $id: "#/components/schemas/constraintSchema";
                            readonly additionalProperties: false;
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
                        readonly strategyVariantSchema: {
                            readonly $id: "#/components/schemas/strategyVariantSchema";
                            readonly type: "object";
                            readonly additionalProperties: false;
                            readonly description: "This is an experimental property. It may change or be removed as we work on it. Please don't depend on it yet. A strategy variant allows you to attach any data to strategies instead of only returning `true`/`false`. Strategy variants take precedence over feature variants.";
                            readonly required: readonly ["name", "weight", "weightType", "stickiness"];
                            readonly properties: {
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "The variant name. Must be unique for this feature toggle";
                                    readonly example: "blue_group";
                                };
                                readonly weight: {
                                    readonly type: "integer";
                                    readonly description: "The weight is the likelihood of any one user getting this variant. It is an integer between 0 and 1000. See the section on [variant weights](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight) for more information";
                                    readonly minimum: 0;
                                    readonly maximum: 1000;
                                };
                                readonly weightType: {
                                    readonly description: "Set to `fix` if this variant must have exactly the weight allocated to it. If the type is `variable`, the weight will adjust so that the total weight of all variants adds up to 1000. Refer to the [variant weight documentation](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight).";
                                    readonly type: "string";
                                    readonly example: "fix";
                                    readonly enum: readonly ["variable", "fix"];
                                };
                                readonly stickiness: {
                                    readonly type: "string";
                                    readonly description: "The [stickiness](https://docs.getunleash.io/reference/feature-toggle-variants#variant-stickiness) to use for distribution of this variant. Stickiness is how Unleash guarantees that the same user gets the same variant every time";
                                    readonly example: "custom.context.field";
                                };
                                readonly payload: {
                                    readonly type: "object";
                                    readonly required: readonly ["type", "value"];
                                    readonly description: "Extra data configured for this variant";
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
                            };
                            readonly components: {};
                        };
                    };
                };
            };
            readonly strategyVariantSchema: {
                readonly $id: "#/components/schemas/strategyVariantSchema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly description: "This is an experimental property. It may change or be removed as we work on it. Please don't depend on it yet. A strategy variant allows you to attach any data to strategies instead of only returning `true`/`false`. Strategy variants take precedence over feature variants.";
                readonly required: readonly ["name", "weight", "weightType", "stickiness"];
                readonly properties: {
                    readonly name: {
                        readonly type: "string";
                        readonly description: "The variant name. Must be unique for this feature toggle";
                        readonly example: "blue_group";
                    };
                    readonly weight: {
                        readonly type: "integer";
                        readonly description: "The weight is the likelihood of any one user getting this variant. It is an integer between 0 and 1000. See the section on [variant weights](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight) for more information";
                        readonly minimum: 0;
                        readonly maximum: 1000;
                    };
                    readonly weightType: {
                        readonly description: "Set to `fix` if this variant must have exactly the weight allocated to it. If the type is `variable`, the weight will adjust so that the total weight of all variants adds up to 1000. Refer to the [variant weight documentation](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight).";
                        readonly type: "string";
                        readonly example: "fix";
                        readonly enum: readonly ["variable", "fix"];
                    };
                    readonly stickiness: {
                        readonly type: "string";
                        readonly description: "The [stickiness](https://docs.getunleash.io/reference/feature-toggle-variants#variant-stickiness) to use for distribution of this variant. Stickiness is how Unleash guarantees that the same user gets the same variant every time";
                        readonly example: "custom.context.field";
                    };
                    readonly payload: {
                        readonly type: "object";
                        readonly required: readonly ["type", "value"];
                        readonly description: "Extra data configured for this variant";
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
                };
                readonly components: {};
            };
            readonly featureEnvironmentSchema: {
                readonly $id: "#/components/schemas/featureEnvironmentSchema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["name", "enabled"];
                readonly description: "A detailed description of the feature environment";
                readonly properties: {
                    readonly name: {
                        readonly type: "string";
                        readonly example: "my-dev-env";
                        readonly description: "The name of the environment";
                    };
                    readonly featureName: {
                        readonly type: "string";
                        readonly example: "disable-comments";
                        readonly description: "The name of the feature";
                    };
                    readonly environment: {
                        readonly type: "string";
                        readonly example: "development";
                        readonly description: "The name of the environment";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly example: "development";
                        readonly description: "The type of the environment";
                    };
                    readonly enabled: {
                        readonly type: "boolean";
                        readonly example: true;
                        readonly description: "`true` if the feature is enabled for the environment, otherwise `false`.";
                    };
                    readonly sortOrder: {
                        readonly type: "number";
                        readonly example: 3;
                        readonly description: "The sort order of the feature environment in the feature environments list";
                    };
                    readonly variantCount: {
                        readonly type: "number";
                        readonly description: "The number of defined variants";
                    };
                    readonly strategies: {
                        readonly type: "array";
                        readonly items: {
                            readonly $ref: "#/components/schemas/featureStrategySchema";
                        };
                        readonly description: "A list of activation strategies for the feature environment";
                    };
                    readonly variants: {
                        readonly type: "array";
                        readonly items: {
                            readonly $ref: "#/components/schemas/variantSchema";
                        };
                        readonly description: "A list of variants for the feature environment";
                    };
                    readonly lastSeenAt: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly nullable: true;
                        readonly example: "2023-01-28T16:21:39.975Z";
                        readonly description: "The date when metrics where last collected for the feature environment";
                    };
                };
                readonly components: {
                    readonly schemas: {
                        readonly constraintSchema: {
                            readonly type: "object";
                            readonly required: readonly ["contextName", "operator"];
                            readonly description: "A strategy constraint. For more information, refer to [the strategy constraint reference documentation](https://docs.getunleash.io/reference/strategy-constraints)";
                            readonly properties: {
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
                            readonly components: {};
                            readonly $id: "#/components/schemas/constraintSchema";
                            readonly additionalProperties: false;
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
                        readonly featureStrategySchema: {
                            readonly $id: "#/components/schemas/featureStrategySchema";
                            readonly description: "A single activation strategy configuration schema for a feature";
                            readonly type: "object";
                            readonly additionalProperties: false;
                            readonly required: readonly ["name"];
                            readonly properties: {
                                readonly id: {
                                    readonly type: "string";
                                    readonly description: "A uuid for the feature strategy";
                                    readonly example: "6b5157cb-343a-41e7-bfa3-7b4ec3044840";
                                };
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "The name or type of strategy";
                                    readonly example: "flexibleRollout";
                                };
                                readonly title: {
                                    readonly type: "string";
                                    readonly description: "A descriptive title for the strategy";
                                    readonly example: "Gradual Rollout 25-Prod";
                                    readonly nullable: true;
                                };
                                readonly disabled: {
                                    readonly type: "boolean";
                                    readonly description: "A toggle to disable the strategy. defaults to false. Disabled strategies are not evaluated or returned to the SDKs";
                                    readonly example: false;
                                    readonly nullable: true;
                                };
                                readonly featureName: {
                                    readonly type: "string";
                                    readonly description: "The name or feature the strategy is attached to";
                                    readonly example: "myAwesomeFeature";
                                };
                                readonly sortOrder: {
                                    readonly type: "number";
                                    readonly description: "The order of the strategy in the list";
                                    readonly example: 9999;
                                };
                                readonly segments: {
                                    readonly type: "array";
                                    readonly description: "A list of segment ids attached to the strategy";
                                    readonly example: readonly [1, 2];
                                    readonly items: {
                                        readonly type: "number";
                                    };
                                };
                                readonly constraints: {
                                    readonly type: "array";
                                    readonly description: "A list of the constraints attached to the strategy. See https://docs.getunleash.io/reference/strategy-constraints";
                                    readonly items: {
                                        readonly $ref: "#/components/schemas/constraintSchema";
                                    };
                                };
                                readonly variants: {
                                    readonly type: "array";
                                    readonly description: "Strategy level variants";
                                    readonly items: {
                                        readonly $ref: "#/components/schemas/strategyVariantSchema";
                                    };
                                };
                                readonly parameters: {
                                    readonly $ref: "#/components/schemas/parametersSchema";
                                };
                            };
                            readonly components: {
                                readonly schemas: {
                                    readonly constraintSchema: {
                                        readonly type: "object";
                                        readonly required: readonly ["contextName", "operator"];
                                        readonly description: "A strategy constraint. For more information, refer to [the strategy constraint reference documentation](https://docs.getunleash.io/reference/strategy-constraints)";
                                        readonly properties: {
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
                                        readonly components: {};
                                        readonly $id: "#/components/schemas/constraintSchema";
                                        readonly additionalProperties: false;
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
                                    readonly strategyVariantSchema: {
                                        readonly $id: "#/components/schemas/strategyVariantSchema";
                                        readonly type: "object";
                                        readonly additionalProperties: false;
                                        readonly description: "This is an experimental property. It may change or be removed as we work on it. Please don't depend on it yet. A strategy variant allows you to attach any data to strategies instead of only returning `true`/`false`. Strategy variants take precedence over feature variants.";
                                        readonly required: readonly ["name", "weight", "weightType", "stickiness"];
                                        readonly properties: {
                                            readonly name: {
                                                readonly type: "string";
                                                readonly description: "The variant name. Must be unique for this feature toggle";
                                                readonly example: "blue_group";
                                            };
                                            readonly weight: {
                                                readonly type: "integer";
                                                readonly description: "The weight is the likelihood of any one user getting this variant. It is an integer between 0 and 1000. See the section on [variant weights](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight) for more information";
                                                readonly minimum: 0;
                                                readonly maximum: 1000;
                                            };
                                            readonly weightType: {
                                                readonly description: "Set to `fix` if this variant must have exactly the weight allocated to it. If the type is `variable`, the weight will adjust so that the total weight of all variants adds up to 1000. Refer to the [variant weight documentation](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight).";
                                                readonly type: "string";
                                                readonly example: "fix";
                                                readonly enum: readonly ["variable", "fix"];
                                            };
                                            readonly stickiness: {
                                                readonly type: "string";
                                                readonly description: "The [stickiness](https://docs.getunleash.io/reference/feature-toggle-variants#variant-stickiness) to use for distribution of this variant. Stickiness is how Unleash guarantees that the same user gets the same variant every time";
                                                readonly example: "custom.context.field";
                                            };
                                            readonly payload: {
                                                readonly type: "object";
                                                readonly required: readonly ["type", "value"];
                                                readonly description: "Extra data configured for this variant";
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
                                        };
                                        readonly components: {};
                                    };
                                };
                            };
                        };
                        readonly strategyVariantSchema: {
                            readonly $id: "#/components/schemas/strategyVariantSchema";
                            readonly type: "object";
                            readonly additionalProperties: false;
                            readonly description: "This is an experimental property. It may change or be removed as we work on it. Please don't depend on it yet. A strategy variant allows you to attach any data to strategies instead of only returning `true`/`false`. Strategy variants take precedence over feature variants.";
                            readonly required: readonly ["name", "weight", "weightType", "stickiness"];
                            readonly properties: {
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "The variant name. Must be unique for this feature toggle";
                                    readonly example: "blue_group";
                                };
                                readonly weight: {
                                    readonly type: "integer";
                                    readonly description: "The weight is the likelihood of any one user getting this variant. It is an integer between 0 and 1000. See the section on [variant weights](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight) for more information";
                                    readonly minimum: 0;
                                    readonly maximum: 1000;
                                };
                                readonly weightType: {
                                    readonly description: "Set to `fix` if this variant must have exactly the weight allocated to it. If the type is `variable`, the weight will adjust so that the total weight of all variants adds up to 1000. Refer to the [variant weight documentation](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight).";
                                    readonly type: "string";
                                    readonly example: "fix";
                                    readonly enum: readonly ["variable", "fix"];
                                };
                                readonly stickiness: {
                                    readonly type: "string";
                                    readonly description: "The [stickiness](https://docs.getunleash.io/reference/feature-toggle-variants#variant-stickiness) to use for distribution of this variant. Stickiness is how Unleash guarantees that the same user gets the same variant every time";
                                    readonly example: "custom.context.field";
                                };
                                readonly payload: {
                                    readonly type: "object";
                                    readonly required: readonly ["type", "value"];
                                    readonly description: "Extra data configured for this variant";
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
                    };
                };
            };
            readonly environmentSchema: {
                readonly $id: "#/components/schemas/environmentSchema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["name", "type", "enabled", "protected", "sortOrder"];
                readonly description: "A definition of the project environment";
                readonly properties: {
                    readonly name: {
                        readonly type: "string";
                        readonly example: "my-dev-env";
                        readonly description: "The name of the environment";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly example: "development";
                        readonly description: "The [type of environment](https://docs.getunleash.io/reference/environments#environment-types).";
                    };
                    readonly enabled: {
                        readonly type: "boolean";
                        readonly example: true;
                        readonly description: "`true` if the environment is enabled for the project, otherwise `false`.";
                    };
                    readonly protected: {
                        readonly type: "boolean";
                        readonly example: true;
                        readonly description: "`true` if the environment is protected, otherwise `false`. A *protected* environment can not be deleted.";
                    };
                    readonly sortOrder: {
                        readonly type: "integer";
                        readonly example: 3;
                        readonly description: "Priority of the environment in a list of environments, the lower the value, the higher up in the list the environment will appear. Needs to be an integer";
                    };
                    readonly projectCount: {
                        readonly type: "integer";
                        readonly nullable: true;
                        readonly minimum: 0;
                        readonly example: 10;
                        readonly description: "The number of projects with this environment";
                    };
                    readonly apiTokenCount: {
                        readonly type: "integer";
                        readonly nullable: true;
                        readonly minimum: 0;
                        readonly example: 6;
                        readonly description: "The number of API tokens for the project environment";
                    };
                    readonly enabledToggleCount: {
                        readonly type: "integer";
                        readonly nullable: true;
                        readonly minimum: 0;
                        readonly example: 10;
                        readonly description: "The number of enabled toggles for the project environment";
                    };
                };
                readonly components: {};
            };
            readonly segmentSchema: {
                readonly $id: "#/components/schemas/segmentSchema";
                readonly type: "object";
                readonly description: "Represents a segment of users defined by a set of constraints.";
                readonly additionalProperties: false;
                readonly required: readonly ["id", "constraints"];
                readonly properties: {
                    readonly description: {
                        readonly type: "string";
                        readonly nullable: true;
                        readonly description: "The description of the segment.";
                        readonly example: "Segment A description";
                    };
                    readonly createdAt: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly description: "The time the segment was created as a RFC 3339-conformant timestamp.";
                        readonly example: "2023-07-05T12:56:00.000Z";
                    };
                    readonly createdBy: {
                        readonly type: "string";
                        readonly description: "Which user created this segment";
                        readonly example: "johndoe";
                    };
                    readonly project: {
                        readonly type: "string";
                        readonly nullable: true;
                        readonly description: "The project the segment relates to, if applicable.";
                        readonly example: "default";
                    };
                    readonly id: {
                        readonly type: "number";
                        readonly description: "The segment's id.";
                    };
                    readonly name: {
                        readonly type: "string";
                        readonly description: "The name of the segment.";
                        readonly example: "segment A";
                    };
                    readonly constraints: {
                        readonly type: "array";
                        readonly description: "List of constraints that determine which users are part of the segment";
                        readonly items: {
                            readonly $ref: "#/components/schemas/constraintSchema";
                        };
                    };
                };
                readonly components: {
                    readonly schemas: {
                        readonly constraintSchema: {
                            readonly type: "object";
                            readonly required: readonly ["contextName", "operator"];
                            readonly description: "A strategy constraint. For more information, refer to [the strategy constraint reference documentation](https://docs.getunleash.io/reference/strategy-constraints)";
                            readonly properties: {
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
                            readonly components: {};
                            readonly $id: "#/components/schemas/constraintSchema";
                            readonly additionalProperties: false;
                        };
                    };
                };
            };
            readonly featureStrategySegmentSchema: {
                readonly $id: "#/components/schemas/featureStrategySegmentSchema";
                readonly type: "object";
                readonly description: "An object containing a segment identifier and a strategy identifier.";
                readonly additionalProperties: false;
                readonly required: readonly ["segmentId", "featureStrategyId"];
                readonly properties: {
                    readonly segmentId: {
                        readonly type: "integer";
                        readonly description: "The ID of the segment";
                        readonly example: 2;
                    };
                    readonly featureStrategyId: {
                        readonly type: "string";
                        readonly description: "The ID of the strategy";
                        readonly example: "e2caa08f-30c4-4aa3-b955-54ca9e93dc13";
                    };
                };
                readonly components: {};
            };
            readonly strategySchema: {
                readonly $id: "#/components/schemas/strategySchema";
                readonly description: "The [activation strategy](https://docs.getunleash.io/reference/activation-strategies) schema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["name", "displayName", "description", "editable", "deprecated", "parameters"];
                readonly properties: {
                    readonly title: {
                        readonly type: "string";
                        readonly nullable: true;
                        readonly description: "An optional title for the strategy";
                        readonly example: "GradualRollout - Prod25";
                    };
                    readonly name: {
                        readonly type: "string";
                        readonly description: "The name (type) of the strategy";
                        readonly example: "flexibleRollout";
                    };
                    readonly displayName: {
                        readonly type: "string";
                        readonly description: "A human friendly name for the strategy";
                        readonly example: "Gradual Rollout";
                        readonly nullable: true;
                    };
                    readonly description: {
                        readonly type: "string";
                        readonly nullable: true;
                        readonly description: "A short description of the strategy";
                        readonly example: "Gradual rollout to logged in users";
                    };
                    readonly editable: {
                        readonly type: "boolean";
                        readonly description: "Whether the strategy can be edited or not. Strategies bundled with Unleash cannot be edited.";
                        readonly example: true;
                    };
                    readonly deprecated: {
                        readonly type: "boolean";
                        readonly description: "";
                        readonly example: true;
                    };
                    readonly parameters: {
                        readonly type: "array";
                        readonly description: "A list of relevant parameters for each strategy";
                        readonly items: {
                            readonly type: "object";
                            readonly additionalProperties: false;
                            readonly properties: {
                                readonly name: {
                                    readonly type: "string";
                                    readonly example: "percentage";
                                };
                                readonly type: {
                                    readonly type: "string";
                                    readonly example: "percentage";
                                };
                                readonly description: {
                                    readonly type: "string";
                                    readonly example: "Gradual rollout to logged in users";
                                };
                                readonly required: {
                                    readonly type: "boolean";
                                    readonly example: true;
                                };
                            };
                        };
                    };
                };
                readonly components: {};
            };
        };
    };
};
export declare type StateSchema = FromSchema<typeof stateSchema>;
