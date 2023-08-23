import { FromSchema } from 'json-schema-to-ts';
export declare const createFeatureSchema: {
    readonly $id: "#/components/schemas/createFeatureSchema";
    readonly type: "object";
    readonly description: "Data used to create a new feature toggle.";
    readonly required: readonly ["name"];
    readonly properties: {
        readonly name: {
            readonly type: "string";
            readonly example: "disable-comments";
            readonly description: "Unique feature name";
        };
        readonly type: {
            readonly type: "string";
            readonly example: "release";
            readonly description: "The feature toggle's [type](https://docs.getunleash.io/reference/feature-toggle-types). One of experiment, kill-switch, release, operational, or permission";
        };
        readonly description: {
            readonly type: "string";
            readonly nullable: true;
            readonly example: "Controls disabling of the comments section in case of an incident";
            readonly description: "Detailed description of the feature";
        };
        readonly impressionData: {
            readonly type: "boolean";
            readonly example: false;
            readonly description: "`true` if the impression data collection is enabled for the feature, otherwise `false`.";
        };
    };
    readonly components: {};
};
export declare type CreateFeatureSchema = FromSchema<typeof createFeatureSchema>;
