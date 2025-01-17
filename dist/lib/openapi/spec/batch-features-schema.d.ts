import { FromSchema } from 'json-schema-to-ts';
export declare const batchFeaturesSchema: {
    readonly $id: "#/components/schemas/batchFeaturesSchema";
    readonly type: "object";
    readonly description: "A list of feature toggle names for batch operations";
    readonly required: readonly ["features"];
    readonly properties: {
        readonly features: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
            readonly description: "List of feature toggle names";
            readonly example: readonly ["my-feature-4", "my-feature-5", "my-feature-6"];
        };
    };
    readonly components: {
        readonly schemas: {};
    };
};
export declare type BatchFeaturesSchema = FromSchema<typeof batchFeaturesSchema>;
