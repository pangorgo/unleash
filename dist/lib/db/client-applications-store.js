"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const COLUMNS = [
    'app_name',
    'created_at',
    'created_by',
    'updated_at',
    'description',
    'strategies',
    'url',
    'color',
    'icon',
];
const TABLE = 'client_applications';
const mapRow = (row) => ({
    appName: row.app_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    description: row.description,
    strategies: row.strategies || [],
    createdBy: row.created_by,
    url: row.url,
    color: row.color,
    icon: row.icon,
    lastSeen: row.last_seen,
    announced: row.announced,
});
const remapRow = (input) => {
    const temp = {
        app_name: input.appName,
        updated_at: input.updatedAt || new Date(),
        seen_at: input.lastSeen || new Date(),
        description: input.description,
        created_by: input.createdBy,
        announced: input.announced,
        url: input.url,
        color: input.color,
        icon: input.icon,
        strategies: JSON.stringify(input.strategies),
    };
    Object.keys(temp).forEach((k) => {
        if (temp[k] === undefined) {
            // not using !temp[k] to allow false and null values to get through
            delete temp[k];
        }
    });
    return temp;
};
class ClientApplicationsStore {
    constructor(db, eventBus, getLogger) {
        this.db = db;
        this.logger = getLogger('client-applications-store.ts');
    }
    async upsert(details) {
        const row = remapRow(details);
        await this.db(TABLE).insert(row).onConflict('app_name').merge();
    }
    async bulkUpsert(apps) {
        const rows = apps.map(remapRow);
        await this.db(TABLE).insert(rows).onConflict('app_name').merge();
    }
    async exists(appName) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1 FROM ${TABLE} WHERE app_name = ?) AS present`, [appName]);
        const { present } = result.rows[0];
        return present;
    }
    async getAll() {
        const rows = await this.db
            .select(COLUMNS)
            .from(TABLE)
            .orderBy('app_name', 'asc');
        return rows.map(mapRow);
    }
    async getApplication(appName) {
        const row = await this.db
            .select(COLUMNS)
            .where('app_name', appName)
            .from(TABLE)
            .first();
        if (!row) {
            throw new notfound_error_1.default(`Could not find appName=${appName}`);
        }
        return mapRow(row);
    }
    async deleteApplication(appName) {
        return this.db(TABLE).where('app_name', appName).del();
    }
    /**
     * Could also be done in SQL:
     * (not sure if it is faster though)
     *
     * SELECT app_name from (
     *   SELECT app_name, json_array_elements(strategies)::text as strategyName from client_strategies
     *   ) as foo
     * WHERE foo.strategyName = '"other"';
     */
    async getAppsForStrategy(query) {
        const rows = await this.db.select(COLUMNS).from(TABLE);
        const apps = rows.map(mapRow);
        if (query.strategyName) {
            return apps.filter((app) => app.strategies.includes(query.strategyName));
        }
        return apps;
    }
    async getUnannounced() {
        const rows = await this.db(TABLE)
            .select(COLUMNS)
            .where('announced', false);
        return rows.map(mapRow);
    }
    /** *
     * Updates all rows that have announced = false to announced =true and returns the rows altered
     * @return {[app]} - Apps that hadn't been announced
     */
    async setUnannouncedToAnnounced() {
        const rows = await this.db(TABLE)
            .update({ announced: true })
            .where('announced', false)
            .whereNotNull('announced')
            .returning(COLUMNS);
        return rows.map(mapRow);
    }
    async delete(key) {
        await this.db(TABLE).where('app_name', key).del();
    }
    async deleteAll() {
        await this.db(TABLE).del();
    }
    destroy() { }
    async get(appName) {
        const row = await this.db
            .select(COLUMNS)
            .where('app_name', appName)
            .from(TABLE)
            .first();
        if (!row) {
            throw new notfound_error_1.default(`Could not find appName=${appName}`);
        }
        return mapRow(row);
    }
}
exports.default = ClientApplicationsStore;
//# sourceMappingURL=client-applications-store.js.map