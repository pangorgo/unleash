"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const date_fns_1 = require("date-fns");
const events_1 = require("../../types/events");
const api_user_1 = __importDefault(require("../../types/api-user"));
const api_token_1 = require("../../types/models/api-token");
const collapseHourlyMetrics_1 = require("../../util/collapseHourlyMetrics");
const time_utils_1 = require("../../util/time-utils");
const feature_schema_1 = require("../../schema/feature-schema");
class ClientMetricsServiceV2 {
    constructor({ clientMetricsStoreV2 }, config, lastSeenService, bulkInterval = (0, date_fns_1.secondsToMilliseconds)(5)) {
        this.timers = [];
        this.unsavedMetrics = [];
        this.clientMetricsStoreV2 = clientMetricsStoreV2;
        this.lastSeenService = lastSeenService;
        this.config = config;
        this.logger = config.getLogger('/services/client-metrics/client-metrics-service-v2.ts');
        this.flagResolver = config.flagResolver;
        this.timers.push(setInterval(() => {
            this.bulkAdd().catch(console.error);
        }, bulkInterval).unref());
        this.timers.push(setInterval(() => {
            this.clientMetricsStoreV2.clearMetrics(48).catch(console.error);
        }, (0, date_fns_1.hoursToMilliseconds)(12)).unref());
    }
    async filterValidToggleNames(toggleNames) {
        const nameValidations = toggleNames.map((toggleName) => feature_schema_1.nameSchema.validateAsync({ name: toggleName }));
        const badNames = (await Promise.allSettled(nameValidations)).filter((r) => r.status === 'rejected');
        if (badNames.length > 0) {
            this.logger.warn(`Got a few toggles with invalid names: ${JSON.stringify(badNames)}`);
            if (this.flagResolver.isEnabled('filterInvalidClientMetrics')) {
                const justNames = badNames.map((r) => r.reason._original.name);
                return toggleNames.filter((name) => !justNames.includes(name));
            }
        }
        return toggleNames;
    }
    async registerBulkMetrics(metrics) {
        this.unsavedMetrics = (0, collapseHourlyMetrics_1.collapseHourlyMetrics)([
            ...this.unsavedMetrics,
            ...metrics,
        ]);
        this.lastSeenService.updateLastSeen(metrics);
    }
    async registerClientMetrics(data, clientIp) {
        const value = await schema_1.clientMetricsSchema.validateAsync(data);
        const toggleNames = Object.keys(value.bucket.toggles).filter((name) => !(value.bucket.toggles[name].yes === 0 &&
            value.bucket.toggles[name].no === 0));
        const validatedToggleNames = await this.filterValidToggleNames(toggleNames);
        this.logger.debug(`Got ${toggleNames.length} (${validatedToggleNames.length} valid) metrics from ${clientIp}`);
        if (validatedToggleNames.length > 0) {
            const clientMetrics = validatedToggleNames.map((name) => ({
                featureName: name,
                appName: value.appName,
                environment: value.environment ?? 'default',
                timestamp: value.bucket.start,
                yes: value.bucket.toggles[name].yes ?? 0,
                no: value.bucket.toggles[name].no ?? 0,
                variants: value.bucket.toggles[name].variants,
            }));
            await this.registerBulkMetrics(clientMetrics);
            this.config.eventBus.emit(events_1.CLIENT_METRICS, value);
        }
    }
    async bulkAdd() {
        if (this.unsavedMetrics.length > 0) {
            // Make a copy of `unsavedMetrics` in case new metrics
            // arrive while awaiting `batchInsertMetrics`.
            const copy = [...this.unsavedMetrics];
            this.unsavedMetrics = [];
            await this.clientMetricsStoreV2.batchInsertMetrics(copy);
        }
    }
    // Overview over usage last "hour" bucket and all applications using the toggle
    async getFeatureToggleMetricsSummary(featureName) {
        const metrics = await this.clientMetricsStoreV2.getMetricsForFeatureToggle(featureName, 1);
        const seenApplications = await this.clientMetricsStoreV2.getSeenAppsForFeatureToggle(featureName);
        const groupedMetrics = metrics.reduce((prev, curr) => {
            if (prev[curr.environment]) {
                prev[curr.environment].yes += curr.yes;
                prev[curr.environment].no += curr.no;
            }
            else {
                prev[curr.environment] = {
                    environment: curr.environment,
                    timestamp: curr.timestamp,
                    yes: curr.yes,
                    no: curr.no,
                };
            }
            return prev;
        }, {});
        return {
            featureName,
            lastHourUsage: Object.values(groupedMetrics),
            seenApplications,
        };
    }
    async getClientMetricsForToggle(featureName, hoursBack = 24) {
        const metrics = await this.clientMetricsStoreV2.getMetricsForFeatureToggle(featureName, hoursBack);
        const hours = (0, time_utils_1.generateHourBuckets)(hoursBack);
        const environments = [...new Set(metrics.map((x) => x.environment))];
        const applications = [...new Set(metrics.map((x) => x.appName))].slice(0, 100);
        const result = environments.flatMap((environment) => {
            const environmentMetrics = metrics.filter((metric) => metric.environment === environment);
            return applications.flatMap((appName) => {
                const applicationMetrics = environmentMetrics.filter((metric) => metric.appName === appName);
                return hours.flatMap((hourBucket) => {
                    const metric = applicationMetrics.find((item) => (0, date_fns_1.compareAsc)(hourBucket.timestamp, item.timestamp) ===
                        0);
                    return (metric || {
                        timestamp: hourBucket.timestamp,
                        no: 0,
                        yes: 0,
                        appName,
                        environment,
                        featureName,
                    });
                });
            });
        });
        return result.sort((a, b) => (0, date_fns_1.compareAsc)(a.timestamp, b.timestamp));
    }
    resolveMetricsEnvironment(user, data) {
        if (user instanceof api_user_1.default) {
            if (user.environment !== api_token_1.ALL) {
                return user.environment;
            }
            else if (user.environment === api_token_1.ALL && data.environment) {
                return data.environment;
            }
        }
        return 'default';
    }
    destroy() {
        this.timers.forEach(clearInterval);
        this.lastSeenService.destroy();
    }
}
exports.default = ClientMetricsServiceV2;
//# sourceMappingURL=metrics-service-v2.js.map