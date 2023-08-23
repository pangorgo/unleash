import { FromSchema } from 'json-schema-to-ts';
export declare const validateFeatureSchema: {
    readonly $id: "#/components/schemas/validateFeatureSchema";
    readonly type: "object";
    readonly required: readonly ["name"];
    readonly description: "Data used to validate a feature toggle's name.";
    readonly properties: {
        readonly name: {
            readonly description: "The feature name to validate.";
            readonly type: "string";
            readonly example: "my-feature-3";
        };
    };
    readonly components: {};
};
export declare type ValidateFeatureSchema = FromSchema<typeof validateFeatureSchema>;
