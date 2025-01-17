import { FromSchema } from 'json-schema-to-ts';
export declare const clientApplicationSchema: {
    readonly $id: "#/components/schemas/clientApplicationSchema";
    readonly type: "object";
    readonly required: readonly ["appName", "interval", "started", "strategies"];
    readonly description: "A client application is an instance of one of our SDKs";
    readonly properties: {
        readonly appName: {
            readonly description: "An identifier for the app that uses the sdk, should be static across SDK restarts";
            readonly type: "string";
            readonly example: "example-app";
        };
        readonly instanceId: {
            readonly description: "A unique identifier identifying the instance of the application running the SDK. Often changes based on execution environment. For instance: two pods in Kubernetes will have two different instanceIds";
            readonly type: "string";
            readonly example: "b77f3d13-5f48-4a7b-a3f4-a449b97ce43a";
        };
        readonly sdkVersion: {
            readonly type: "string";
            readonly description: "An SDK version identifier. Usually formatted as \"unleash-client-<language>:<version>\"";
            readonly example: "unleash-client-java:7.0.0";
        };
        readonly environment: {
            readonly description: "The SDK's configured 'environment' property. Deprecated. This property  does **not** control which Unleash environment the SDK gets toggles for. To control Unleash environments, use the SDKs API key.";
            readonly deprecated: true;
            readonly type: "string";
            readonly example: "development";
        };
        readonly interval: {
            readonly type: "number";
            readonly description: "How often (in seconds) does the client refresh its toggles";
            readonly example: 10;
            readonly minimum: 0;
        };
        readonly started: {
            readonly description: "Either an RFC-3339 timestamp or a unix timestamp in seconds";
            readonly oneOf: readonly [{
                readonly type: "string";
                readonly format: "date-time";
            }, {
                readonly type: "number";
            }];
            readonly example: "2023-06-13T16:35:00.000Z";
        };
        readonly strategies: {
            readonly description: "Which strategies the SDKs runtime knows about";
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
            readonly example: readonly ["default", "gradualRollout", "remoteAddress"];
        };
    };
    readonly components: {};
};
export declare type ClientApplicationSchema = FromSchema<typeof clientApplicationSchema>;
