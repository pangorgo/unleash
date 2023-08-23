"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationsSchema = void 0;
const application_schema_1 = require("./application-schema");
exports.applicationsSchema = {
    $id: '#/components/schemas/applicationsSchema',
    additionalProperties: false,
    description: 'An object containing a list of applications that have connected to Unleash via an SDK.',
    type: 'object',
    properties: {
        applications: {
            description: 'The list of applications that have connected to this Unleash instance.',
            type: 'array',
            items: {
                $ref: '#/components/schemas/applicationSchema',
            },
        },
    },
    components: {
        schemas: {
            applicationSchema: application_schema_1.applicationSchema,
        },
    },
};
//# sourceMappingURL=applications-schema.js.map