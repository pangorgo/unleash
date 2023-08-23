import { FromSchema } from 'json-schema-to-ts';
export declare const createApiTokenSchema: {
    readonly $id: "#/components/schemas/createApiTokenSchema";
    readonly type: "object";
    readonly description: "The data required to create an [Unleash API token](https://docs.getunleash.io/reference/api-tokens-and-client-keys).";
    readonly properties: {
        readonly expiresAt: {
            readonly type: "string";
            readonly format: "date-time";
            readonly description: "The time when this token should expire.";
            readonly example: "2023-07-04T11:26:24+02:00";
        };
    };
    readonly oneOf: readonly [{
        readonly allOf: readonly [{
            readonly required: readonly ["type"];
            readonly type: "object";
            readonly properties: {
                readonly type: {
                    readonly type: "string";
                    readonly pattern: "^[Aa][Dd][Mm][Ii][Nn]$";
                    readonly description: "An admin token. Must be the string \"admin\" (not case sensitive).";
                    readonly example: "admin";
                };
            };
        }, {
            readonly type: "object";
            readonly required: readonly ["tokenName"];
            readonly properties: {
                readonly tokenName: {
                    readonly type: "string";
                    readonly description: "The name of the token.";
                    readonly example: "token-64522";
                };
            };
        }];
    }, {
        readonly allOf: readonly [{
            readonly required: readonly ["type"];
            readonly type: "object";
            readonly properties: {
                readonly type: {
                    readonly type: "string";
                    readonly pattern: "^[Aa][Dd][Mm][Ii][Nn]$";
                    readonly description: "An admin token. Must be the string \"admin\" (not case sensitive).";
                    readonly example: "admin";
                };
            };
        }, {
            readonly type: "object";
            readonly required: readonly ["username"];
            readonly properties: {
                readonly username: {
                    readonly deprecated: true;
                    readonly type: "string";
                    readonly description: "The name of the token. This property is deprecated. Use `tokenName` instead.";
                    readonly example: "token-64523";
                };
            };
        }];
    }, {
        readonly allOf: readonly [{
            readonly required: readonly ["type"];
            readonly type: "object";
            readonly properties: {
                readonly type: {
                    readonly type: "string";
                    readonly pattern: "^([Cc][Ll][Ii][Ee][Nn][Tt]|[Ff][Rr][Oo][Nn][Tt][Ee][Nn][Dd])$";
                    readonly description: "A client or frontend token. Must be one of the strings \"client\" or \"frontend\" (not case sensitive).";
                    readonly example: "frontend";
                };
                readonly environment: {
                    readonly type: "string";
                    readonly description: "The environment that the token should be valid for. Defaults to \"default\"";
                    readonly example: "development";
                };
                readonly project: {
                    readonly type: "string";
                    readonly description: "The project that the token should be valid for. Defaults to \"*\" meaning every project. This property is mutually incompatible with the `projects` property. If you specify one, you cannot specify the other.";
                    readonly example: "project-851";
                };
                readonly projects: {
                    readonly type: "array";
                    readonly description: "A list of projects that the token should be valid for. This property is mutually incompatible with the `project` property. If you specify one, you cannot specify the other.";
                    readonly example: readonly ["project-851", "project-852"];
                    readonly items: {
                        readonly type: "string";
                    };
                };
            };
        }, {
            readonly type: "object";
            readonly required: readonly ["tokenName"];
            readonly properties: {
                readonly tokenName: {
                    readonly type: "string";
                    readonly description: "The name of the token.";
                    readonly example: "token-64522";
                };
            };
        }];
    }, {
        readonly allOf: readonly [{
            readonly required: readonly ["type"];
            readonly type: "object";
            readonly properties: {
                readonly type: {
                    readonly type: "string";
                    readonly pattern: "^([Cc][Ll][Ii][Ee][Nn][Tt]|[Ff][Rr][Oo][Nn][Tt][Ee][Nn][Dd])$";
                    readonly description: "A client or frontend token. Must be one of the strings \"client\" or \"frontend\" (not case sensitive).";
                    readonly example: "frontend";
                };
                readonly environment: {
                    readonly type: "string";
                    readonly description: "The environment that the token should be valid for. Defaults to \"default\"";
                    readonly example: "development";
                };
                readonly project: {
                    readonly type: "string";
                    readonly description: "The project that the token should be valid for. Defaults to \"*\" meaning every project. This property is mutually incompatible with the `projects` property. If you specify one, you cannot specify the other.";
                    readonly example: "project-851";
                };
                readonly projects: {
                    readonly type: "array";
                    readonly description: "A list of projects that the token should be valid for. This property is mutually incompatible with the `project` property. If you specify one, you cannot specify the other.";
                    readonly example: readonly ["project-851", "project-852"];
                    readonly items: {
                        readonly type: "string";
                    };
                };
            };
        }, {
            readonly type: "object";
            readonly required: readonly ["username"];
            readonly properties: {
                readonly username: {
                    readonly deprecated: true;
                    readonly type: "string";
                    readonly description: "The name of the token. This property is deprecated. Use `tokenName` instead.";
                    readonly example: "token-64523";
                };
            };
        }];
    }];
    readonly components: {};
};
export declare type CreateApiTokenSchema = FromSchema<typeof createApiTokenSchema>;
