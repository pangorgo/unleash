import { FromSchema } from 'json-schema-to-ts';
export declare const featureTagSchema: {
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
export declare type FeatureTagSchema = FromSchema<typeof featureTagSchema>;
