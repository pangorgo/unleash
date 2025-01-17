import { FromSchema } from 'json-schema-to-ts';
export declare const environmentsSchema: {
    readonly $id: "#/components/schemas/environmentsSchema";
    readonly type: "object";
    readonly additionalProperties: false;
    readonly required: readonly ["version", "environments"];
    readonly description: "A versioned list of environments";
    readonly properties: {
        readonly version: {
            readonly type: "integer";
            readonly example: 1;
            readonly description: "Version of the environments schema";
        };
        readonly environments: {
            readonly type: "array";
            readonly items: {
                readonly $ref: "#/components/schemas/environmentSchema";
            };
            readonly description: "List of environments";
        };
    };
    readonly components: {
        readonly schemas: {
            readonly environmentSchema: {
                readonly $id: "#/components/schemas/environmentSchema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["name", "type", "enabled", "protected", "sortOrder"];
                readonly description: "A definition of the project environment";
                readonly properties: {
                    readonly name: {
                        readonly type: "string";
                        readonly example: "my-dev-env";
                        readonly description: "The name of the environment";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly example: "development";
                        readonly description: "The [type of environment](https://docs.getunleash.io/reference/environments#environment-types).";
                    };
                    readonly enabled: {
                        readonly type: "boolean";
                        readonly example: true;
                        readonly description: "`true` if the environment is enabled for the project, otherwise `false`.";
                    };
                    readonly protected: {
                        readonly type: "boolean";
                        readonly example: true;
                        readonly description: "`true` if the environment is protected, otherwise `false`. A *protected* environment can not be deleted.";
                    };
                    readonly sortOrder: {
                        readonly type: "integer";
                        readonly example: 3;
                        readonly description: "Priority of the environment in a list of environments, the lower the value, the higher up in the list the environment will appear. Needs to be an integer";
                    };
                    readonly projectCount: {
                        readonly type: "integer";
                        readonly nullable: true;
                        readonly minimum: 0;
                        readonly example: 10;
                        readonly description: "The number of projects with this environment";
                    };
                    readonly apiTokenCount: {
                        readonly type: "integer";
                        readonly nullable: true;
                        readonly minimum: 0;
                        readonly example: 6;
                        readonly description: "The number of API tokens for the project environment";
                    };
                    readonly enabledToggleCount: {
                        readonly type: "integer";
                        readonly nullable: true;
                        readonly minimum: 0;
                        readonly example: 10;
                        readonly description: "The number of enabled toggles for the project environment";
                    };
                };
                readonly components: {};
            };
        };
    };
};
export declare type EnvironmentsSchema = FromSchema<typeof environmentsSchema>;
