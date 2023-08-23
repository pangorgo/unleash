import { FromSchema } from 'json-schema-to-ts';
export declare const featureTypesSchema: {
    readonly $id: "#/components/schemas/featureTypesSchema";
    readonly type: "object";
    readonly additionalProperties: false;
    readonly description: "A list of [feature toggle types](https://docs.getunleash.io/reference/feature-toggle-types) and the schema version used to represent those feature types.";
    readonly required: readonly ["version", "types"];
    readonly properties: {
        readonly version: {
            readonly type: "integer";
            readonly enum: readonly [1];
            readonly example: 1;
            readonly description: "The schema version used to describe the feature toggle types listed in the `types` property.";
        };
        readonly types: {
            readonly type: "array";
            readonly description: "The list of feature toggle types.";
            readonly items: {
                readonly $ref: "#/components/schemas/featureTypeSchema";
            };
            readonly example: readonly [{
                readonly id: "release";
                readonly name: "Release";
                readonly description: "Release feature toggles are used to release new features.";
                readonly lifetimeDays: 40;
            }, {
                readonly id: "experiment";
                readonly name: "Experiment";
                readonly description: "Experiment feature toggles are used to test and verify multiple different versions of a feature.";
                readonly lifetimeDays: 40;
            }, {
                readonly id: "operational";
                readonly name: "Operational";
                readonly description: "Operational feature toggles are used to control aspects of a rollout.";
                readonly lifetimeDays: 7;
            }, {
                readonly id: "kill-switch";
                readonly name: "Kill switch";
                readonly description: "Kill switch feature toggles are used to quickly turn on or off critical functionality in your system.";
                readonly lifetimeDays: any;
            }, {
                readonly id: "permission";
                readonly name: "Permission";
                readonly description: "Permission feature toggles are used to control permissions in your system.";
                readonly lifetimeDays: any;
            }];
        };
    };
    readonly components: {
        readonly schemas: {
            readonly featureTypeSchema: {
                readonly $id: "#/components/schemas/featureTypeSchema";
                readonly type: "object";
                readonly description: "A [feature toggle type](https://docs.getunleash.io/reference/feature-toggle-types).";
                readonly additionalProperties: false;
                readonly required: readonly ["id", "name", "description", "lifetimeDays"];
                readonly properties: {
                    readonly id: {
                        readonly type: "string";
                        readonly description: "The identifier of this feature toggle type.";
                        readonly example: "kill-switch";
                    };
                    readonly name: {
                        readonly type: "string";
                        readonly description: "The display name of this feature toggle type.";
                        readonly example: "Kill switch";
                    };
                    readonly description: {
                        readonly type: "string";
                        readonly description: "A description of what this feature toggle type is intended to be used for.";
                        readonly example: "Kill switch feature toggles are used to quickly turn on or off critical functionality in your system.";
                    };
                    readonly lifetimeDays: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "How many days it takes before a feature toggle of this typed is flagged as [potentially stale](https://docs.getunleash.io/reference/technical-debt#stale-and-potentially-stale-toggles) by Unleash. If this value is `null`, Unleash will never mark it as potentially stale.";
                        readonly example: 40;
                        readonly nullable: true;
                    };
                };
                readonly components: {};
            };
        };
    };
};
export declare type FeatureTypesSchema = FromSchema<typeof featureTypesSchema>;
