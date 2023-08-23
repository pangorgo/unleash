"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMetricsStoreV2 = void 0;
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const date_fns_1 = require("date-fns");
const collapseHourlyMetrics_1 = require("../util/collapseHourlyMetrics");
const TABLE = 'client_metrics_env';
const TABLE_VARIANTS = 'client_metrics_env_variants';
const fromRow = (row) => ({
    featureName: row.feature_name,
    appName: row.app_name,
    environment: row.environment,
    timestamp: row.timestamp,
    yes: Number(row.yes),
    no: Number(row.no),
});
const toRow = (metric) => ({
    feature_name: metric.featureName,
    app_name: metric.appName,
    environment: metric.environment,
    timestamp: (0, date_fns_1.startOfHour)(metric.timestamp),
    yes: metric.yes,
    no: metric.no,
});
const toVariantRow = (metric) => ({
    feature_name: metric.featureName,
    app_name: metric.appName,
    environment: metric.environment,
    timestamp: (0, date_fns_1.startOfHour)(metric.timestamp),
    variant: metric.variant,
    count: metric.count,
});
const variantRowReducer = (acc, tokenRow) => {
    const { feature_name: featureName, app_name: appName, environment, timestamp, yes, no, variant, count, } = tokenRow;
    const key = `${featureName}_${appName}_${environment}_${timestamp}_${yes}_${no}`;
    if (!acc[key]) {
        acc[key] = {
            featureName,
            appName,
            environment,
            timestamp,
            yes: Number(yes),
            no: Number(no),
            variants: {},
        };
    }
    if (variant) {
        acc[key].variants[variant] = count;
    }
    return acc;
};
class ClientMetricsStoreV2 {
    constructor(db, getLogger, flagResolver) {
        this.db = db;
        this.logger = getLogger('client-metrics-store-v2.js');
        this.flagResolver = flagResolver;
    }
    async get(key) {
        const row = await this.db(TABLE)
            .where({
            feature_name: key.featureName,
            app_name: key.appName,
            environment: key.environment,
            timestamp: (0, date_fns_1.startOfHour)(key.timestamp),
        })
            .first();
        if (row) {
            return fromRow(row);
        }
        throw new notfound_error_1.default(`Could not find metric`);
    }
    async getAll(query = {}) {
        const rows = await this.db(TABLE)
            .select('*')
            .where(query);
        return rows.map(fromRow);
    }
    async exists(key) {
        try {
            await this.get(key);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async delete(key) {
        return this.db(TABLE)
            .where({
            feature_name: key.featureName,
            app_name: key.appName,
            environment: key.environment,
            timestamp: (0, date_fns_1.startOfHour)(key.timestamp),
        })
            .del();
    }
    deleteAll() {
        return this.db(TABLE).del();
    }
    destroy() {
        // Nothing to do!
    }
    // this function will collapse metrics before sending it to the database.
    async batchInsertMetrics(metrics) {
        if (!metrics || metrics.length == 0) {
            return;
        }
        const rows = (0, collapseHourlyMetrics_1.collapseHourlyMetrics)(metrics).map(toRow);
        // Sort the rows to avoid deadlocks
        const sortedRows = rows.sort((a, b) => a.feature_name.localeCompare(b.feature_name) ||
            a.app_name.localeCompare(b.app_name) ||
            a.environment.localeCompare(b.environment));
        // Consider rewriting to SQL batch!
        const insert = this.db(TABLE)
            .insert(sortedRows)
            .toQuery();
        const query = `${insert.toString()} ON CONFLICT (feature_name, app_name, environment, timestamp) DO UPDATE SET "yes" = "client_metrics_env"."yes" + EXCLUDED.yes, "no" = "client_metrics_env"."no" + EXCLUDED.no`;
        await this.db.raw(query);
        const variantRows = (0, collapseHourlyMetrics_1.spreadVariants)(metrics).map(toVariantRow);
        // Sort the rows to avoid deadlocks
        const sortedVariantRows = variantRows.sort((a, b) => a.feature_name.localeCompare(b.feature_name) ||
            a.app_name.localeCompare(b.app_name) ||
            a.environment.localeCompare(b.environment) ||
            a.variant.localeCompare(b.variant));
        if (sortedVariantRows.length > 0) {
            const insertVariants = this.db(TABLE_VARIANTS)
                .insert(sortedVariantRows)
                .toQuery();
            const variantsQuery = `${insertVariants.toString()} ON CONFLICT (feature_name, app_name, environment, timestamp, variant) DO UPDATE SET "count" = "client_metrics_env_variants"."count" + EXCLUDED.count`;
            await this.db.raw(variantsQuery);
        }
    }
    async getMetricsForFeatureToggle(featureName, hoursBack = 24) {
        const rows = await this.db(TABLE)
            .select([`${TABLE}.*`, 'variant', 'count'])
            .leftJoin(TABLE_VARIANTS, function () {
            this.on(`${TABLE_VARIANTS}.feature_name`, `${TABLE}.feature_name`)
                .on(`${TABLE_VARIANTS}.app_name`, `${TABLE}.app_name`)
                .on(`${TABLE_VARIANTS}.environment`, `${TABLE}.environment`)
                .on(`${TABLE_VARIANTS}.timestamp`, `${TABLE}.timestamp`);
        })
            .where(`${TABLE}.feature_name`, featureName)
            .andWhereRaw(`${TABLE}.timestamp >= NOW() - INTERVAL '${hoursBack} hours'`);
        const tokens = rows.reduce(variantRowReducer, {});
        return Object.values(tokens);
    }
    async getSeenAppsForFeatureToggle(featureName, hoursBack = 24) {
        return this.db(TABLE)
            .distinct()
            .where({ feature_name: featureName })
            .andWhereRaw(`timestamp >= NOW() - INTERVAL '${hoursBack} hours'`)
            .pluck('app_name')
            .orderBy('app_name');
    }
    async getSeenTogglesForApp(appName, hoursBack = 24) {
        return this.db(TABLE)
            .distinct()
            .where({ app_name: appName })
            .andWhereRaw(`timestamp >= NOW() - INTERVAL '${hoursBack} hours'`)
            .pluck('feature_name')
            .orderBy('feature_name');
    }
    async clearMetrics(hoursAgo) {
        return this.db(TABLE)
            .whereRaw(`timestamp <= NOW() - INTERVAL '${hoursAgo} hours'`)
            .del();
    }
}
exports.ClientMetricsStoreV2 = ClientMetricsStoreV2;
//# sourceMappingURL=client-metrics-store-v2.js.map