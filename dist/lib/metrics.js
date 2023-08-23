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
exports.createMetricsMonitor = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
const events = __importStar(require("./metric-events"));
const events_1 = require("./types/events");
const date_fns_1 = require("date-fns");
class MetricsMonitor {
    constructor() {
        this.timer = null;
        this.poolMetricsTimer = null;
    }
    startMonitoring(config, stores, version, eventBus, instanceStatsService, db) {
        if (!config.server.serverMetrics) {
            return;
        }
        const { eventStore } = stores;
        prom_client_1.default.collectDefaultMetrics();
        const requestDuration = new prom_client_1.default.Summary({
            name: 'http_request_duration_milliseconds',
            help: 'App response time',
            labelNames: ['path', 'method', 'status', 'appName'],
            percentiles: [0.1, 0.5, 0.9, 0.95, 0.99],
            maxAgeSeconds: 600,
            ageBuckets: 5,
        });
        const dbDuration = new prom_client_1.default.Summary({
            name: 'db_query_duration_seconds',
            help: 'DB query duration time',
            labelNames: ['store', 'action'],
            percentiles: [0.1, 0.5, 0.9, 0.95, 0.99],
            maxAgeSeconds: 600,
            ageBuckets: 5,
        });
        const featureToggleUpdateTotal = new prom_client_1.default.Counter({
            name: 'feature_toggle_update_total',
            help: 'Number of times a toggle has been updated. Environment label would be "n/a" when it is not available, e.g. when a feature toggle is created.',
            labelNames: ['toggle', 'project', 'environment'],
        });
        const featureToggleUsageTotal = new prom_client_1.default.Counter({
            name: 'feature_toggle_usage_total',
            help: 'Number of times a feature toggle has been used',
            labelNames: ['toggle', 'active', 'appName'],
        });
        const featureTogglesTotal = new prom_client_1.default.Gauge({
            name: 'feature_toggles_total',
            help: 'Number of feature toggles',
            labelNames: ['version'],
        });
        const usersTotal = new prom_client_1.default.Gauge({
            name: 'users_total',
            help: 'Number of users',
        });
        const projectsTotal = new prom_client_1.default.Gauge({
            name: 'projects_total',
            help: 'Number of projects',
        });
        const environmentsTotal = new prom_client_1.default.Gauge({
            name: 'environments_total',
            help: 'Number of environments',
        });
        const groupsTotal = new prom_client_1.default.Gauge({
            name: 'groups_total',
            help: 'Number of groups',
        });
        const rolesTotal = new prom_client_1.default.Gauge({
            name: 'roles_total',
            help: 'Number of roles',
        });
        const customRootRolesTotal = new prom_client_1.default.Gauge({
            name: 'custom_root_roles_total',
            help: 'Number of custom root roles',
        });
        const customRootRolesInUseTotal = new prom_client_1.default.Gauge({
            name: 'custom_root_roles_in_use_total',
            help: 'Number of custom root roles in use',
        });
        const segmentsTotal = new prom_client_1.default.Gauge({
            name: 'segments_total',
            help: 'Number of segments',
        });
        const contextTotal = new prom_client_1.default.Gauge({
            name: 'context_total',
            help: 'Number of context',
        });
        const strategiesTotal = new prom_client_1.default.Gauge({
            name: 'strategies_total',
            help: 'Number of strategies',
        });
        const clientAppsTotal = new prom_client_1.default.Gauge({
            name: 'client_apps_total',
            help: 'Number of registered client apps aggregated by range by last seen',
            labelNames: ['range'],
        });
        const samlEnabled = new prom_client_1.default.Gauge({
            name: 'saml_enabled',
            help: 'Whether SAML is enabled',
        });
        const oidcEnabled = new prom_client_1.default.Gauge({
            name: 'oidc_enabled',
            help: 'Whether OIDC is enabled',
        });
        const clientSdkVersionUsage = new prom_client_1.default.Counter({
            name: 'client_sdk_versions',
            help: 'Which sdk versions are being used',
            labelNames: ['sdk_name', 'sdk_version'],
        });
        const optimal304DiffingCounter = new prom_client_1.default.Counter({
            name: 'optimal_304_diffing',
            help: 'Count the Optimal 304 diffing with status',
            labelNames: ['status'],
        });
        async function collectStaticCounters() {
            try {
                const stats = await instanceStatsService.getStats();
                featureTogglesTotal.reset();
                featureTogglesTotal.labels(version).set(stats.featureToggles);
                usersTotal.reset();
                usersTotal.set(stats.users);
                projectsTotal.reset();
                projectsTotal.set(stats.projects);
                environmentsTotal.reset();
                environmentsTotal.set(stats.environments);
                groupsTotal.reset();
                groupsTotal.set(stats.groups);
                rolesTotal.reset();
                rolesTotal.set(stats.roles);
                customRootRolesTotal.reset();
                customRootRolesTotal.set(stats.customRootRoles);
                customRootRolesInUseTotal.reset();
                customRootRolesInUseTotal.set(stats.customRootRolesInUse);
                segmentsTotal.reset();
                segmentsTotal.set(stats.segments);
                contextTotal.reset();
                contextTotal.set(stats.contextFields);
                strategiesTotal.reset();
                strategiesTotal.set(stats.strategies);
                samlEnabled.reset();
                samlEnabled.set(stats.SAMLenabled ? 1 : 0);
                oidcEnabled.reset();
                oidcEnabled.set(stats.OIDCenabled ? 1 : 0);
                clientAppsTotal.reset();
                stats.clientApps.forEach((clientStat) => clientAppsTotal
                    .labels({ range: clientStat.range })
                    .set(clientStat.count));
            }
            catch (e) { }
        }
        process.nextTick(() => {
            collectStaticCounters();
            this.timer = setInterval(() => collectStaticCounters(), (0, date_fns_1.hoursToMilliseconds)(2)).unref();
        });
        eventBus.on(events.REQUEST_TIME, ({ path, method, time, statusCode, appName }) => {
            requestDuration
                .labels(path, method, statusCode, appName)
                .observe(time);
        });
        eventBus.on('optimal304Differ', ({ status }) => {
            optimal304DiffingCounter.labels(status).inc();
        });
        eventBus.on(events.DB_TIME, ({ store, action, time }) => {
            dbDuration.labels(store, action).observe(time);
        });
        eventStore.on(events_1.FEATURE_CREATED, ({ featureName, project }) => {
            featureToggleUpdateTotal.labels(featureName, project, 'n/a').inc();
        });
        eventStore.on(events_1.FEATURE_VARIANTS_UPDATED, ({ featureName, project }) => {
            featureToggleUpdateTotal.labels(featureName, project, 'n/a').inc();
        });
        eventStore.on(events_1.FEATURE_METADATA_UPDATED, ({ featureName, project }) => {
            featureToggleUpdateTotal.labels(featureName, project, 'n/a').inc();
        });
        eventStore.on(events_1.FEATURE_UPDATED, ({ featureName, project }) => {
            featureToggleUpdateTotal
                .labels(featureName, project, 'default')
                .inc();
        });
        eventStore.on(events_1.FEATURE_STRATEGY_ADD, ({ featureName, project, environment }) => {
            featureToggleUpdateTotal
                .labels(featureName, project, environment)
                .inc();
        });
        eventStore.on(events_1.FEATURE_STRATEGY_REMOVE, ({ featureName, project, environment }) => {
            featureToggleUpdateTotal
                .labels(featureName, project, environment)
                .inc();
        });
        eventStore.on(events_1.FEATURE_STRATEGY_UPDATE, ({ featureName, project, environment }) => {
            featureToggleUpdateTotal
                .labels(featureName, project, environment)
                .inc();
        });
        eventStore.on(events_1.FEATURE_ENVIRONMENT_DISABLED, ({ featureName, project, environment }) => {
            featureToggleUpdateTotal
                .labels(featureName, project, environment)
                .inc();
        });
        eventStore.on(events_1.FEATURE_ENVIRONMENT_ENABLED, ({ featureName, project, environment }) => {
            featureToggleUpdateTotal
                .labels(featureName, project, environment)
                .inc();
        });
        eventStore.on(events_1.FEATURE_ARCHIVED, ({ featureName, project }) => {
            featureToggleUpdateTotal.labels(featureName, project, 'n/a').inc();
        });
        eventStore.on(events_1.FEATURE_REVIVED, ({ featureName, project }) => {
            featureToggleUpdateTotal.labels(featureName, project, 'n/a').inc();
        });
        eventBus.on(events_1.CLIENT_METRICS, (m) => {
            for (const entry of Object.entries(m.bucket.toggles)) {
                featureToggleUsageTotal
                    .labels(entry[0], 'true', m.appName)
                    .inc(entry[1].yes);
                featureToggleUsageTotal
                    .labels(entry[0], 'false', m.appName)
                    .inc(entry[1].no);
            }
        });
        eventStore.on(events_1.CLIENT_REGISTER, (m) => {
            if (m.sdkVersion && m.sdkVersion.indexOf(':') > -1) {
                const [sdkName, sdkVersion] = m.sdkVersion.split(':');
                clientSdkVersionUsage.labels(sdkName, sdkVersion).inc();
            }
        });
        this.configureDbMetrics(db, eventBus);
    }
    stopMonitoring() {
        clearInterval(this.timer);
        clearInterval(this.poolMetricsTimer);
    }
    configureDbMetrics(db, eventBus) {
        if (db && db.client) {
            const dbPoolMin = new prom_client_1.default.Gauge({
                name: 'db_pool_min',
                help: 'Minimum DB pool size',
            });
            dbPoolMin.set(db.client.pool.min);
            const dbPoolMax = new prom_client_1.default.Gauge({
                name: 'db_pool_max',
                help: 'Maximum DB pool size',
            });
            dbPoolMax.set(db.client.pool.max);
            const dbPoolFree = new prom_client_1.default.Gauge({
                name: 'db_pool_free',
                help: 'Current free connections in DB pool',
            });
            const dbPoolUsed = new prom_client_1.default.Gauge({
                name: 'db_pool_used',
                help: 'Current connections in use in DB pool',
            });
            const dbPoolPendingCreates = new prom_client_1.default.Gauge({
                name: 'db_pool_pending_creates',
                help: 'how many asynchronous create calls are running in DB pool',
            });
            const dbPoolPendingAcquires = new prom_client_1.default.Gauge({
                name: 'db_pool_pending_acquires',
                help: 'how many acquires are waiting for a resource to be released in DB pool',
            });
            eventBus.on(events_1.DB_POOL_UPDATE, (data) => {
                dbPoolFree.set(data.free);
                dbPoolUsed.set(data.used);
                dbPoolPendingCreates.set(data.pendingCreates);
                dbPoolPendingAcquires.set(data.pendingAcquires);
            });
            this.registerPoolMetrics(db.client.pool, eventBus);
            this.poolMetricsTimer = setInterval(() => this.registerPoolMetrics(db.client.pool, eventBus), (0, date_fns_1.minutesToMilliseconds)(1));
            this.poolMetricsTimer.unref();
        }
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    registerPoolMetrics(pool, eventBus) {
        try {
            eventBus.emit(events_1.DB_POOL_UPDATE, {
                used: pool.numUsed(),
                free: pool.numFree(),
                pendingCreates: pool.numPendingCreates(),
                pendingAcquires: pool.numPendingAcquires(),
            });
            // eslint-disable-next-line no-empty
        }
        catch (e) { }
    }
}
exports.default = MetricsMonitor;
function createMetricsMonitor() {
    return new MetricsMonitor();
}
exports.createMetricsMonitor = createMetricsMonitor;
module.exports = {
    createMetricsMonitor,
};
//# sourceMappingURL=metrics.js.map