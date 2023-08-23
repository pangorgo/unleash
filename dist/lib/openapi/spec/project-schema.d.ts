import { FromSchema } from 'json-schema-to-ts';
export declare const projectSchema: {
    readonly $id: "#/components/schemas/projectSchema";
    readonly type: "object";
    readonly additionalProperties: false;
    readonly required: readonly ["id", "name"];
    readonly description: "A definition of the project used for projects listing purposes";
    readonly properties: {
        readonly id: {
            readonly type: "string";
            readonly example: "dx-squad";
            readonly description: "The id of this project";
        };
        readonly name: {
            readonly type: "string";
            readonly example: "DX-Squad";
            readonly description: "The name of this project";
        };
        readonly description: {
            readonly type: "string";
            readonly nullable: true;
            readonly example: "DX squad feature release";
            readonly description: "Additional information about the project";
        };
        readonly health: {
            readonly type: "number";
            readonly example: 50;
            readonly description: "An indicator of the [project's health](https://docs.getunleash.io/reference/technical-debt#health-rating) on a scale from 0 to 100";
        };
        readonly featureCount: {
            readonly type: "number";
            readonly example: 10;
            readonly description: "The number of features this project has";
        };
        readonly memberCount: {
            readonly type: "number";
            readonly example: 4;
            readonly description: "The number of members this project has";
        };
        readonly createdAt: {
            readonly type: "string";
            readonly description: "When this project was created.";
            readonly example: "2023-07-27T12:12:28Z";
            readonly format: "date-time";
        };
        readonly updatedAt: {
            readonly type: "string";
            readonly format: "date-time";
            readonly nullable: true;
            readonly description: "When this project was last updated.";
            readonly example: "2023-07-28T12:12:28Z";
        };
        readonly favorite: {
            readonly type: "boolean";
            readonly example: true;
            readonly description: "`true` if the project was favorited, otherwise `false`.";
        };
        readonly mode: {
            readonly type: "string";
            readonly enum: readonly ["open", "protected"];
            readonly example: "open";
            readonly description: "The project's [collaboration mode](https://docs.getunleash.io/reference/project-collaboration-mode). Determines whether non-project members can submit change requests or not.";
        };
        readonly defaultStickiness: {
            readonly type: "string";
            readonly example: "userId";
            readonly description: "A default stickiness for the project affecting the default stickiness value for variants and Gradual Rollout strategy";
        };
    };
    readonly components: {};
};
export declare type ProjectSchema = FromSchema<typeof projectSchema>;
