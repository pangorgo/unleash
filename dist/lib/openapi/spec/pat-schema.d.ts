import { FromSchema } from 'json-schema-to-ts';
export declare const patSchema: {
    readonly $id: "#/components/schemas/patSchema";
    readonly type: "object";
    readonly description: "An overview of a [Personal Access Token](https://docs.getunleash.io/how-to/how-to-create-personal-access-tokens).";
    readonly properties: {
        readonly id: {
            readonly type: "integer";
            readonly description: "The unique identification number for this Personal Access Token. (This property is set by Unleash when the token is created and cannot be set manually: if you provide a value when creating a PAT, Unleash will ignore it.)";
            readonly example: 1;
            readonly minimum: 1;
        };
        readonly secret: {
            readonly type: "string";
            readonly description: "The token used for authentication. (This property is set by Unleash when the token is created and cannot be set manually: if you provide a value when creating a PAT, Unleash will ignore it.)";
            readonly example: "user:xyzrandomstring";
        };
        readonly expiresAt: {
            readonly type: "string";
            readonly format: "date-time";
            readonly description: "The token's expiration date.";
            readonly example: "2023-04-19T08:15:14.000Z";
        };
        readonly createdAt: {
            readonly type: "string";
            readonly format: "date-time";
            readonly example: "2023-04-19T08:15:14.000Z";
            readonly description: "When the token was created. (This property is set by Unleash when the token is created and cannot be set manually: if you provide a value when creating a PAT, Unleash will ignore it.)";
        };
        readonly seenAt: {
            readonly type: "string";
            readonly format: "date-time";
            readonly nullable: true;
            readonly example: "2023-04-19T08:15:14.000Z";
            readonly description: "When the token was last seen/used to authenticate with. `null` if it has not been used yet. (This property is set by Unleash when the token is created and cannot be set manually: if you provide a value when creating a PAT, Unleash will ignore it.)";
        };
    };
    readonly components: {
        readonly schemas: {};
    };
};
export declare type PatSchema = FromSchema<typeof patSchema>;
