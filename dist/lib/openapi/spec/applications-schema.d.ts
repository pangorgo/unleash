import { FromSchema } from 'json-schema-to-ts';
export declare const applicationsSchema: {
    readonly $id: "#/components/schemas/applicationsSchema";
    readonly additionalProperties: false;
    readonly description: "An object containing a list of applications that have connected to Unleash via an SDK.";
    readonly type: "object";
    readonly properties: {
        readonly applications: {
            readonly description: "The list of applications that have connected to this Unleash instance.";
            readonly type: "array";
            readonly items: {
                readonly $ref: "#/components/schemas/applicationSchema";
            };
        };
    };
    readonly components: {
        readonly schemas: {
            readonly applicationSchema: {
                readonly $id: "#/components/schemas/applicationSchema";
                readonly type: "object";
                readonly description: "Data about an application that's connected to Unleash via an SDK.";
                readonly additionalProperties: false;
                readonly required: readonly ["appName"];
                readonly properties: {
                    readonly appName: {
                        readonly description: "Name of the application";
                        readonly type: "string";
                        readonly example: "accounting";
                    };
                    readonly sdkVersion: {
                        readonly description: "Which SDK and version the application reporting uses. Typically represented as `<identifier>:<version>`";
                        readonly type: "string";
                        readonly example: "unleash-client-java:8.0.0";
                    };
                    readonly strategies: {
                        readonly description: "Which [strategies](https://docs.getunleash.io/topics/the-anatomy-of-unleash#activation-strategies) the application has loaded. Useful when trying to figure out if your [custom strategy](https://docs.getunleash.io/reference/custom-activation-strategies) has been loaded in the SDK";
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                        readonly example: readonly ["standard", "gradualRollout", "mySpecialCustomStrategy"];
                    };
                    readonly description: {
                        readonly description: "Extra information added about the application reporting the metrics. Only present if added via the Unleash Admin interface";
                        readonly type: "string";
                        readonly example: "Application for reporting page visits";
                    };
                    readonly url: {
                        readonly description: "A link to reference the application reporting the metrics. Could for instance be a GitHub link to the repository of the application";
                        readonly type: "string";
                        readonly example: "https://github.com/Unleash/unleash-client-proxy-js";
                    };
                    readonly color: {
                        readonly description: "The CSS color that is used to color the application's entry in the application list";
                        readonly type: "string";
                        readonly example: "red";
                    };
                    readonly icon: {
                        readonly description: "An URL to an icon file to be used for the applications's entry in the application list";
                        readonly type: "string";
                        readonly example: "https://github.com/favicon.ico";
                    };
                };
                readonly components: {};
            };
        };
    };
};
export declare type ApplicationsSchema = FromSchema<typeof applicationsSchema>;
