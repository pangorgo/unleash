"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyFeaturesSchema = void 0;
const proxy_feature_schema_1 = require("./proxy-feature-schema");
exports.proxyFeaturesSchema = {
    $id: '#/components/schemas/proxyFeaturesSchema',
    type: 'object',
    required: ['toggles'],
    additionalProperties: false,
    description: 'Frontend SDK features list',
    properties: {
        toggles: {
            description: 'The actual features returned to the Frontend SDK',
            type: 'array',
            items: {
                $ref: proxy_feature_schema_1.proxyFeatureSchema.$id,
            },
        },
    },
    components: {
        schemas: {
            proxyFeatureSchema: proxy_feature_schema_1.proxyFeatureSchema,
        },
    },
};
//# sourceMappingURL=proxy-features-schema.js.map