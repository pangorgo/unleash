"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patsSchema = void 0;
const pat_schema_1 = require("./pat-schema");
exports.patsSchema = {
    $id: '#/components/schemas/patsSchema',
    type: 'object',
    description: 'Contains a collection of [Personal Access Tokens](https://docs.getunleash.io/how-to/how-to-create-personal-access-tokens).',
    properties: {
        pats: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/patSchema',
            },
            description: 'A collection of Personal Access Tokens',
        },
    },
    components: {
        schemas: {
            patSchema: pat_schema_1.patSchema,
        },
    },
};
//# sourceMappingURL=pats-schema.js.map