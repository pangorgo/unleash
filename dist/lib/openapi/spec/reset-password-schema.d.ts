import { FromSchema } from 'json-schema-to-ts';
export declare const resetPasswordSchema: {
    readonly $id: "#/components/schemas/resetPasswordSchema";
    readonly type: "object";
    readonly description: "Data used to provide users a way to reset their passwords.";
    readonly additionalProperties: false;
    readonly required: readonly ["resetPasswordUrl"];
    readonly properties: {
        readonly resetPasswordUrl: {
            readonly description: "A URL pointing to a location where the user can reset their password";
            readonly type: "string";
            readonly format: "uri";
            readonly example: "https://reset.password.com";
        };
    };
    readonly components: {};
};
export declare type ResetPasswordSchema = FromSchema<typeof resetPasswordSchema>;
