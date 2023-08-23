import { FromSchema } from 'json-schema-to-ts';
export declare const updateTagsSchema: {
    readonly $id: "#/components/schemas/updateTagsSchema";
    readonly type: "object";
    readonly description: "Represents a set of changes to a feature's tags, such as adding or removing tags.";
    readonly additionalProperties: false;
    readonly required: readonly ["addedTags", "removedTags"];
    readonly properties: {
        readonly addedTags: {
            readonly type: "array";
            readonly description: "Tags to add to the feature.";
            readonly items: {
                readonly $ref: "#/components/schemas/tagSchema";
            };
        };
        readonly removedTags: {
            readonly type: "array";
            readonly description: "Tags to remove from the feature.";
            readonly items: {
                readonly $ref: "#/components/schemas/tagSchema";
            };
        };
    };
    readonly example: {
        readonly addedTags: readonly [{
            readonly value: "tag-to-add";
            readonly type: "simple";
        }];
        readonly removedTags: readonly [{
            readonly value: "tag-to-remove";
            readonly type: "simple";
        }];
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
export declare type UpdateTagsSchema = FromSchema<typeof updateTagsSchema>;
