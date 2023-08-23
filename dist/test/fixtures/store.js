"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fake_feature_strategies_store_1 = __importDefault(require("./fake-feature-strategies-store"));
const fake_client_instance_store_1 = __importDefault(require("./fake-client-instance-store"));
const fake_client_applications_store_1 = __importDefault(require("./fake-client-applications-store"));
const fake_feature_toggle_store_1 = __importDefault(require("./fake-feature-toggle-store"));
const fake_tag_store_1 = __importDefault(require("./fake-tag-store"));
const fake_tag_type_store_1 = __importDefault(require("./fake-tag-type-store"));
const fake_event_store_1 = __importDefault(require("./fake-event-store"));
const fake_context_field_store_1 = __importDefault(require("./fake-context-field-store"));
const fake_setting_store_1 = __importDefault(require("./fake-setting-store"));
const fake_addon_store_1 = __importDefault(require("./fake-addon-store"));
const fake_project_store_1 = __importDefault(require("./fake-project-store"));
const fake_user_store_1 = __importDefault(require("./fake-user-store"));
const fake_access_store_1 = __importDefault(require("./fake-access-store"));
const fake_user_feedback_store_1 = __importDefault(require("./fake-user-feedback-store"));
const fake_feature_tag_store_1 = __importDefault(require("./fake-feature-tag-store"));
const fake_environment_store_1 = __importDefault(require("./fake-environment-store"));
const fake_strategies_store_1 = __importDefault(require("./fake-strategies-store"));
const fake_session_store_1 = __importDefault(require("./fake-session-store"));
const fake_feature_environment_store_1 = __importDefault(require("./fake-feature-environment-store"));
const fake_api_token_store_1 = __importDefault(require("./fake-api-token-store"));
const fake_feature_type_store_1 = __importDefault(require("./fake-feature-type-store"));
const fake_reset_token_store_1 = __importDefault(require("./fake-reset-token-store"));
const fake_feature_toggle_client_store_1 = __importDefault(require("./fake-feature-toggle-client-store"));
const fake_client_metrics_store_v2_1 = __importDefault(require("./fake-client-metrics-store-v2"));
const fake_user_splash_store_1 = __importDefault(require("./fake-user-splash-store"));
const fake_role_store_1 = __importDefault(require("./fake-role-store"));
const fake_segment_store_1 = __importDefault(require("./fake-segment-store"));
const fake_group_store_1 = __importDefault(require("./fake-group-store"));
const fake_pat_store_1 = __importDefault(require("./fake-pat-store"));
const fake_public_signup_store_1 = __importDefault(require("./fake-public-signup-store"));
const fake_favorite_features_store_1 = __importDefault(require("./fake-favorite-features-store"));
const fake_favorite_projects_store_1 = __importDefault(require("./fake-favorite-projects-store"));
const fake_account_store_1 = require("./fake-account-store");
const fake_project_stats_store_1 = __importDefault(require("./fake-project-stats-store"));
const db = {
    select: () => ({
        from: () => Promise.resolve(),
    }),
};
const createStores = () => {
    return {
        db,
        clientApplicationsStore: new fake_client_applications_store_1.default(),
        clientMetricsStoreV2: new fake_client_metrics_store_v2_1.default(),
        clientInstanceStore: new fake_client_instance_store_1.default(),
        featureToggleStore: new fake_feature_toggle_store_1.default(),
        featureToggleClientStore: new fake_feature_toggle_client_store_1.default(),
        tagStore: new fake_tag_store_1.default(),
        tagTypeStore: new fake_tag_type_store_1.default(),
        eventStore: new fake_event_store_1.default(),
        strategyStore: new fake_strategies_store_1.default(),
        contextFieldStore: new fake_context_field_store_1.default(),
        settingStore: new fake_setting_store_1.default(),
        addonStore: new fake_addon_store_1.default(),
        projectStore: new fake_project_store_1.default(),
        userStore: new fake_user_store_1.default(),
        accessStore: new fake_access_store_1.default(),
        accountStore: new fake_account_store_1.FakeAccountStore(),
        userFeedbackStore: new fake_user_feedback_store_1.default(),
        featureStrategiesStore: new fake_feature_strategies_store_1.default(),
        featureTagStore: new fake_feature_tag_store_1.default(),
        environmentStore: new fake_environment_store_1.default(),
        featureEnvironmentStore: new fake_feature_environment_store_1.default(),
        apiTokenStore: new fake_api_token_store_1.default(),
        featureTypeStore: new fake_feature_type_store_1.default(),
        resetTokenStore: new fake_reset_token_store_1.default(),
        sessionStore: new fake_session_store_1.default(),
        userSplashStore: new fake_user_splash_store_1.default(),
        roleStore: new fake_role_store_1.default(),
        segmentStore: new fake_segment_store_1.default(),
        groupStore: new fake_group_store_1.default(),
        patStore: new fake_pat_store_1.default(),
        publicSignupTokenStore: new fake_public_signup_store_1.default(),
        favoriteFeaturesStore: new fake_favorite_features_store_1.default(),
        favoriteProjectsStore: new fake_favorite_projects_store_1.default(),
        projectStatsStore: new fake_project_stats_store_1.default(),
        importTogglesStore: {},
    };
};
exports.default = createStores;
//# sourceMappingURL=store.js.map