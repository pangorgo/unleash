import { FromSchema } from 'json-schema-to-ts';
export declare const upsertSegmentSchema: {
    readonly $id: "#/components/schemas/upsertSegmentSchema";
    readonly type: "object";
    readonly description: "Represents a segment of users defined by a set of constraints.";
    readonly required: readonly ["name", "constraints"];
    readonly properties: {
        readonly name: {
            readonly type: "string";
            readonly description: "The name of the segment.";
        };
        readonly description: {
            readonly type: "string";
            readonly nullable: true;
            readonly description: "The description of the segment.";
        };
        readonly project: {
            readonly type: "string";
            readonly nullable: true;
            readonly description: "Project from where this segment will be accessible. If none is defined the segment will be global (i.e. accessible from any project).";
        };
        readonly constraints: {
            readonly type: "array";
            readonly description: "List of constraints that determine which users will be part of the segment";
            readonly items: {
                readonly $ref: "#/components/schemas/constraintSchema";
            };
        };
    };
    readonly example: {
        readonly name: "segment name";
        readonly description: "segment description";
        readonly project: "optional project id";
        readonly constraints: readonly [{
            readonly contextName: "environment";
            readonly operator: "IN";
            readonly values: readonly ["production", "staging"];
        }];
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
export declare type UpsertSegmentSchema = FromSchema<typeof upsertSegmentSchema>;
