import { FromSchema } from 'json-schema-to-ts';
export declare const createStrategyVariantSchema: {
    readonly $id: "#/components/schemas/createStrategyVariantSchema";
    readonly type: "object";
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
export declare type CreateStrategyVariantSchema = FromSchema<typeof createStrategyVariantSchema>;
