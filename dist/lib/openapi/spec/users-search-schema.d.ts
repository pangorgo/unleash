import { FromSchema } from 'json-schema-to-ts';
export declare const usersSearchSchema: {
    readonly $id: "#/components/schemas/usersSearchSchema";
    readonly type: "array";
    readonly description: "A list of users";
    readonly items: {
        readonly $ref: "#/components/schemas/userSchema";
    };
    readonly components: {
        readonly schemas: {
            readonly userSchema: {
                readonly $id: "#/components/schemas/userSchema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly description: "An Unleash user";
                readonly required: readonly ["id"];
                readonly properties: {
                    readonly id: {
                        readonly description: "The user id";
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly example: 123;
                    };
                    readonly isAPI: {
                        readonly description: "(Deprecated): Used internally to know which operations the user should be allowed to perform";
                        readonly type: "boolean";
                        readonly example: true;
                        readonly deprecated: true;
                    };
                    readonly name: {
                        readonly description: "Name of the user";
                        readonly type: "string";
                        readonly example: "User";
                        readonly nullable: true;
                    };
                    readonly email: {
                        readonly description: "Email of the user";
                        readonly type: "string";
                        readonly example: "user@example.com";
                    };
                    readonly username: {
                        readonly description: "A unique username for the user";
                        readonly type: "string";
                        readonly example: "hunter";
                    };
                    readonly imageUrl: {
                        readonly description: "URL used for the userprofile image";
                        readonly type: "string";
                        readonly example: "https://example.com/242x200.png";
                    };
                    readonly inviteLink: {
                        readonly description: "If the user is actively inviting other users, this is the link that can be shared with other users";
                        readonly type: "string";
                        readonly example: "http://localhost:4242/invite-link/some-secret";
                    };
                    readonly loginAttempts: {
                        readonly description: "How many unsuccessful attempts at logging in has the user made";
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly example: 3;
                    };
                    readonly emailSent: {
                        readonly description: "Is the welcome email sent to the user or not";
                        readonly type: "boolean";
                        readonly example: false;
                    };
                    readonly rootRole: {
                        readonly description: "Which [root role](https://docs.getunleash.io/reference/rbac#predefined-roles) this user is assigned";
                        readonly type: "integer";
                        readonly example: 1;
                        readonly minimum: 0;
                    };
                    readonly seenAt: {
                        readonly description: "The last time this user logged in";
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly nullable: true;
                        readonly example: "2023-06-30T11:42:00.345Z";
                    };
                    readonly createdAt: {
                        readonly description: "The user was created at this time";
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly example: "2023-06-30T11:41:00.123Z";
                    };
                    readonly accountType: {
                        readonly description: "A user is either an actual User or a Service Account";
                        readonly type: "string";
                        readonly enum: readonly ["User", "Service Account"];
                        readonly example: "User";
                    };
                    readonly permissions: {
                        readonly description: "Deprecated";
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                    };
                };
                readonly components: {};
            };
        };
    };
};
export declare type UsersSearchSchema = FromSchema<typeof usersSearchSchema>;
