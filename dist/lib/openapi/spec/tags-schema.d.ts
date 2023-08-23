import { FromSchema } from 'json-schema-to-ts';
export declare const tagsSchema: {
    readonly $id: "#/components/schemas/tagsSchema";
    readonly description: "A list of tags with a version number";
    readonly type: "object";
    readonly additionalProperties: false;
    readonly required: readonly ["version", "tags"];
    readonly properties: {
        readonly version: {
            readonly type: "integer";
            readonly description: "The version of the schema used to model the tags.";
        };
        readonly tags: {
            readonly type: "array";
            readonly description: "A list of tags.";
            readonly items: {
                readonly $ref: "#/components/schemas/tagSchema";
            };
        };
    };
    readonly components: {
        readonly schemas: {
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
export declare type TagsSchema = FromSchema<typeof tagsSchema>;
