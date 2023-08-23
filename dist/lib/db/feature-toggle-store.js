"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const metrics_helper_1 = __importDefault(require("../util/metrics-helper"));
const metric_events_1 = require("../metric-events");
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const FEATURE_COLUMNS = [
    'name',
    'description',
    'type',
    'project',
    'stale',
    'created_at',
    'impression_data',
    'last_seen_at',
    'archived_at',
];
const TABLE = 'features';
const FEATURE_ENVIRONMENTS_TABLE = 'feature_environments';
class FeatureToggleStore {
    constructor(db, eventBus, getLogger) {
        this.db = db;
        this.logger = getLogger('feature-toggle-store.ts');
        this.timer = (action) => metrics_helper_1.default.wrapTimer(eventBus, metric_events_1.DB_TIME, {
            store: 'feature-toggle',
            action,
        });
    }
    async count(query = { archived: false }) {
        const { archived, ...rest } = query;
        return this.db
            .from(TABLE)
            .count('*')
            .where(rest)
            .modify(FeatureToggleStore.filterByArchived, archived)
            .then((res) => Number(res[0].count));
    }
    async deleteAll() {
        await this.db(TABLE).del();
    }
    destroy() { }
    async get(name) {
        return this.db
            .first(FEATURE_COLUMNS)
            .from(TABLE)
            .where({ name })
            .then(this.rowToFeature);
    }
    async getAll(query = { archived: false }) {
        const { archived, ...rest } = query;
        const rows = await this.db
            .select(FEATURE_COLUMNS)
            .from(TABLE)
            .where(rest)
            .modify(FeatureToggleStore.filterByArchived, archived);
        return rows.map(this.rowToFeature);
    }
    async getAllByNames(names) {
        const query = this.db(TABLE).orderBy('name', 'asc');
        query.whereIn('name', names);
        const rows = await query;
        return rows.map(this.rowToFeature);
    }
    async countByDate(queryModifiers) {
        const { project, archived, dateAccessor } = queryModifiers;
        let query = this.db
            .count()
            .from(TABLE)
            .where({ project })
            .modify(FeatureToggleStore.filterByArchived, archived);
        if (queryModifiers.date) {
            query.andWhere(dateAccessor, '>=', queryModifiers.date);
        }
        if (queryModifiers.range && queryModifiers.range.length === 2) {
            query.andWhereBetween(dateAccessor, [
                queryModifiers.range[0],
                queryModifiers.range[1],
            ]);
        }
        const queryResult = await query.first();
        return parseInt(queryResult.count || 0);
    }
    /**
     * Get projectId from feature filtered by name. Used by Rbac middleware
     * @deprecated
     * @param name
     */
    async getProjectId(name) {
        return this.db
            .first(['project'])
            .from(TABLE)
            .where({ name })
            .then((r) => (r ? r.project : undefined))
            .catch((e) => {
            this.logger.error(e);
            return undefined;
        });
    }
    async exists(name) {
        const result = await this.db.raw('SELECT EXISTS (SELECT 1 FROM features WHERE name = ?) AS present', [name]);
        const { present } = result.rows[0];
        return present;
    }
    async setLastSeen(data) {
        const now = new Date();
        const environmentArrays = this.mapMetricDataToEnvBuckets(data);
        try {
            for (const env of Object.keys(environmentArrays)) {
                const toggleNames = environmentArrays[env];
                await this.db(FEATURE_ENVIRONMENTS_TABLE)
                    .update({ last_seen_at: now })
                    .where('environment', env)
                    .whereIn('feature_name', this.db(FEATURE_ENVIRONMENTS_TABLE)
                    .select('feature_name')
                    .whereIn('feature_name', toggleNames)
                    .forUpdate()
                    .skipLocked());
                // Updating the toggle's last_seen_at also for backwards compatibility
                await this.db(TABLE)
                    .update({ last_seen_at: now })
                    .whereIn('name', this.db(TABLE)
                    .select('name')
                    .whereIn('name', toggleNames)
                    .forUpdate()
                    .skipLocked());
            }
        }
        catch (err) {
            this.logger.error('Could not update lastSeen, error: ', err);
        }
    }
    mapMetricDataToEnvBuckets(data) {
        return data.reduce((acc, feature) => {
            const { environment, featureName } = feature;
            if (!acc[environment]) {
                acc[environment] = [];
            }
            acc[environment].push(featureName);
            return acc;
        }, {});
    }
    rowToFeature(row) {
        if (!row) {
            throw new notfound_error_1.default('No feature toggle found');
        }
        return {
            name: row.name,
            description: row.description,
            type: row.type,
            project: row.project,
            stale: row.stale,
            createdAt: row.created_at,
            lastSeenAt: row.last_seen_at,
            impressionData: row.impression_data,
            archivedAt: row.archived_at,
            archived: row.archived_at != null,
        };
    }
    rowToEnvVariants(variantRows) {
        if (!variantRows.length) {
            return [];
        }
        const sortedVariants = variantRows[0].variants || [];
        sortedVariants.sort((a, b) => a.name.localeCompare(b.name));
        return sortedVariants;
    }
    dtoToRow(project, data) {
        const row = {
            name: data.name,
            description: data.description,
            type: data.type,
            project,
            archived_at: data.archived ? new Date() : null,
            stale: data.stale,
            created_at: data.createdAt,
            impression_data: data.impressionData,
        };
        if (!row.created_at) {
            delete row.created_at;
        }
        return row;
    }
    async create(project, data) {
        try {
            const row = await this.db(TABLE)
                .insert(this.dtoToRow(project, data))
                .returning(FEATURE_COLUMNS);
            return this.rowToFeature(row[0]);
        }
        catch (err) {
            this.logger.error('Could not insert feature, error: ', err);
        }
        return undefined;
    }
    async update(project, data) {
        const row = await this.db(TABLE)
            .where({ name: data.name })
            .update(this.dtoToRow(project, data))
            .returning(FEATURE_COLUMNS);
        return this.rowToFeature(row[0]);
    }
    async archive(name) {
        const now = new Date();
        const row = await this.db(TABLE)
            .where({ name })
            .update({ archived_at: now })
            .returning(FEATURE_COLUMNS);
        return this.rowToFeature(row[0]);
    }
    async batchArchive(names) {
        const now = new Date();
        const rows = await this.db(TABLE)
            .whereIn('name', names)
            .update({ archived_at: now })
            .returning(FEATURE_COLUMNS);
        return rows.map((row) => this.rowToFeature(row));
    }
    async batchStale(names, stale) {
        const rows = await this.db(TABLE)
            .whereIn('name', names)
            .update({ stale })
            .returning(FEATURE_COLUMNS);
        return rows.map((row) => this.rowToFeature(row));
    }
    async delete(name) {
        await this.db(TABLE)
            .where({ name }) // Feature toggle must be archived to allow deletion
            .whereNotNull('archived_at')
            .del();
    }
    async batchDelete(names) {
        await this.db(TABLE)
            .whereIn('name', names)
            .whereNotNull('archived_at')
            .del();
    }
    async revive(name) {
        const row = await this.db(TABLE)
            .where({ name })
            .update({ archived_at: null })
            .returning(FEATURE_COLUMNS);
        return this.rowToFeature(row[0]);
    }
    async batchRevive(names) {
        const rows = await this.db(TABLE)
            .whereIn('name', names)
            .update({ archived_at: null })
            .returning(FEATURE_COLUMNS);
        return rows.map((row) => this.rowToFeature(row));
    }
    async getVariants(featureName) {
        if (!(await this.exists(featureName))) {
            throw new notfound_error_1.default('No feature toggle found');
        }
        const row = await this.db(`${TABLE} as f`)
            .select('fe.variants')
            .join(`${FEATURE_ENVIRONMENTS_TABLE} as fe`, 'fe.feature_name', 'f.name')
            .where({ name: featureName })
            .limit(1);
        return this.rowToEnvVariants(row);
    }
    async getVariantsForEnv(featureName, environment) {
        const row = await this.db(`${TABLE} as f`)
            .select('fev.variants')
            .join(`${FEATURE_ENVIRONMENTS_TABLE} as fev`, 'fev.feature_name', 'f.name')
            .where({ name: featureName })
            .andWhere({ environment });
        return this.rowToEnvVariants(row);
    }
    async saveVariants(project, featureName, newVariants) {
        const variantsString = JSON.stringify(newVariants);
        await this.db('feature_environments')
            .update('variants', variantsString)
            .where('feature_name', featureName);
        const row = await this.db(TABLE)
            .select(FEATURE_COLUMNS)
            .where({ project: project, name: featureName });
        const toggle = this.rowToFeature(row[0]);
        toggle.variants = newVariants;
        return toggle;
    }
    async updatePotentiallyStaleFeatures(currentTime) {
        const query = this.db.raw(`SELECT name, project, potentially_stale, (? > (features.created_at + ((
                            SELECT feature_types.lifetime_days
                            FROM feature_types
                            WHERE feature_types.id = features.type
                        ) * INTERVAL '1 day'))) as current_staleness
            FROM features
            WHERE NOT stale = true`, [currentTime || this.db.fn.now()]);
        const featuresToUpdate = (await query).rows
            .filter(({ potentially_stale, current_staleness }) => (potentially_stale ?? false) !==
            (current_staleness ?? false))
            .map(({ current_staleness, name, project }) => ({
            potentiallyStale: current_staleness ?? false,
            name,
            project,
        }));
        await this.db(TABLE)
            .update('potentially_stale', true)
            .whereIn('name', featuresToUpdate
            .filter((feature) => feature.potentiallyStale === true)
            .map((feature) => feature.name));
        await this.db(TABLE)
            .update('potentially_stale', false)
            .whereIn('name', featuresToUpdate
            .filter((feature) => feature.potentiallyStale !== true)
            .map((feature) => feature.name));
        return featuresToUpdate;
    }
    async isPotentiallyStale(featureName) {
        const result = await this.db(TABLE)
            .first(['potentially_stale'])
            .from(TABLE)
            .where({ name: featureName });
        return result?.potentially_stale ?? false;
    }
}
exports.default = FeatureToggleStore;
FeatureToggleStore.filterByArchived = (queryBuilder, archived) => {
    return archived
        ? queryBuilder.whereNotNull('archived_at')
        : queryBuilder.whereNull('archived_at');
};
module.exports = FeatureToggleStore;
//# sourceMappingURL=feature-toggle-store.js.map