import { FromSchema } from 'json-schema-to-ts';
export declare const featureTypeSchema: {
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
export declare type FeatureTypeSchema = FromSchema<typeof featureTypeSchema>;
