import { FromSchema } from 'json-schema-to-ts';
export declare const parametersSchema: {
    readonly $id: "#/components/schemas/parametersSchema";
    readonly type: "object";
    readonly description: "A list of parameters for a strategy";
    readonly additionalProperties: {
        readonly type: "string";
    };
    readonly components: {};
};
export declare type ParametersSchema = FromSchema<typeof parametersSchema>;
