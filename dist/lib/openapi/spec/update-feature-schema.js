"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeatureSchema = void 0;
const constraint_schema_1 = require("./constraint-schema");
exports.updateFeatureSchema = {
    $id: '#/components/schemas/updateFeatureSchema',
    type: 'object',
    description: 'Data used for updating a feature toggle',
    properties: {
        description: {
            type: 'string',
            example: 'Controls disabling of the comments section in case of an incident',
            description: 'Detailed description of the feature',
        },
        type: {
            type: 'string',
            example: 'kill-switch',
            description: 'Type of the toggle e.g. experiment, kill-switch, release, operational, permission',
        },
        stale: {
            type: 'boolean',
            example: true,
            description: '`true` if the feature is archived',
        },
        archived: {
            type: 'boolean',
            example: true,
            description: 'If `true` the feature toggle will be moved to the [archive](https://docs.getunleash.io/reference/archived-toggles) with a property `archivedAt` set to current time',
        },
        impressionData: {
            type: 'boolean',
            example: false,
            description: '`true` if the impression data collection is enabled for the feature',
        },
    },
    components: {
        schemas: {
            constraintSchema: constraint_schema_1.constraintSchema,
        },
    },
};
//# sourceMappingURL=update-feature-schema.js.map