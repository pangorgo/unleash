"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOpenApiSchema = exports.removeJsonSchemaProps = exports.schemas = void 0;
const spec_1 = require("./spec");
const util_1 = require("../util");
const util_2 = require("./util");
const url_1 = require("url");
const version_1 = __importDefault(require("../util/version"));
const maintenance_schema_1 = require("./spec/maintenance-schema");
const toggle_maintenance_schema_1 = require("./spec/toggle-maintenance-schema");
const bulk_registration_schema_1 = require("./spec/bulk-registration-schema");
const bulk_metrics_schema_1 = require("./spec/bulk-metrics-schema");
const client_metrics_env_schema_1 = require("./spec/client-metrics-env-schema");
const update_tags_schema_1 = require("./spec/update-tags-schema");
const batch_stale_schema_1 = require("./spec/batch-stale-schema");
const create_application_schema_1 = require("./spec/create-application-schema");
const context_field_strategies_schema_1 = require("./spec/context-field-strategies-schema");
const advanced_playground_environment_feature_schema_1 = require("./spec/advanced-playground-environment-feature-schema");
// All schemas in `openapi/spec` should be listed here.
exports.schemas = {
    adminCountSchema: spec_1.adminCountSchema,
    adminFeaturesQuerySchema: spec_1.adminFeaturesQuerySchema,
    addonParameterSchema: spec_1.addonParameterSchema,
    addonSchema: spec_1.addonSchema,
    addonCreateUpdateSchema: spec_1.addonCreateUpdateSchema,
    addonsSchema: spec_1.addonsSchema,
    addonTypeSchema: spec_1.addonTypeSchema,
    advancedPlaygroundEnvironmentFeatureSchema: advanced_playground_environment_feature_schema_1.advancedPlaygroundEnvironmentFeatureSchema,
    advancedPlaygroundFeatureSchema: spec_1.advancedPlaygroundFeatureSchema,
    advancedPlaygroundRequestSchema: spec_1.advancedPlaygroundRequestSchema,
    advancedPlaygroundResponseSchema: spec_1.advancedPlaygroundResponseSchema,
    apiTokenSchema: spec_1.apiTokenSchema,
    apiTokensSchema: spec_1.apiTokensSchema,
    applicationSchema: spec_1.applicationSchema,
    applicationsSchema: spec_1.applicationsSchema,
    batchFeaturesSchema: spec_1.batchFeaturesSchema,
    batchStaleSchema: batch_stale_schema_1.batchStaleSchema,
    bulkRegistrationSchema: bulk_registration_schema_1.bulkRegistrationSchema,
    bulkMetricsSchema: bulk_metrics_schema_1.bulkMetricsSchema,
    bulkToggleFeaturesSchema: spec_1.bulkToggleFeaturesSchema,
    changePasswordSchema: spec_1.changePasswordSchema,
    clientApplicationSchema: spec_1.clientApplicationSchema,
    clientFeatureSchema: spec_1.clientFeatureSchema,
    clientFeaturesQuerySchema: spec_1.clientFeaturesQuerySchema,
    clientFeaturesSchema: spec_1.clientFeaturesSchema,
    clientMetricsSchema: spec_1.clientMetricsSchema,
    clientMetricsEnvSchema: client_metrics_env_schema_1.clientMetricsEnvSchema,
    cloneFeatureSchema: spec_1.cloneFeatureSchema,
    constraintSchema: spec_1.constraintSchema,
    contextFieldSchema: spec_1.contextFieldSchema,
    contextFieldsSchema: spec_1.contextFieldsSchema,
    createApiTokenSchema: spec_1.createApiTokenSchema,
    createApplicationSchema: create_application_schema_1.createApplicationSchema,
    createFeatureSchema: spec_1.createFeatureSchema,
    createFeatureStrategySchema: spec_1.createFeatureStrategySchema,
    createInvitedUserSchema: spec_1.createInvitedUserSchema,
    createUserSchema: spec_1.createUserSchema,
    dateSchema: spec_1.dateSchema,
    edgeTokenSchema: spec_1.edgeTokenSchema,
    emailSchema: spec_1.emailSchema,
    environmentSchema: spec_1.environmentSchema,
    environmentProjectSchema: spec_1.environmentProjectSchema,
    environmentsSchema: spec_1.environmentsSchema,
    environmentsProjectSchema: spec_1.environmentsProjectSchema,
    eventSchema: spec_1.eventSchema,
    eventsSchema: spec_1.eventsSchema,
    exportResultSchema: spec_1.exportResultSchema,
    exportQuerySchema: spec_1.exportQuerySchema,
    featureEnvironmentMetricsSchema: spec_1.featureEnvironmentMetricsSchema,
    featureEnvironmentSchema: spec_1.featureEnvironmentSchema,
    featureEventsSchema: spec_1.featureEventsSchema,
    featureMetricsSchema: spec_1.featureMetricsSchema,
    featureSchema: spec_1.featureSchema,
    featuresSchema: spec_1.featuresSchema,
    featureStrategySchema: spec_1.featureStrategySchema,
    featureStrategySegmentSchema: spec_1.featureStrategySegmentSchema,
    featureTagSchema: spec_1.featureTagSchema,
    featureTypeSchema: spec_1.featureTypeSchema,
    featureTypesSchema: spec_1.featureTypesSchema,
    featureUsageSchema: spec_1.featureUsageSchema,
    featureVariantsSchema: spec_1.featureVariantsSchema,
    feedbackCreateSchema: spec_1.feedbackCreateSchema,
    feedbackUpdateSchema: spec_1.feedbackUpdateSchema,
    feedbackResponseSchema: spec_1.feedbackResponseSchema,
    groupSchema: spec_1.groupSchema,
    groupsSchema: spec_1.groupsSchema,
    groupUserModelSchema: spec_1.groupUserModelSchema,
    healthCheckSchema: spec_1.healthCheckSchema,
    healthOverviewSchema: spec_1.healthOverviewSchema,
    healthReportSchema: spec_1.healthReportSchema,
    idSchema: spec_1.idSchema,
    instanceAdminStatsSchema: spec_1.instanceAdminStatsSchema,
    legalValueSchema: spec_1.legalValueSchema,
    loginSchema: spec_1.loginSchema,
    maintenanceSchema: maintenance_schema_1.maintenanceSchema,
    toggleMaintenanceSchema: toggle_maintenance_schema_1.toggleMaintenanceSchema,
    meSchema: spec_1.meSchema,
    nameSchema: spec_1.nameSchema,
    overrideSchema: spec_1.overrideSchema,
    parametersSchema: spec_1.parametersSchema,
    passwordSchema: spec_1.passwordSchema,
    patchesSchema: spec_1.patchesSchema,
    patchSchema: spec_1.patchSchema,
    patSchema: spec_1.patSchema,
    patsSchema: spec_1.patsSchema,
    permissionSchema: spec_1.permissionSchema,
    playgroundConstraintSchema: spec_1.playgroundConstraintSchema,
    playgroundFeatureSchema: spec_1.playgroundFeatureSchema,
    playgroundRequestSchema: spec_1.playgroundRequestSchema,
    playgroundResponseSchema: spec_1.playgroundResponseSchema,
    playgroundSegmentSchema: spec_1.playgroundSegmentSchema,
    playgroundStrategySchema: spec_1.playgroundStrategySchema,
    profileSchema: spec_1.profileSchema,
    projectEnvironmentSchema: spec_1.projectEnvironmentSchema,
    projectSchema: spec_1.projectSchema,
    projectsSchema: spec_1.projectsSchema,
    proxyClientSchema: spec_1.proxyClientSchema,
    proxyFeatureSchema: spec_1.proxyFeatureSchema,
    proxyFeaturesSchema: spec_1.proxyFeaturesSchema,
    publicSignupTokenCreateSchema: spec_1.publicSignupTokenCreateSchema,
    publicSignupTokenSchema: spec_1.publicSignupTokenSchema,
    publicSignupTokensSchema: spec_1.publicSignupTokensSchema,
    publicSignupTokenUpdateSchema: spec_1.publicSignupTokenUpdateSchema,
    pushVariantsSchema: spec_1.pushVariantsSchema,
    projectStatsSchema: spec_1.projectStatsSchema,
    resetPasswordSchema: spec_1.resetPasswordSchema,
    requestsPerSecondSchema: spec_1.requestsPerSecondSchema,
    requestsPerSecondSegmentedSchema: spec_1.requestsPerSecondSegmentedSchema,
    roleSchema: spec_1.roleSchema,
    sdkContextSchema: spec_1.sdkContextSchema,
    searchEventsSchema: spec_1.searchEventsSchema,
    segmentSchema: spec_1.segmentSchema,
    setStrategySortOrderSchema: spec_1.setStrategySortOrderSchema,
    setUiConfigSchema: spec_1.setUiConfigSchema,
    sortOrderSchema: spec_1.sortOrderSchema,
    splashRequestSchema: spec_1.splashRequestSchema,
    splashResponseSchema: spec_1.splashResponseSchema,
    stateSchema: spec_1.stateSchema,
    strategiesSchema: spec_1.strategiesSchema,
    strategySchema: spec_1.strategySchema,
    tagsBulkAddSchema: spec_1.tagsBulkAddSchema,
    tagSchema: spec_1.tagSchema,
    tagsSchema: spec_1.tagsSchema,
    tagTypeSchema: spec_1.tagTypeSchema,
    tagTypesSchema: spec_1.tagTypesSchema,
    tagWithVersionSchema: spec_1.tagWithVersionSchema,
    tokenUserSchema: spec_1.tokenUserSchema,
    tokenStringListSchema: spec_1.tokenStringListSchema,
    uiConfigSchema: spec_1.uiConfigSchema,
    updateApiTokenSchema: spec_1.updateApiTokenSchema,
    updateFeatureSchema: spec_1.updateFeatureSchema,
    updateFeatureStrategySchema: spec_1.updateFeatureStrategySchema,
    updateTagTypeSchema: spec_1.updateTagTypeSchema,
    updateUserSchema: spec_1.updateUserSchema,
    updateTagsSchema: update_tags_schema_1.updateTagsSchema,
    createContextFieldSchema: spec_1.createContextFieldSchema,
    updateContextFieldSchema: spec_1.updateContextFieldSchema,
    upsertSegmentSchema: spec_1.upsertSegmentSchema,
    createStrategySchema: spec_1.createStrategySchema,
    updateStrategySchema: spec_1.updateStrategySchema,
    updateFeatureTypeLifetimeSchema: spec_1.updateFeatureTypeLifetimeSchema,
    userSchema: spec_1.userSchema,
    createUserResponseSchema: spec_1.createUserResponseSchema,
    usersGroupsBaseSchema: spec_1.usersGroupsBaseSchema,
    usersSchema: spec_1.usersSchema,
    usersSearchSchema: spec_1.usersSearchSchema,
    validatedEdgeTokensSchema: spec_1.validatedEdgeTokensSchema,
    validateFeatureSchema: spec_1.validateFeatureSchema,
    validatePasswordSchema: spec_1.validatePasswordSchema,
    validateTagTypeSchema: spec_1.validateTagTypeSchema,
    variantSchema: spec_1.variantSchema,
    variantFlagSchema: spec_1.variantFlagSchema,
    variantsSchema: spec_1.variantsSchema,
    versionSchema: spec_1.versionSchema,
    projectOverviewSchema: spec_1.projectOverviewSchema,
    importTogglesSchema: spec_1.importTogglesSchema,
    importTogglesValidateSchema: spec_1.importTogglesValidateSchema,
    importTogglesValidateItemSchema: spec_1.importTogglesValidateItemSchema,
    contextFieldStrategiesSchema: context_field_strategies_schema_1.contextFieldStrategiesSchema,
    telemetrySettingsSchema: spec_1.telemetrySettingsSchema,
    strategyVariantSchema: spec_1.strategyVariantSchema,
    createStrategyVariantSchema: spec_1.createStrategyVariantSchema,
    clientSegmentSchema: spec_1.clientSegmentSchema,
    createGroupSchema: spec_1.createGroupSchema,
};
// Remove JSONSchema keys that would result in an invalid OpenAPI spec.
const removeJsonSchemaProps = (schema) => {
    return (0, util_1.omitKeys)(schema, '$id', 'components');
};
exports.removeJsonSchemaProps = removeJsonSchemaProps;
const findRootUrl = (unleashUrl, baseUriPath) => {
    if (!baseUriPath) {
        return unleashUrl;
    }
    const baseUrl = new url_1.URL(unleashUrl);
    const url = baseUrl.pathname.indexOf(baseUriPath) >= 0
        ? `${baseUrl.protocol}//${baseUrl.host}`
        : baseUrl.toString();
    return baseUriPath.startsWith('/')
        ? new url_1.URL(baseUriPath, url).toString()
        : url;
};
const createOpenApiSchema = ({ unleashUrl, baseUriPath, }) => {
    const url = findRootUrl(unleashUrl, baseUriPath);
    return {
        openapi: '3.0.3',
        servers: baseUriPath ? [{ url }] : [],
        info: {
            title: 'Unleash API',
            version: version_1.default,
        },
        security: [{ apiKey: [] }],
        components: {
            securitySchemes: {
                apiKey: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                },
            },
            schemas: (0, util_1.mapValues)(exports.schemas, exports.removeJsonSchemaProps),
        },
        tags: util_2.openApiTags,
    };
};
exports.createOpenApiSchema = createOpenApiSchema;
__exportStar(require("./util"), exports);
__exportStar(require("./spec"), exports);
//# sourceMappingURL=index.js.map