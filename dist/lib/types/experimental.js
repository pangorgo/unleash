"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultExperimentalOptions = void 0;
const unleash_client_1 = require("unleash-client");
const util_1 = require("../util");
const variant_1 = require("unleash-client/lib/variant");
const flags = {
    anonymiseEventLog: false,
    embedProxy: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_EXPERIMENTAL_EMBED_PROXY, true),
    embedProxyFrontend: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_EXPERIMENTAL_EMBED_PROXY_FRONTEND, true),
    responseTimeWithAppNameKillSwitch: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_RESPONSE_TIME_WITH_APP_NAME_KILL_SWITCH, false),
    maintenanceMode: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_EXPERIMENTAL_MAINTENANCE_MODE, false),
    messageBanner: {
        name: 'message-banner',
        enabled: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_EXPERIMENTAL_MESSAGE_BANNER, false),
        payload: {
            type: unleash_client_1.PayloadType.JSON,
            value: process.env.UNLEASH_EXPERIMENTAL_MESSAGE_BANNER_PAYLOAD ?? '',
        },
    },
    featuresExportImport: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_EXPERIMENTAL_FEATURES_EXPORT_IMPORT, true),
    caseInsensitiveInOperators: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_EXPERIMENTAL_CASE_INSENSITIVE_IN_OPERATORS, false),
    strictSchemaValidation: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_STRICT_SCHEMA_VALIDTION, false),
    proPlanAutoCharge: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_PRO_PLAN_AUTO_CHARGE, false),
    personalAccessTokensKillSwitch: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_PAT_KILL_SWITCH, false),
    migrationLock: (0, util_1.parseEnvVarBoolean)(process.env.MIGRATION_LOCK, true),
    demo: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_DEMO, false),
    googleAuthEnabled: (0, util_1.parseEnvVarBoolean)(process.env.GOOGLE_AUTH_ENABLED, false),
    disableBulkToggle: (0, util_1.parseEnvVarBoolean)(process.env.DISABLE_BULK_TOGGLE, false),
    disableNotifications: (0, util_1.parseEnvVarBoolean)(process.env.DISABLE_NOTIFICATIONS, false),
    newProjectLayout: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_EXPERIMENTAL_NEW_PROJECT_LAYOUT, false),
    strategyVariant: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_STRATEGY_VARIANT, false),
    slackAppAddon: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_SLACK_APP_ADDON, false),
    emitPotentiallyStaleEvents: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_EXPERIMENTAL_EMIT_POTENTIALLY_STALE_EVENTS, false),
    configurableFeatureTypeLifetimes: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_EXPERIMENTAL_CONFIGURABLE_FEATURE_TYPE_LIFETIMES, false),
    filterInvalidClientMetrics: (0, util_1.parseEnvVarBoolean)(process.env.FILTER_INVALID_CLIENT_METRICS, false),
    frontendNavigationUpdate: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_NAVIGATION_UPDATE, false),
    lastSeenByEnvironment: (0, util_1.parseEnvVarBoolean)(process.env.LAST_SEEN_BY_ENVIRONMENT, false),
    segmentChangeRequests: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_EXPERIMENTAL_SEGMENT_CHANGE_REQUESTS, false),
    changeRequestReject: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_EXPERIMENTAL_CHANGE_REQUEST_REJECT, false),
    customRootRolesKillSwitch: (0, util_1.parseEnvVarBoolean)(process.env.UNLEASH_EXPERIMENTAL_CUSTOM_ROOT_ROLES_KILL_SWITCH, false),
};
exports.defaultExperimentalOptions = {
    flags,
    externalResolver: {
        isEnabled: () => false,
        getVariant: () => (0, variant_1.getDefaultVariant)(),
    },
};
//# sourceMappingURL=experimental.js.map