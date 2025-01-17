import { FromSchema } from 'json-schema-to-ts';
export declare const featureEventsSchema: {
    readonly $id: "#/components/schemas/featureEventsSchema";
    readonly type: "object";
    readonly additionalProperties: false;
    readonly required: readonly ["events"];
    readonly description: "One or more events happening to a specific feature toggle";
    readonly properties: {
        readonly version: {
            readonly type: "integer";
            readonly description: "An API versioning number";
            readonly minimum: 1;
            readonly enum: readonly [1];
            readonly example: 1;
        };
        readonly toggleName: {
            readonly description: "The name of the feature toggle these events relate to";
            readonly type: "string";
            readonly example: "my.first.feature.toggle";
        };
        readonly events: {
            readonly description: "The list of events";
            readonly type: "array";
            readonly items: {
                readonly $ref: "#/components/schemas/eventSchema";
            };
        };
        readonly totalEvents: {
            readonly description: "How many events are there for this feature toggle";
            readonly type: "integer";
            readonly minimum: 0;
            readonly example: 13;
        };
    };
    readonly components: {
        readonly schemas: {
            readonly eventSchema: {
                readonly $id: "#/components/schemas/eventSchema";
                readonly type: "object";
                readonly additionalProperties: false;
                readonly required: readonly ["id", "createdAt", "type", "createdBy"];
                readonly description: "An event describing something happening in the system";
                readonly properties: {
                    readonly id: {
                        readonly type: "integer";
                        readonly minimum: 1;
                        readonly description: "The ID of the event. An increasing natural number.";
                    };
                    readonly createdAt: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly description: "The time the event happened as a RFC 3339-conformant timestamp.";
                        readonly example: "2023-07-05T12:56:00.000Z";
                    };
                    readonly type: {
                        readonly type: "string";
                        readonly description: "What [type](https://docs.getunleash.io/reference/api/legacy/unleash/admin/events#event-type-description) of event this is";
                        readonly enum: readonly ["application-created", "feature-created", "feature-deleted", "feature-updated", "feature-metadata-updated", "feature-variants-updated", "feature-environment-variants-updated", "feature-project-change", "feature-archived", "feature-revived", "feature-import", "feature-tagged", "feature-tag-import", "feature-strategy-update", "feature-strategy-add", "feature-strategy-remove", "strategy-order-changed", "drop-feature-tags", "feature-untagged", "feature-stale-on", "feature-stale-off", "drop-features", "feature-environment-enabled", "feature-environment-disabled", "strategy-created", "strategy-deleted", "strategy-deprecated", "strategy-reactivated", "strategy-updated", "strategy-import", "drop-strategies", "context-field-created", "context-field-updated", "context-field-deleted", "project-access-added", "project-created", "project-updated", "project-deleted", "project-import", "project-user-added", "project-user-removed", "project-user-role-changed", "project-group-role-changed", "project-group-added", "project-group-removed", "drop-projects", "tag-created", "tag-deleted", "tag-import", "drop-tags", "tag-type-created", "tag-type-deleted", "tag-type-updated", "tag-type-import", "drop-tag-types", "addon-config-created", "addon-config-updated", "addon-config-deleted", "db-pool-update", "user-created", "user-updated", "user-deleted", "drop-environments", "environment-import", "segment-created", "segment-updated", "segment-deleted", "group-created", "group-updated", "setting-created", "setting-updated", "setting-deleted", "client-metrics", "client-register", "pat-created", "pat-deleted", "public-signup-token-created", "public-signup-token-user-added", "public-signup-token-updated", "change-request-created", "change-request-discarded", "change-added", "change-discarded", "change-edited", "change-request-rejected", "change-request-approved", "change-request-approval-added", "change-request-cancelled", "change-request-sent-to-review", "change-request-applied", "api-token-created", "api-token-updated", "api-token-deleted", "feature-favorited", "feature-unfavorited", "project-favorited", "project-unfavorited", "features-exported", "features-imported", "service-account-created", "service-account-deleted", "service-account-updated", "feature-potentially-stale-on"];
                        readonly example: "feature-created";
                    };
                    readonly createdBy: {
                        readonly type: "string";
                        readonly description: "Which user created this event";
                        readonly example: "johndoe";
                    };
                    readonly environment: {
                        readonly type: "string";
                        readonly description: "The feature toggle environment the event relates to, if applicable.";
                        readonly nullable: true;
                        readonly example: "development";
                    };
                    readonly project: {
                        readonly type: "string";
                        readonly nullable: true;
                        readonly description: "The project the event relates to, if applicable.";
                        readonly example: "default";
                    };
                    readonly featureName: {
                        readonly type: "string";
                        readonly nullable: true;
                        readonly description: "The name of the feature toggle the event relates to, if applicable.";
                        readonly example: "my.first.feature";
                    };
                    readonly data: {
                        readonly type: "object";
                        readonly nullable: true;
                        readonly 'x-enforcer-exception-skip-codes': "WSCH006";
                        readonly description: "Extra associated data related to the event, such as feature toggle state, segment configuration, etc., if applicable.";
                        readonly example: {
                            readonly name: "new-feature";
                            readonly description: "Toggle description";
                            readonly type: "release";
                            readonly project: "my-project";
                            readonly stale: false;
                            readonly variants: readonly [];
                            readonly createdAt: "2022-05-31T13:32:20.547Z";
                            readonly lastSeenAt: any;
                            readonly impressionData: true;
                        };
                    };
                    readonly preData: {
                        readonly description: "Data relating to the previous state of the event's subject.";
                        readonly type: "object";
                        readonly nullable: true;
                        readonly 'x-enforcer-exception-skip-codes': "WSCH006";
                        readonly example: {
                            readonly name: "new-feature";
                            readonly description: "Toggle description";
                            readonly type: "release";
                            readonly project: "my-project";
                            readonly stale: false;
                            readonly variants: readonly [];
                            readonly createdAt: "2022-05-31T13:32:20.547Z";
                            readonly lastSeenAt: any;
                            readonly impressionData: true;
                        };
                    };
                    readonly tags: {
                        readonly type: "array";
                        readonly items: {
                            readonly $ref: "#/components/schemas/tagSchema";
                        };
                        readonly nullable: true;
                        readonly description: "Any tags related to the event, if applicable.";
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
                        readonly variantSchema: {
                            readonly $id: "#/components/schemas/variantSchema";
                            readonly type: "object";
                            readonly additionalProperties: false;
                            readonly description: "A variant allows for further separation of users into segments. See [our excellent documentation](https://docs.getunleash.io/reference/feature-toggle-variants#what-are-variants) for a more detailed description";
                            readonly required: readonly ["name", "weight"];
                            readonly properties: {
                                readonly name: {
                                    readonly type: "string";
                                    readonly description: "The variants name. Is unique for this feature toggle";
                                    readonly example: "blue_group";
                                };
                                readonly weight: {
                                    readonly type: "number";
                                    readonly description: "The weight is the likelihood of any one user getting this variant. It is a number between 0 and 1000. See the section on [variant weights](https://docs.getunleash.io/reference/feature-toggle-variants#variant-weight) for more information";
                                    readonly minimum: 0;
                                    readonly maximum: 1000;
                                };
                                readonly weightType: {
                                    readonly description: "Set to fix if this variant must have exactly the weight allocated to it. If the type is variable, the weight will adjust so that the total weight of all variants adds up to 1000";
                                    readonly type: "string";
                                    readonly example: "variable";
                                    readonly enum: readonly ["variable", "fix"];
                                };
                                readonly stickiness: {
                                    readonly type: "string";
                                    readonly description: "[Stickiness](https://docs.getunleash.io/reference/feature-toggle-variants#variant-stickiness) is how Unleash guarantees that the same user gets the same variant every time";
                                    readonly example: "custom.context.field";
                                };
                                readonly payload: {
                                    readonly type: "object";
                                    readonly required: readonly ["type", "value"];
                                    readonly description: "Extra data configured for this variant";
                                    readonly additionalProperties: false;
                                    readonly properties: {
                                        readonly type: {
                                            readonly description: "The type of the value. Commonly used types are string, json and csv.";
                                            readonly type: "string";
                                            readonly enum: readonly ["json", "csv", "string"];
                                        };
                                        readonly value: {
                                            readonly description: "The actual value of payload";
                                            readonly type: "string";
                                        };
                                    };
                                    readonly example: {
                                        readonly type: "json";
                                        readonly value: "{\"color\": \"red\"}";
                                    };
                                };
                                readonly overrides: {
                                    readonly description: "Overrides assigning specific variants to specific users. The weighting system automatically assigns users to specific groups for you, but any overrides in this list will take precedence.";
                                    readonly type: "array";
                                    readonly items: {
                                        readonly $ref: "#/components/schemas/overrideSchema";
                                    };
                                };
                            };
                            readonly components: {
                                readonly schemas: {
                                    readonly overrideSchema: {
                                        readonly $id: "#/components/schemas/overrideSchema";
                                        readonly type: "object";
                                        readonly additionalProperties: false;
                                        readonly required: readonly ["contextName", "values"];
                                        readonly description: "An override for deciding which variant should be assigned to a user based on the context name";
                                        readonly properties: {
                                            readonly contextName: {
                                                readonly description: "The name of the context field used to determine overrides";
                                                readonly type: "string";
                                                readonly example: "userId";
                                            };
                                            readonly values: {
                                                readonly description: "Which values that should be overriden";
                                                readonly type: "array";
                                                readonly items: {
                                                    readonly type: "string";
                                                };
                                                readonly example: readonly ["red", "blue"];
                                            };
                                        };
                                        readonly components: {};
                                    };
                                };
                            };
                        };
                    };
                };
            };
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
export declare type FeatureEventsSchema = FromSchema<typeof featureEventsSchema>;
