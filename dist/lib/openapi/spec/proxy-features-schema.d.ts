import { FromSchema } from 'json-schema-to-ts';
export declare const proxyFeaturesSchema: {
    readonly $id: "#/components/schemas/proxyFeaturesSchema";
    readonly type: "object";
    readonly required: readonly ["toggles"];
    readonly additionalProperties: false;
    readonly description: "Frontend SDK features list";
    readonly properties: {
        readonly toggles: {
            readonly description: "The actual features returned to the Frontend SDK";
            readonly type: "array";
            readonly items: {
                readonly $ref: "#/components/schemas/proxyFeatureSchema";
            };
        };
    };
    readonly components: {
        readonly schemas: {
            readonly proxyFeatureSchema: {
                readonly $id: "#/components/schemas/proxyFeatureSchema";
                readonly type: "object";
                readonly required: readonly ["name", "enabled", "impressionData"];
                readonly additionalProperties: false;
                readonly description: "Frontend API feature";
                readonly properties: {
                    readonly name: {
                        readonly type: "string";
                        readonly example: "disable-comments";
                        readonly description: "Unique feature name.";
                    };
                    readonly enabled: {
                        readonly type: "boolean";
                        readonly example: true;
                        readonly description: "Always set to `true`.";
                    };
                    readonly impressionData: {
                        readonly type: "boolean";
                        readonly example: false;
                        readonly description: "`true` if the impression data collection is enabled for the feature, otherwise `false`.";
                    };
                    readonly variant: {
                        readonly type: "object";
                        readonly required: readonly ["name", "enabled"];
                        readonly additionalProperties: false;
                        readonly description: "Variant details";
                        readonly properties: {
                            readonly name: {
                                readonly type: "string";
                                readonly description: "The variants name. Is unique for this feature toggle";
                                readonly example: "blue_group";
                            };
                            readonly enabled: {
                                readonly type: "boolean";
                                readonly example: true;
                                readonly description: "Whether the variant is enabled or not.";
                            };
                            readonly payload: {
                                readonly type: "object";
                                readonly additionalProperties: false;
                                readonly required: readonly ["type", "value"];
                                readonly description: "Extra data configured for this variant";
                                readonly example: {
                                    readonly type: "json";
                                    readonly value: "{\"color\": \"red\"}";
                                };
                                readonly properties: {
                                    readonly type: {
                                        readonly type: "string";
                                        readonly description: "The format of the payload.";
                                        readonly enum: readonly ["json", "csv", "string"];
                                    };
                                    readonly value: {
                                        readonly type: "string";
                                        readonly description: "The payload value stringified.";
                                    };
                                };
                            };
                        };
                    };
                };
                readonly components: {};
            };
        };
    };
};
export declare type ProxyFeaturesSchema = FromSchema<typeof proxyFeaturesSchema>;
