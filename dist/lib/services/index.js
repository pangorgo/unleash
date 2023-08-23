"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = exports.FavoritesService = exports.InstanceStatsService = exports.LastSeenService = exports.PublicSignupTokenService = exports.PatService = exports.EdgeService = exports.ProxyService = exports.GroupService = exports.PlaygroundService = exports.ClientSpecService = exports.OpenApiService = exports.SegmentService = exports.UserSplashService = exports.ProjectHealthService = exports.FeatureTagService = exports.EnvironmentService = exports.FeatureToggleService = exports.UserFeedbackService = exports.SessionService = exports.SettingService = exports.ResetTokenService = exports.UserService = exports.ApiTokenService = exports.AccessService = exports.EmailService = exports.VersionService = exports.ContextService = exports.AddonService = exports.StrategyService = exports.TagService = exports.TagTypeService = exports.ClientMetricsServiceV2 = exports.ClientInstanceService = exports.StateService = exports.ProjectService = exports.HealthService = exports.EventService = exports.FeatureTypeService = exports.createServices = exports.scheduleServices = void 0;
const feature_type_service_1 = __importDefault(require("./feature-type-service"));
exports.FeatureTypeService = feature_type_service_1.default;
const event_service_1 = __importDefault(require("./event-service"));
exports.EventService = event_service_1.default;
const health_service_1 = __importDefault(require("./health-service"));
exports.HealthService = health_service_1.default;
const project_service_1 = __importDefault(require("./project-service"));
exports.ProjectService = project_service_1.default;
const state_service_1 = __importDefault(require("./state-service"));
exports.StateService = state_service_1.default;
const instance_service_1 = __importDefault(require("./client-metrics/instance-service"));
exports.ClientInstanceService = instance_service_1.default;
const metrics_service_v2_1 = __importDefault(require("./client-metrics/metrics-service-v2"));
exports.ClientMetricsServiceV2 = metrics_service_v2_1.default;
const tag_type_service_1 = __importDefault(require("./tag-type-service"));
exports.TagTypeService = tag_type_service_1.default;
const tag_service_1 = __importDefault(require("./tag-service"));
exports.TagService = tag_service_1.default;
const strategy_service_1 = __importDefault(require("./strategy-service"));
exports.StrategyService = strategy_service_1.default;
const addon_service_1 = __importDefault(require("./addon-service"));
exports.AddonService = addon_service_1.default;
const context_service_1 = __importDefault(require("./context-service"));
exports.ContextService = context_service_1.default;
const version_service_1 = __importDefault(require("./version-service"));
exports.VersionService = version_service_1.default;
const email_service_1 = require("./email-service");
Object.defineProperty(exports, "EmailService", { enumerable: true, get: function () { return email_service_1.EmailService; } });
const access_service_1 = require("./access-service");
Object.defineProperty(exports, "AccessService", { enumerable: true, get: function () { return access_service_1.AccessService; } });
const api_token_service_1 = require("./api-token-service");
Object.defineProperty(exports, "ApiTokenService", { enumerable: true, get: function () { return api_token_service_1.ApiTokenService; } });
const user_service_1 = __importDefault(require("./user-service"));
exports.UserService = user_service_1.default;
const reset_token_service_1 = __importDefault(require("./reset-token-service"));
exports.ResetTokenService = reset_token_service_1.default;
const setting_service_1 = __importDefault(require("./setting-service"));
exports.SettingService = setting_service_1.default;
const session_service_1 = __importDefault(require("./session-service"));
exports.SessionService = session_service_1.default;
const user_feedback_service_1 = __importDefault(require("./user-feedback-service"));
exports.UserFeedbackService = user_feedback_service_1.default;
const feature_toggle_service_1 = __importDefault(require("./feature-toggle-service"));
exports.FeatureToggleService = feature_toggle_service_1.default;
const environment_service_1 = __importDefault(require("./environment-service"));
exports.EnvironmentService = environment_service_1.default;
const feature_tag_service_1 = __importDefault(require("./feature-tag-service"));
exports.FeatureTagService = feature_tag_service_1.default;
const project_health_service_1 = __importDefault(require("./project-health-service"));
exports.ProjectHealthService = project_health_service_1.default;
const user_splash_service_1 = __importDefault(require("./user-splash-service"));
exports.UserSplashService = user_splash_service_1.default;
const segment_service_1 = require("./segment-service");
Object.defineProperty(exports, "SegmentService", { enumerable: true, get: function () { return segment_service_1.SegmentService; } });
const openapi_service_1 = require("./openapi-service");
Object.defineProperty(exports, "OpenApiService", { enumerable: true, get: function () { return openapi_service_1.OpenApiService; } });
const client_spec_service_1 = require("./client-spec-service");
Object.defineProperty(exports, "ClientSpecService", { enumerable: true, get: function () { return client_spec_service_1.ClientSpecService; } });
const playground_service_1 = require("../features/playground/playground-service");
Object.defineProperty(exports, "PlaygroundService", { enumerable: true, get: function () { return playground_service_1.PlaygroundService; } });
const group_service_1 = require("./group-service");
Object.defineProperty(exports, "GroupService", { enumerable: true, get: function () { return group_service_1.GroupService; } });
const proxy_service_1 = require("./proxy-service");
Object.defineProperty(exports, "ProxyService", { enumerable: true, get: function () { return proxy_service_1.ProxyService; } });
const edge_service_1 = __importDefault(require("./edge-service"));
exports.EdgeService = edge_service_1.default;
const pat_service_1 = __importDefault(require("./pat-service"));
exports.PatService = pat_service_1.default;
const public_signup_token_service_1 = require("./public-signup-token-service");
Object.defineProperty(exports, "PublicSignupTokenService", { enumerable: true, get: function () { return public_signup_token_service_1.PublicSignupTokenService; } });
const last_seen_service_1 = require("./client-metrics/last-seen-service");
Object.defineProperty(exports, "LastSeenService", { enumerable: true, get: function () { return last_seen_service_1.LastSeenService; } });
const instance_stats_service_1 = require("./instance-stats-service");
Object.defineProperty(exports, "InstanceStatsService", { enumerable: true, get: function () { return instance_stats_service_1.InstanceStatsService; } });
const favorites_service_1 = require("./favorites-service");
Object.defineProperty(exports, "FavoritesService", { enumerable: true, get: function () { return favorites_service_1.FavoritesService; } });
const maintenance_service_1 = __importDefault(require("./maintenance-service"));
const date_fns_1 = require("date-fns");
const account_service_1 = require("./account-service");
const scheduler_service_1 = require("./scheduler-service");
Object.defineProperty(exports, "SchedulerService", { enumerable: true, get: function () { return scheduler_service_1.SchedulerService; } });
const createExportImportService_1 = require("../features/export-import-toggles/createExportImportService");
const createChangeRequestAccessReadModel_1 = require("../features/change-request-access-service/createChangeRequestAccessReadModel");
const configuration_revision_service_1 = __importDefault(require("../features/feature-toggle/configuration-revision-service"));
const features_1 = require("../features");
const event_announcer_service_1 = __importDefault(require("./event-announcer-service"));
const createGroupService_1 = require("../features/group/createGroupService");
// TODO: will be moved to scheduler feature directory
const scheduleServices = async (services) => {
    const { schedulerService, apiTokenService, instanceStatsService, clientInstanceService, projectService, projectHealthService, configurationRevisionService, maintenanceService, eventAnnouncerService, featureToggleService, } = services;
    if (await maintenanceService.isMaintenanceMode()) {
        schedulerService.pause();
    }
    schedulerService.schedule(apiTokenService.fetchActiveTokens.bind(apiTokenService), (0, date_fns_1.minutesToMilliseconds)(1));
    schedulerService.schedule(apiTokenService.updateLastSeen.bind(apiTokenService), (0, date_fns_1.minutesToMilliseconds)(3));
    schedulerService.schedule(instanceStatsService.refreshStatsSnapshot.bind(instanceStatsService), (0, date_fns_1.minutesToMilliseconds)(5));
    schedulerService.schedule(clientInstanceService.removeInstancesOlderThanTwoDays.bind(clientInstanceService), (0, date_fns_1.hoursToMilliseconds)(24));
    schedulerService.schedule(projectService.statusJob.bind(projectService), (0, date_fns_1.hoursToMilliseconds)(24));
    schedulerService.schedule(projectHealthService.setHealthRating.bind(projectHealthService), (0, date_fns_1.hoursToMilliseconds)(1));
    schedulerService.schedule(configurationRevisionService.updateMaxRevisionId.bind(configurationRevisionService), (0, date_fns_1.secondsToMilliseconds)(1));
    schedulerService.schedule(eventAnnouncerService.publishUnannouncedEvents.bind(eventAnnouncerService), (0, date_fns_1.secondsToMilliseconds)(1));
    schedulerService.schedule(featureToggleService.updatePotentiallyStaleFeatures.bind(featureToggleService), (0, date_fns_1.minutesToMilliseconds)(1));
};
exports.scheduleServices = scheduleServices;
const createServices = (stores, config, db) => {
    const groupService = new group_service_1.GroupService(stores, config);
    const accessService = new access_service_1.AccessService(stores, config, groupService);
    const apiTokenService = new api_token_service_1.ApiTokenService(stores, config);
    const clientInstanceService = new instance_service_1.default(stores, config);
    const lastSeenService = new last_seen_service_1.LastSeenService(stores, config);
    const clientMetricsServiceV2 = new metrics_service_v2_1.default(stores, config, lastSeenService);
    const contextService = new context_service_1.default(stores, config);
    const emailService = new email_service_1.EmailService(config.email, config.getLogger);
    const eventService = new event_service_1.default(stores, config);
    const featureTypeService = new feature_type_service_1.default(stores, config);
    const resetTokenService = new reset_token_service_1.default(stores, config);
    const stateService = new state_service_1.default(stores, config);
    const strategyService = new strategy_service_1.default(stores, config);
    const tagService = new tag_service_1.default(stores, config);
    const tagTypeService = new tag_type_service_1.default(stores, config);
    const addonService = new addon_service_1.default(stores, config, tagTypeService);
    const sessionService = new session_service_1.default(stores, config);
    const settingService = new setting_service_1.default(stores, config);
    const userService = new user_service_1.default(stores, config, {
        accessService,
        resetTokenService,
        emailService,
        sessionService,
        settingService,
    });
    const accountService = new account_service_1.AccountService(stores, config, {
        accessService,
    });
    const versionService = new version_service_1.default(stores, config);
    const healthService = new health_service_1.default(stores, config);
    const userFeedbackService = new user_feedback_service_1.default(stores, config);
    const changeRequestAccessReadModel = db
        ? (0, createChangeRequestAccessReadModel_1.createChangeRequestAccessReadModel)(db, config)
        : (0, createChangeRequestAccessReadModel_1.createFakeChangeRequestAccessService)();
    const segmentService = new segment_service_1.SegmentService(stores, changeRequestAccessReadModel, config);
    const featureToggleServiceV2 = new feature_toggle_service_1.default(stores, config, segmentService, accessService, changeRequestAccessReadModel);
    const environmentService = new environment_service_1.default(stores, config);
    const featureTagService = new feature_tag_service_1.default(stores, config);
    const favoritesService = new favorites_service_1.FavoritesService(stores, config);
    const projectService = new project_service_1.default(stores, config, accessService, featureToggleServiceV2, groupService, favoritesService);
    const projectHealthService = new project_health_service_1.default(stores, config, projectService);
    // TODO: this is a temporary seam to enable packaging by feature
    const exportImportService = db
        ? (0, createExportImportService_1.createExportImportTogglesService)(db, config)
        : (0, createExportImportService_1.createFakeExportImportTogglesService)(config);
    const transactionalExportImportService = (txDb) => (0, createExportImportService_1.createExportImportTogglesService)(txDb, config);
    const transactionalFeatureToggleService = (txDb) => (0, features_1.createFeatureToggleService)(txDb, config);
    const transactionalGroupService = (txDb) => (0, createGroupService_1.createGroupService)(txDb, config);
    const userSplashService = new user_splash_service_1.default(stores, config);
    const openApiService = new openapi_service_1.OpenApiService(config);
    const clientSpecService = new client_spec_service_1.ClientSpecService(config);
    const playgroundService = new playground_service_1.PlaygroundService(config, {
        featureToggleServiceV2,
        segmentService,
    });
    const configurationRevisionService = new configuration_revision_service_1.default(stores, config);
    const proxyService = new proxy_service_1.ProxyService(config, stores, {
        featureToggleServiceV2,
        clientMetricsServiceV2,
        segmentService,
        settingService,
        configurationRevisionService,
    });
    const edgeService = new edge_service_1.default(stores, config);
    const patService = new pat_service_1.default(stores, config);
    const publicSignupTokenService = new public_signup_token_service_1.PublicSignupTokenService(stores, config, userService);
    const instanceStatsService = new instance_stats_service_1.InstanceStatsService(stores, config, versionService);
    const schedulerService = new scheduler_service_1.SchedulerService(config.getLogger);
    const maintenanceService = new maintenance_service_1.default(stores, config, settingService, schedulerService);
    const eventAnnouncerService = new event_announcer_service_1.default(stores, config);
    return {
        accessService,
        accountService,
        addonService,
        eventAnnouncerService,
        featureToggleService: featureToggleServiceV2,
        featureToggleServiceV2,
        featureTypeService,
        healthService,
        projectService,
        stateService,
        strategyService,
        tagTypeService,
        tagService,
        clientInstanceService,
        clientMetricsServiceV2,
        contextService,
        versionService,
        apiTokenService,
        emailService,
        userService,
        resetTokenService,
        eventService,
        environmentService,
        settingService,
        sessionService,
        userFeedbackService,
        featureTagService,
        projectHealthService,
        userSplashService,
        segmentService,
        openApiService,
        clientSpecService,
        playgroundService,
        groupService,
        proxyService,
        edgeService,
        patService,
        publicSignupTokenService,
        lastSeenService,
        instanceStatsService,
        favoritesService,
        maintenanceService,
        exportImportService,
        transactionalExportImportService,
        schedulerService,
        configurationRevisionService,
        transactionalFeatureToggleService,
        transactionalGroupService,
    };
};
exports.createServices = createServices;
//# sourceMappingURL=index.js.map