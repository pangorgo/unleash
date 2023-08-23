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
exports.eventType = exports.permissions = exports.Knex = exports.IAuthType = exports.RoleName = exports.LogLevel = exports.ApiUser = exports.User = exports.AuthenticationRequired = exports.Controller = exports.create = exports.start = void 0;
const stoppable_1 = __importDefault(require("stoppable"));
const util_1 = require("util");
const version_1 = __importDefault(require("./util/version"));
const migrator_1 = require("../migrator");
const app_1 = __importDefault(require("./app"));
const metrics_1 = require("./metrics");
const db_1 = require("./db");
const services_1 = require("./services");
const create_config_1 = require("./create-config");
const graceful_shutdown_1 = __importDefault(require("./util/graceful-shutdown"));
const db_pool_1 = require("./db/db-pool");
const session_db_1 = __importDefault(require("./middleware/session-db"));
// Types
const types_1 = require("./types");
Object.defineProperty(exports, "IAuthType", { enumerable: true, get: function () { return types_1.IAuthType; } });
Object.defineProperty(exports, "RoleName", { enumerable: true, get: function () { return types_1.RoleName; } });
const user_1 = __importDefault(require("./types/user"));
exports.User = user_1.default;
const api_user_1 = __importDefault(require("./types/api-user"));
exports.ApiUser = api_user_1.default;
const logger_1 = require("./logger");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return logger_1.LogLevel; } });
const authentication_required_1 = __importDefault(require("./types/authentication-required"));
exports.AuthenticationRequired = authentication_required_1.default;
const controller_1 = __importDefault(require("./routes/controller"));
exports.Controller = controller_1.default;
const knex_1 = require("knex");
Object.defineProperty(exports, "Knex", { enumerable: true, get: function () { return knex_1.Knex; } });
const permissions = __importStar(require("./types/permissions"));
exports.permissions = permissions;
const eventType = __importStar(require("./types/events"));
exports.eventType = eventType;
const db_lock_1 = require("./util/db-lock");
async function createApp(config, startApp) {
    // Database dependencies (stateful)
    const logger = config.getLogger('server-impl.js');
    const serverVersion = config.enterpriseVersion ?? version_1.default;
    const db = (0, db_pool_1.createDb)(config);
    const stores = (0, db_1.createStores)(config, db);
    const services = (0, services_1.createServices)(stores, config, db);
    if (!config.disableScheduler) {
        await (0, services_1.scheduleServices)(services);
    }
    const metricsMonitor = (0, metrics_1.createMetricsMonitor)();
    const unleashSession = (0, session_db_1.default)(config, db);
    const stopUnleash = async (server) => {
        logger.info('Shutting down Unleash...');
        if (server) {
            const stopServer = (0, util_1.promisify)(server.stop);
            await stopServer();
        }
        services.schedulerService.stop();
        metricsMonitor.stopMonitoring();
        stores.clientInstanceStore.destroy();
        services.clientMetricsServiceV2.destroy();
        services.proxyService.destroy();
        services.addonService.destroy();
        await db.destroy();
    };
    if (!config.server.secret) {
        const secret = await stores.settingStore.get('unleash.secret');
        // eslint-disable-next-line no-param-reassign
        config.server.secret = secret;
    }
    const app = await (0, app_1.default)(config, stores, services, unleashSession, db);
    await metricsMonitor.startMonitoring(config, stores, serverVersion, config.eventBus, services.instanceStatsService, db);
    const unleash = {
        stores,
        eventBus: config.eventBus,
        services,
        app,
        config,
        version: serverVersion,
    };
    if (config.import.file) {
        await services.stateService.importFile({
            file: config.import.file,
            dropBeforeImport: config.import.dropBeforeImport,
            userName: 'import',
            keepExisting: config.import.keepExisting,
        });
    }
    if (config.environmentEnableOverrides &&
        config.environmentEnableOverrides?.length > 0) {
        await services.environmentService.overrideEnabledProjects(config.environmentEnableOverrides);
    }
    return new Promise((resolve, reject) => {
        if (startApp) {
            const server = (0, stoppable_1.default)(app.listen(config.listen, () => logger.info('Unleash has started.', server.address())), config.server.gracefulShutdownTimeout);
            server.keepAliveTimeout = config.server.keepAliveTimeout;
            server.headersTimeout = config.server.headersTimeout;
            server.on('listening', () => {
                resolve({
                    ...unleash,
                    server,
                    stop: () => stopUnleash(server),
                });
            });
            server.on('error', reject);
        }
        else {
            resolve({ ...unleash, stop: stopUnleash });
        }
    });
}
async function start(opts = {}) {
    const config = (0, create_config_1.createConfig)(opts);
    const logger = config.getLogger('server-impl.js');
    try {
        if (config.db.disableMigration) {
            logger.info('DB migration: disabled');
        }
        else {
            logger.debug('DB migration: start');
            if (opts.flagResolver?.isEnabled('migrationLock')) {
                logger.info('Running migration with lock');
                const lock = (0, db_lock_1.withDbLock)(config.db, {
                    lockKey: db_lock_1.defaultLockKey,
                    timeout: db_lock_1.defaultTimeout,
                    logger,
                });
                await lock(migrator_1.migrateDb)(config);
            }
            else {
                await (0, migrator_1.migrateDb)(config);
            }
            logger.debug('DB migration: end');
        }
    }
    catch (err) {
        logger.error('Failed to migrate db', err);
        throw err;
    }
    const unleash = await createApp(config, true);
    if (config.server.gracefulShutdownEnable) {
        (0, graceful_shutdown_1.default)(unleash, logger);
    }
    return unleash;
}
exports.start = start;
async function create(opts) {
    const config = (0, create_config_1.createConfig)(opts);
    const logger = config.getLogger('server-impl.js');
    try {
        if (config.db.disableMigration) {
            logger.info('DB migrations disabled');
        }
        else {
            await (0, migrator_1.migrateDb)(config);
        }
    }
    catch (err) {
        logger.error('Failed to migrate db', err);
        throw err;
    }
    return createApp(config, false);
}
exports.create = create;
exports.default = {
    start,
    create,
};
//# sourceMappingURL=server-impl.js.map