import { FromSchema } from 'json-schema-to-ts';
export declare const toggleMaintenanceSchema: {
    readonly $id: "#/components/schemas/toggleMaintenanceSchema";
    readonly type: "object";
    readonly description: "Data used when to activate or deactivate maintenance mode for Unleash.";
    readonly required: readonly ["enabled"];
    readonly properties: {
        readonly enabled: {
            readonly description: "`true` if you want to activate maintenance mode, `false` if you want to deactivate it.";
            readonly type: "boolean";
            readonly example: true;
        };
    };
    readonly components: {};
};
export declare type ToggleMaintenanceSchema = FromSchema<typeof toggleMaintenanceSchema>;
