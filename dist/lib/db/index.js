"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStores = void 0;
const event_store_1 = __importDefault(require("./event-store"));
const feature_toggle_store_1 = __importDefault(require("./feature-toggle-store"));
const feature_type_store_1 = __importDefault(require("./feature-type-store"));
const strategy_store_1 = __importDefault(require("./strategy-store"));
const client_instance_store_1 = __importDefault(require("./client-instance-store"));
const client_applications_store_1 = __importDefault(require("./client-applications-store"));
const context_field_store_1 = __importDefault(require("./context-field-store"));
const setting_store_1 = __importDefault(require("./setting-store"));
const user_store_1 = __importDefault(require("./user-store"));
const project_store_1 = __importDefault(require("./project-store"));
const tag_store_1 = __importDefault(require("./tag-store"));
const tag_type_store_1 = __importDefault(require("./tag-type-store"));
const addon_store_1 = __importDefault(require("./addon-store"));
const api_token_store_1 = require("./api-token-store");
const session_store_1 = __importDefault(require("./session-store"));
const access_store_1 = require("./access-store");
const reset_token_store_1 = require("./reset-token-store");
const user_feedback_store_1 = __importDefault(require("./user-feedback-store"));
const feature_strategy_store_1 = __importDefault(require("./feature-strategy-store"));
const feature_toggle_client_store_1 = __importDefault(require("./feature-toggle-client-store"));
const environment_store_1 = __importDefault(require("./environment-store"));
const feature_tag_store_1 = __importDefault(require("./feature-tag-store"));
const feature_environment_store_1 = require("./feature-environment-store");
const client_metrics_store_v2_1 = require("./client-metrics-store-v2");
const user_splash_store_1 = __importDefault(require("./user-splash-store"));
const role_store_1 = __importDefault(require("./role-store"));
const segment_store_1 = __importDefault(require("./segment-store"));
const group_store_1 = __importDefault(require("./group-store"));
const pat_store_1 = __importDefault(require("./pat-store"));
const public_signup_token_store_1 = require("./public-signup-token-store");
const favorite_features_store_1 = require("./favorite-features-store");
const favorite_projects_store_1 = require("./favorite-projects-store");
const account_store_1 = require("./account-store");
const project_stats_store_1 = __importDefault(require("./project-stats-store"));
const import_toggles_store_1 = require("../features/export-import-toggles/import-toggles-store");
const createStores = (config, db) => {
    const { getLogger, eventBus } = config;
    const eventStore = new event_store_1.default(db, getLogger);
    return {
        eventStore,
        featureToggleStore: new feature_toggle_store_1.default(db, eventBus, getLogger),
        featureTypeStore: new feature_type_store_1.default(db, getLogger),
        strategyStore: new strategy_store_1.default(db, getLogger),
        clientApplicationsStore: new client_applications_store_1.default(db, eventBus, getLogger),
        clientInstanceStore: new client_instance_store_1.default(db, eventBus, getLogger),
        clientMetricsStoreV2: new client_metrics_store_v2_1.ClientMetricsStoreV2(db, getLogger, config.flagResolver),
        contextFieldStore: new context_field_store_1.default(db, getLogger, config.flagResolver),
        settingStore: new setting_store_1.default(db, getLogger),
        userStore: new user_store_1.default(db, getLogger),
        accountStore: new account_store_1.AccountStore(db, getLogger),
        projectStore: new project_store_1.default(db, eventBus, getLogger, config.flagResolver),
        tagStore: new tag_store_1.default(db, eventBus, getLogger),
        tagTypeStore: new tag_type_store_1.default(db, eventBus, getLogger),
        addonStore: new addon_store_1.default(db, eventBus, getLogger),
        accessStore: new access_store_1.AccessStore(db, eventBus, getLogger),
        apiTokenStore: new api_token_store_1.ApiTokenStore(db, eventBus, getLogger),
        resetTokenStore: new reset_token_store_1.ResetTokenStore(db, eventBus, getLogger),
        sessionStore: new session_store_1.default(db, eventBus, getLogger),
        userFeedbackStore: new user_feedback_store_1.default(db, eventBus, getLogger),
        featureStrategiesStore: new feature_strategy_store_1.default(db, eventBus, getLogger, config.flagResolver),
        featureToggleClientStore: new feature_toggle_client_store_1.default(db, eventBus, getLogger, config.flagResolver),
        environmentStore: new environment_store_1.default(db, eventBus, getLogger),
        featureTagStore: new feature_tag_store_1.default(db, eventBus, getLogger),
        featureEnvironmentStore: new feature_environment_store_1.FeatureEnvironmentStore(db, eventBus, getLogger),
        userSplashStore: new user_splash_store_1.default(db, eventBus, getLogger),
        roleStore: new role_store_1.default(db, eventBus, getLogger),
        segmentStore: new segment_store_1.default(db, eventBus, getLogger, config.flagResolver),
        groupStore: new group_store_1.default(db),
        publicSignupTokenStore: new public_signup_token_store_1.PublicSignupTokenStore(db, eventBus, getLogger),
        patStore: new pat_store_1.default(db, getLogger),
        favoriteFeaturesStore: new favorite_features_store_1.FavoriteFeaturesStore(db, eventBus, getLogger),
        favoriteProjectsStore: new favorite_projects_store_1.FavoriteProjectsStore(db, eventBus, getLogger),
        projectStatsStore: new project_stats_store_1.default(db, eventBus, getLogger),
        importTogglesStore: new import_toggles_store_1.ImportTogglesStore(db),
    };
};
exports.createStores = createStores;
module.exports = {
    createStores: exports.createStores,
};
//# sourceMappingURL=index.js.map