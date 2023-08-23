import { FromSchema } from 'json-schema-to-ts';
export declare const importTogglesValidateItemSchema: {
    readonly $id: "#/components/schemas/importTogglesValidateItemSchema";
    readonly type: "object";
    readonly required: readonly ["message", "affectedItems"];
    readonly additionalProperties: false;
    readonly description: "A description of an error or warning pertaining to a feature toggle import job.";
    readonly properties: {
        readonly message: {
            readonly type: "string";
            readonly description: "The validation error message";
            readonly example: "You cannot import a feature that already exist in other projects. You already have the following features defined outside of project default:";
        };
        readonly affectedItems: {
            readonly type: "array";
            readonly description: "The items affected by this error message ";
            readonly example: readonly ["some-feature-a", "some-feature-b"];
            readonly items: {
                readonly type: "string";
            };
        };
    };
    readonly components: {
        readonly schemas: {};
    };
};
export declare type ImportTogglesValidateItemSchema = FromSchema<typeof importTogglesValidateItemSchema>;
