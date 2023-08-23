"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateSchema = exports.sortOrderSchema = exports.updateEnvironmentSchema = exports.environmentSchema = exports.featureEnvironmentsSchema = exports.featureStrategySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const feature_schema_1 = require("../schema/feature-schema");
const strategy_schema_1 = __importDefault(require("./strategy-schema"));
const tag_schema_1 = require("./tag-schema");
const tag_type_schema_1 = require("./tag-type-schema");
const project_schema_1 = require("./project-schema");
const util_1 = require("../routes/util");
const segment_schema_1 = require("./segment-schema");
exports.featureStrategySchema = joi_1.default
    .object()
    .keys({
    id: joi_1.default.string().optional(),
    featureName: joi_1.default.string(),
    projectId: joi_1.default.string(),
    environment: joi_1.default.string(),
    parameters: joi_1.default.object().optional().allow(null),
    constraints: joi_1.default.array().optional(),
    strategyName: joi_1.default.string(),
})
    .options({ stripUnknown: true });
exports.featureEnvironmentsSchema = joi_1.default.object().keys({
    environment: joi_1.default.string(),
    featureName: joi_1.default.string(),
    enabled: joi_1.default.boolean(),
    variants: joi_1.default.array().items(feature_schema_1.variantsSchema).optional(),
});
exports.environmentSchema = joi_1.default.object().keys({
    name: util_1.nameType,
    displayName: joi_1.default.string().optional().allow(''),
    type: joi_1.default.string().required(),
    sortOrder: joi_1.default.number().optional(),
    enabled: joi_1.default.boolean().optional(),
    protected: joi_1.default.boolean().optional(),
});
exports.updateEnvironmentSchema = joi_1.default.object().keys({
    displayName: joi_1.default.string().optional().allow(''),
    type: joi_1.default.string().optional(),
    sortOrder: joi_1.default.number().optional(),
});
exports.sortOrderSchema = joi_1.default.object().pattern(/^/, joi_1.default.number());
exports.stateSchema = joi_1.default.object().keys({
    version: joi_1.default.number(),
    features: joi_1.default.array().optional().items(feature_schema_1.featureSchema),
    strategies: joi_1.default.array().optional().items(strategy_schema_1.default),
    tags: joi_1.default.array().optional().items(tag_schema_1.tagSchema),
    tagTypes: joi_1.default.array().optional().items(tag_type_schema_1.tagTypeSchema),
    featureTags: joi_1.default.array().optional().items(feature_schema_1.featureTagSchema),
    projects: joi_1.default.array().optional().items(project_schema_1.projectSchema),
    featureStrategies: joi_1.default.array().optional().items(exports.featureStrategySchema),
    featureEnvironments: joi_1.default
        .array()
        .optional()
        .items(exports.featureEnvironmentsSchema),
    environments: joi_1.default.array().optional().items(exports.environmentSchema),
    segments: joi_1.default.array().optional().items(segment_schema_1.segmentSchema),
    featureStrategySegments: joi_1.default
        .array()
        .optional()
        .items(segment_schema_1.featureStrategySegmentSchema),
});
//# sourceMappingURL=state-schema.js.map