import { FromSchema } from 'json-schema-to-ts';
export declare const clientMetricsSchema: {
    readonly $id: "#/components/schemas/clientMetricsSchema";
    readonly type: "object";
    readonly required: readonly ["appName", "bucket"];
    readonly description: "Client usage metrics, accumulated in buckets of hour by hour by default";
    readonly properties: {
        readonly appName: {
            readonly description: "The name of the application that is evaluating toggles";
            readonly type: "string";
            readonly example: "insurance-selector";
        };
        readonly instanceId: {
            readonly description: "A [(somewhat) unique identifier](https://docs.getunleash.io/reference/sdks/node#advanced-usage) for the application";
            readonly type: "string";
            readonly example: "application-name-dacb1234";
        };
        readonly environment: {
            readonly description: "Which environment the application is running in";
            readonly type: "string";
            readonly example: "development";
        };
        readonly bucket: {
            readonly type: "object";
            readonly required: readonly ["start", "stop", "toggles"];
            readonly description: "Holds all metrics gathered over a window of time. Typically 1 hour wide";
            readonly properties: {
                readonly start: {
                    readonly $ref: "#/components/schemas/dateSchema";
                    readonly description: "The start of the time window these metrics are valid for. The window is usually 1 hour wide";
                    readonly example: "1926-05-08T12:00:00.000Z";
                };
                readonly stop: {
                    readonly $ref: "#/components/schemas/dateSchema";
                    readonly description: "The end of the time window these metrics are valid for. The window is 1 hour wide";
                    readonly example: "1926-05-08T13:00:00.000Z";
                };
                readonly toggles: {
                    readonly type: "object";
                    readonly description: "an object containing feature names with yes/no plus variant usage";
                    readonly example: {
                        readonly myCoolToggle: {
                            readonly yes: 25;
                            readonly no: 42;
                            readonly variants: {
                                readonly blue: 6;
                                readonly green: 15;
                                readonly red: 46;
                            };
                        };
                        readonly myOtherToggle: {
                            readonly yes: 0;
                            readonly no: 100;
                        };
                    };
                    readonly additionalProperties: {
                        readonly type: "object";
                        readonly properties: {
                            readonly yes: {
                                readonly description: "How many times the toggle evaluated to true";
                                readonly type: "number";
                                readonly example: 974;
                                readonly minimum: 0;
                            };
                            readonly no: {
                                readonly description: "How many times the toggle evaluated to false";
                                readonly type: "integer";
                                readonly example: 50;
                                readonly minimum: 0;
                            };
                            readonly variants: {
                                readonly description: "An object describing how many times each variant was returned. Variant names are used as properties, and the number of times they were exposed is the corresponding value (i.e. `{ [variantName]: number }`).";
                                readonly type: "object";
                                readonly additionalProperties: {
                                    readonly type: "integer";
                                    readonly minimum: 0;
                                };
                                readonly example: {
                                    readonly variantA: 15;
                                    readonly variantB: 25;
                                    readonly variantC: 5;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    readonly components: {
        readonly schemas: {
            readonly dateSchema: {
                readonly $id: "#/components/schemas/dateSchema";
                readonly description: "A representation of a date. Either as a date-time string or as a UNIX timestamp.";
                readonly oneOf: readonly [{
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly description: "An [RFC-3339](https://www.rfc-editor.org/rfc/rfc3339.html)-compliant timestamp.";
                    readonly example: "2023-07-27T11:23:44Z";
                }, {
                    readonly type: "integer";
                    readonly description: "A [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time).";
                    readonly example: 1690449593;
                }];
                readonly components: {};
            };
        };
    };
};
export declare type ClientMetricsSchema = FromSchema<typeof clientMetricsSchema>;
