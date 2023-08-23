import { FromSchema } from 'json-schema-to-ts';
export declare const exportQuerySchema: {
    readonly $id: "#/components/schemas/exportQuerySchema";
    readonly type: "object";
    readonly required: readonly ["environment"];
    readonly description: "Available query parameters for  the [deprecated export/import](https://docs.getunleash.io/reference/deploy/import-export) functionality.";
    readonly properties: {
        readonly environment: {
            readonly type: "string";
            readonly example: "development";
            readonly description: "The environment to export from";
        };
        readonly downloadFile: {
            readonly type: "boolean";
            readonly example: true;
            readonly description: "Whether to return a downloadable file";
        };
    };
    readonly oneOf: readonly [{
        readonly required: readonly ["features"];
        readonly properties: {
            readonly features: {
                readonly type: "array";
                readonly example: readonly ["MyAwesomeFeature"];
                readonly items: {
                    readonly type: "string";
                    readonly minLength: 1;
                };
                readonly description: "Selects features to export by name.";
            };
        };
    }, {
        readonly required: readonly ["tag"];
        readonly properties: {
            readonly tag: {
                readonly type: "string";
                readonly example: "release";
                readonly description: "Selects features to export by tag. Takes precedence over the features field.";
            };
        };
    }];
    readonly components: {
        readonly schemas: {};
    };
};
export declare type ExportQuerySchema = FromSchema<typeof exportQuerySchema>;
