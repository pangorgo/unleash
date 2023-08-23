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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = exports.authTypeFromString = void 0;
const pg_connection_string_1 = require("pg-connection-string");
const deepmerge_1 = __importDefault(require("deepmerge"));
const fs = __importStar(require("fs"));
const option_1 = require("./types/option");
const logger_1 = require("./logger");
const default_custom_auth_deny_all_1 = require("./default-custom-auth-deny-all");
const format_base_uri_1 = require("./util/format-base-uri");
const date_fns_1 = require("date-fns");
const events_1 = __importDefault(require("events"));
const api_token_1 = require("./types/models/api-token");
const parseEnvVar_1 = require("./util/parseEnvVar");
const experimental_1 = require("./types/experimental");
const segments_1 = require("./util/segments");
const flag_resolver_1 = __importDefault(require("./util/flag-resolver"));
const validateOrigin_1 = require("./util/validateOrigin");
const safeToUpper = (s) => (s ? s.toUpperCase() : s);
function authTypeFromString(s, defaultType = option_1.IAuthType.OPEN_SOURCE) {
    const upperS = safeToUpper(s);
    return upperS && option_1.IAuthType[upperS] ? option_1.IAuthType[upperS] : defaultType;
}
exports.authTypeFromString = authTypeFromString;
function mergeAll(objects) {
    return deepmerge_1.default.all(objects.filter((i) => i));
}
function loadExperimental(options) {
    return {
        ...experimental_1.defaultExperimentalOptions,
        ...options.experimental,
        flags: {
            ...experimental_1.defaultExperimentalOptions.flags,
            ...options.experimental?.flags,
        },
    };
}
const defaultClientCachingOptions = {
    enabled: true,
    maxAge: (0, date_fns_1.hoursToMilliseconds)(1),
};
function loadClientCachingOptions(options) {
    let envs = {};
    if (process.env.CLIENT_FEATURE_CACHING_MAXAGE) {
        envs.maxAge = (0, parseEnvVar_1.parseEnvVarNumber)(process.env.CLIENT_FEATURE_CACHING_MAXAGE, 600);
    }
    if (process.env.CLIENT_FEATURE_CACHING_ENABLED) {
        envs.enabled = (0, parseEnvVar_1.parseEnvVarBoolean)(process.env.CLIENT_FEATURE_CACHING_ENABLED, true);
    }
    return mergeAll([
        defaultClientCachingOptions,
        options.clientFeatureCaching || {},
        envs,
    ]);
}
function loadUI(options) {
    const uiO = options.ui || {};
    const ui = {
        environment: 'Open Source',
    };
    return mergeAll([ui, uiO]);
}
const dateHandlingCallback = (connection, callback) => {
    connection.query("set datestyle to 'ISO, DMY';", (err) => {
        callback(err, connection);
    });
};
const defaultDbOptions = {
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    port: (0, parseEnvVar_1.parseEnvVarNumber)(process.env.DATABASE_PORT, 5432),
    database: process.env.DATABASE_NAME || 'unleash',
    ssl: process.env.DATABASE_SSL != null
        ? JSON.parse(process.env.DATABASE_SSL)
        : { rejectUnauthorized: false },
    driver: 'postgres',
    version: process.env.DATABASE_VERSION,
    acquireConnectionTimeout: (0, date_fns_1.secondsToMilliseconds)(30),
    pool: {
        min: (0, parseEnvVar_1.parseEnvVarNumber)(process.env.DATABASE_POOL_MIN, 0),
        max: (0, parseEnvVar_1.parseEnvVarNumber)(process.env.DATABASE_POOL_MAX, 4),
        idleTimeoutMillis: (0, parseEnvVar_1.parseEnvVarNumber)(process.env.DATABASE_POOL_IDLE_TIMEOUT_MS, (0, date_fns_1.secondsToMilliseconds)(30)),
        ...((0, parseEnvVar_1.parseEnvVarBoolean)(process.env.ALLOW_NON_STANDARD_DB_DATES, false)
            ? { afterCreate: dateHandlingCallback }
            : {}),
        propagateCreateError: false,
    },
    schema: process.env.DATABASE_SCHEMA || 'public',
    disableMigration: false,
    applicationName: process.env.DATABASE_APPLICATION_NAME || 'unleash',
};
const defaultSessionOption = {
    ttlHours: (0, parseEnvVar_1.parseEnvVarNumber)(process.env.SESSION_TTL_HOURS, 48),
    clearSiteDataOnLogout: (0, parseEnvVar_1.parseEnvVarBoolean)(process.env.SESSION_CLEAR_SITE_DATA_ON_LOGOUT, true),
    cookieName: 'unleash-session',
    db: true,
};
const defaultServerOption = {
    pipe: undefined,
    host: process.env.HTTP_HOST,
    port: (0, parseEnvVar_1.parseEnvVarNumber)(process.env.HTTP_PORT || process.env.PORT, 4242),
    baseUriPath: (0, format_base_uri_1.formatBaseUri)(process.env.BASE_URI_PATH),
    cdnPrefix: process.env.CDN_PREFIX,
    unleashUrl: process.env.UNLEASH_URL || 'http://localhost:4242',
    serverMetrics: true,
    enableHeapSnapshotEnpoint: (0, parseEnvVar_1.parseEnvVarBoolean)(process.env.ENABLE_HEAP_SNAPSHOT_ENPOINT, false),
    keepAliveTimeout: (0, date_fns_1.secondsToMilliseconds)((0, parseEnvVar_1.parseEnvVarNumber)(process.env.SERVER_KEEPALIVE_TIMEOUT, 15)),
    headersTimeout: (0, date_fns_1.secondsToMilliseconds)(61),
    enableRequestLogger: false,
    gracefulShutdownEnable: (0, parseEnvVar_1.parseEnvVarBoolean)(process.env.GRACEFUL_SHUTDOWN_ENABLE, true),
    gracefulShutdownTimeout: (0, parseEnvVar_1.parseEnvVarNumber)(process.env.GRACEFUL_SHUTDOWN_TIMEOUT, (0, date_fns_1.secondsToMilliseconds)(1)),
    secret: process.env.UNLEASH_SECRET || 'super-secret',
};
const defaultVersionOption = {
    url: process.env.UNLEASH_VERSION_URL || 'https://version.unleash.run',
    enable: (0, parseEnvVar_1.parseEnvVarBoolean)(process.env.CHECK_VERSION, true),
};
const defaultAuthentication = {
    enableApiToken: (0, parseEnvVar_1.parseEnvVarBoolean)(process.env.AUTH_ENABLE_API_TOKEN, true),
    type: authTypeFromString(process.env.AUTH_TYPE),
    customAuthHandler: default_custom_auth_deny_all_1.defaultCustomAuthDenyAll,
    createAdminUser: true,
    initApiTokens: [],
};
const defaultImport = {
    file: process.env.IMPORT_FILE,
    dropBeforeImport: (0, parseEnvVar_1.parseEnvVarBoolean)(process.env.IMPORT_DROP_BEFORE_IMPORT, false),
    keepExisting: (0, parseEnvVar_1.parseEnvVarBoolean)(process.env.IMPORT_KEEP_EXISTING, false),
};
const defaultEmail = {
    host: process.env.EMAIL_HOST,
    secure: (0, parseEnvVar_1.parseEnvVarBoolean)(process.env.EMAIL_SECURE, false),
    port: (0, parseEnvVar_1.parseEnvVarNumber)(process.env.EMAIL_PORT, 587),
    sender: process.env.EMAIL_SENDER || 'noreply@getunleash.io',
    smtpuser: process.env.EMAIL_USER,
    smtppass: process.env.EMAIL_PASSWORD,
};
const dbPort = (dbConfig) => {
    if (typeof dbConfig.port === 'string') {
        // eslint-disable-next-line no-param-reassign
        dbConfig.port = Number.parseInt(dbConfig.port, 10);
    }
    return dbConfig;
};
const removeUndefinedKeys = (o) => Object.keys(o).reduce((a, key) => {
    if (o[key] !== undefined) {
        // eslint-disable-next-line no-param-reassign
        a[key] = o[key];
        return a;
    }
    return a;
}, {});
const formatServerOptions = (serverOptions) => {
    if (!serverOptions) {
        return {
            baseUriPath: (0, format_base_uri_1.formatBaseUri)(process.env.BASE_URI_PATH),
        };
    }
    /* eslint-disable-next-line */
    return {
        ...serverOptions,
        baseUriPath: (0, format_base_uri_1.formatBaseUri)(process.env.BASE_URI_PATH || serverOptions.baseUriPath),
    };
};
const loadTokensFromString = (tokenString, tokenType) => {
    if (!tokenString) {
        return [];
    }
    const initApiTokens = tokenString.split(/,\s?/);
    const tokens = initApiTokens.map((secret) => {
        const [project = '*', rest] = secret.split(':');
        const [environment = '*'] = rest.split('.');
        const token = {
            createdAt: undefined,
            project,
            environment,
            secret,
            type: tokenType,
            tokenName: 'admin',
        };
        (0, api_token_1.validateApiToken)((0, api_token_1.mapLegacyToken)(token));
        return token;
    });
    return tokens;
};
const loadInitApiTokens = () => {
    return [
        ...loadTokensFromString(process.env.INIT_ADMIN_API_TOKENS, api_token_1.ApiTokenType.ADMIN),
        ...loadTokensFromString(process.env.INIT_CLIENT_API_TOKENS, api_token_1.ApiTokenType.CLIENT),
        ...loadTokensFromString(process.env.INIT_FRONTEND_API_TOKENS, api_token_1.ApiTokenType.FRONTEND),
    ];
};
const loadEnvironmentEnableOverrides = () => {
    const environmentsString = process.env.ENABLED_ENVIRONMENTS;
    if (environmentsString) {
        return environmentsString.split(',');
    }
    return [];
};
const parseCspConfig = (cspConfig) => {
    if (!cspConfig) {
        return undefined;
    }
    return {
        defaultSrc: cspConfig.defaultSrc || [],
        fontSrc: cspConfig.fontSrc || [],
        scriptSrc: cspConfig.scriptSrc || [],
        imgSrc: cspConfig.imgSrc || [],
        styleSrc: cspConfig.styleSrc || [],
        connectSrc: cspConfig.connectSrc || [],
    };
};
const parseCspEnvironmentVariables = () => {
    const defaultSrc = process.env.CSP_ALLOWED_DEFAULT?.split(',') || [];
    const fontSrc = process.env.CSP_ALLOWED_FONT?.split(',') || [];
    const styleSrc = process.env.CSP_ALLOWED_STYLE?.split(',') || [];
    const scriptSrc = process.env.CSP_ALLOWED_SCRIPT?.split(',') || [];
    const imgSrc = process.env.CSP_ALLOWED_IMG?.split(',') || [];
    const connectSrc = process.env.CSP_ALLOWED_CONNECT?.split(',') || [];
    return {
        defaultSrc,
        fontSrc,
        styleSrc,
        scriptSrc,
        imgSrc,
        connectSrc,
    };
};
const parseFrontendApiOrigins = (options) => {
    const frontendApiOrigins = (0, parseEnvVar_1.parseEnvVarStrings)(process.env.UNLEASH_FRONTEND_API_ORIGINS, options.frontendApiOrigins || ['*']);
    const error = (0, validateOrigin_1.validateOrigins)(frontendApiOrigins);
    if (error) {
        throw new Error(error);
    }
    return frontendApiOrigins;
};
function createConfig(options) {
    let extraDbOptions = {};
    if (options.databaseUrl) {
        extraDbOptions = (0, pg_connection_string_1.parse)(options.databaseUrl);
    }
    else if (process.env.DATABASE_URL) {
        extraDbOptions = (0, pg_connection_string_1.parse)(process.env.DATABASE_URL);
    }
    let fileDbOptions = {};
    if (options.databaseUrlFile && fs.existsSync(options.databaseUrlFile)) {
        fileDbOptions = (0, pg_connection_string_1.parse)(fs.readFileSync(options.databaseUrlFile, 'utf-8'));
    }
    else if (process.env.DATABASE_URL_FILE &&
        fs.existsSync(process.env.DATABASE_URL_FILE)) {
        fileDbOptions = (0, pg_connection_string_1.parse)(fs.readFileSync(process.env.DATABASE_URL_FILE, 'utf-8'));
    }
    const db = mergeAll([
        defaultDbOptions,
        dbPort(extraDbOptions),
        dbPort(fileDbOptions),
        options.db || {},
    ]);
    const session = mergeAll([
        defaultSessionOption,
        options.session || {},
    ]);
    const logLevel = options.logLevel || logger_1.LogLevel[process.env.LOG_LEVEL] || logger_1.LogLevel.error;
    const getLogger = options.getLogger || (0, logger_1.getDefaultLogProvider)(logLevel);
    (0, logger_1.validateLogProvider)(getLogger);
    const server = mergeAll([
        defaultServerOption,
        formatServerOptions(options.server) || {},
    ]);
    const versionCheck = mergeAll([
        defaultVersionOption,
        options.versionCheck || {},
    ]);
    const telemetry = options.telemetry ||
        (0, parseEnvVar_1.parseEnvVarBoolean)(process.env.SEND_TELEMETRY, true);
    const initApiTokens = loadInitApiTokens();
    const authentication = mergeAll([
        defaultAuthentication,
        options.authentication
            ? removeUndefinedKeys(options.authentication)
            : options.authentication,
        { initApiTokens: initApiTokens },
    ]);
    const environmentEnableOverrides = loadEnvironmentEnableOverrides();
    const importSetting = mergeAll([
        defaultImport,
        options.import || {},
    ]);
    const experimental = loadExperimental(options);
    const flagResolver = new flag_resolver_1.default(experimental);
    const ui = loadUI(options);
    const email = mergeAll([defaultEmail, options.email || {}]);
    let listen;
    if (server.pipe) {
        listen = { path: server.pipe };
    }
    else {
        listen = { host: server.host || undefined, port: server.port };
    }
    const frontendApi = options.frontendApi || {
        refreshIntervalInMs: (0, parseEnvVar_1.parseEnvVarNumber)(process.env.FRONTEND_API_REFRESH_INTERVAL_MS, 20000),
    };
    const secureHeaders = options.secureHeaders ||
        (0, parseEnvVar_1.parseEnvVarBoolean)(process.env.SECURE_HEADERS, false);
    const enableOAS = (0, parseEnvVar_1.parseEnvVarBoolean)(process.env.ENABLE_OAS, true);
    const additionalCspAllowedDomains = parseCspConfig(options.additionalCspAllowedDomains) ||
        parseCspEnvironmentVariables();
    const inlineSegmentConstraints = typeof options.inlineSegmentConstraints === 'boolean'
        ? options.inlineSegmentConstraints
        : true;
    const segmentValuesLimit = (0, parseEnvVar_1.parseEnvVarNumber)(process.env.UNLEASH_SEGMENT_VALUES_LIMIT, segments_1.DEFAULT_SEGMENT_VALUES_LIMIT);
    const strategySegmentsLimit = (0, parseEnvVar_1.parseEnvVarNumber)(process.env.UNLEASH_STRATEGY_SEGMENTS_LIMIT, segments_1.DEFAULT_STRATEGY_SEGMENTS_LIMIT);
    const accessControlMaxAge = options.accessControlMaxAge
        ? options.accessControlMaxAge
        : (0, parseEnvVar_1.parseEnvVarNumber)(process.env.ACCESS_CONTROL_MAX_AGE, 86400);
    const clientFeatureCaching = loadClientCachingOptions(options);
    const prometheusApi = options.prometheusApi || process.env.PROMETHEUS_API;
    return {
        db,
        session,
        getLogger,
        server,
        listen,
        versionCheck,
        telemetry,
        authentication,
        ui,
        import: importSetting,
        experimental,
        flagResolver,
        frontendApi,
        email,
        secureHeaders,
        enableOAS,
        preHook: options.preHook,
        preRouterHook: options.preRouterHook,
        enterpriseVersion: options.enterpriseVersion,
        eventBus: new events_1.default(),
        environmentEnableOverrides,
        additionalCspAllowedDomains,
        frontendApiOrigins: parseFrontendApiOrigins(options),
        inlineSegmentConstraints,
        segmentValuesLimit,
        strategySegmentsLimit,
        clientFeatureCaching,
        accessControlMaxAge,
        prometheusApi,
        publicFolder: options.publicFolder,
        disableScheduler: options.disableScheduler,
    };
}
exports.createConfig = createConfig;
module.exports = {
    createConfig,
    authTypeFromString,
};
//# sourceMappingURL=create-config.js.map