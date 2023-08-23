import { FromSchema } from 'json-schema-to-ts';
export declare const TAG_MIN_LENGTH = 2;
export declare const TAG_MAX_LENGTH = 50;
export declare const tagSchema: {
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
export declare type TagSchema = FromSchema<typeof tagSchema>;
