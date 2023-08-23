"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../types/events");
const anyEventEmitter_1 = require("../util/anyEventEmitter");
const EVENT_COLUMNS = [
    'id',
    'type',
    'created_by',
    'created_at',
    'data',
    'pre_data',
    'tags',
    'feature_name',
    'project',
    'environment',
];
const TABLE = 'events';
class EventStore {
    // a new DB has to be injected per transaction
    constructor(db, getLogger) {
        // only one shared event emitter should exist across all event store instances
        this.eventEmitter = anyEventEmitter_1.sharedEventEmitter;
        this.db = db;
        this.logger = getLogger('lib/db/event-store.ts');
    }
    async store(event) {
        try {
            await this.db(TABLE)
                .insert(this.eventToDbRow(event))
                .returning(EVENT_COLUMNS);
        }
        catch (error) {
            this.logger.warn(`Failed to store "${event.type}" event: ${error}`);
        }
    }
    async count() {
        let count = await this.db(TABLE)
            .count()
            .first();
        if (!count) {
            return 0;
        }
        if (typeof count.count === 'string') {
            return parseInt(count.count, 10);
        }
        else {
            return count.count;
        }
    }
    async filteredCount(eventSearch) {
        let query = this.db(TABLE);
        if (eventSearch.type) {
            query = query.andWhere({ type: eventSearch.type });
        }
        if (eventSearch.project) {
            query = query.andWhere({ project: eventSearch.project });
        }
        if (eventSearch.feature) {
            query = query.andWhere({ feature_name: eventSearch.feature });
        }
        let count = await query.count().first();
        if (!count) {
            return 0;
        }
        if (typeof count.count === 'string') {
            return parseInt(count.count, 10);
        }
        else {
            return count.count;
        }
    }
    async batchStore(events) {
        try {
            await this.db(TABLE)
                .insert(events.map(this.eventToDbRow))
                .returning(EVENT_COLUMNS);
        }
        catch (error) {
            this.logger.warn(`Failed to store events: ${error}`);
        }
    }
    async getMaxRevisionId(largerThan = 0) {
        const row = await this.db(TABLE)
            .max('id')
            .where((builder) => builder
            .whereNotNull('feature_name')
            .orWhere('type', events_1.SEGMENT_UPDATED)
            .orWhere('type', events_1.FEATURE_IMPORT))
            .andWhere('id', '>=', largerThan)
            .first();
        return row?.max ?? 0;
    }
    async delete(key) {
        await this.db(TABLE).where({ id: key }).del();
    }
    async deleteAll() {
        await this.db(TABLE).del();
    }
    destroy() { }
    async exists(key) {
        const result = await this.db.raw(`SELECT EXISTS (SELECT 1 FROM ${TABLE} WHERE id = ?) AS present`, [key]);
        const { present } = result.rows[0];
        return present;
    }
    async query(operations) {
        try {
            let query = this.select();
            operations.forEach((operation) => {
                if (operation.op === 'where') {
                    query = this.where(query, operation.parameters);
                }
                if (operation.op === 'forFeatures') {
                    query = this.forFeatures(query, operation.parameters);
                }
                if (operation.op === 'beforeDate') {
                    query = this.beforeDate(query, operation.parameters);
                }
                if (operation.op === 'betweenDate') {
                    query = this.betweenDate(query, operation.parameters);
                }
            });
            const rows = await query;
            return rows.map(this.rowToEvent);
        }
        catch (e) {
            return [];
        }
    }
    async queryCount(operations) {
        try {
            let query = this.db.count().from(TABLE);
            operations.forEach((operation) => {
                if (operation.op === 'where') {
                    query = this.where(query, operation.parameters);
                }
                if (operation.op === 'forFeatures') {
                    query = this.forFeatures(query, operation.parameters);
                }
                if (operation.op === 'beforeDate') {
                    query = this.beforeDate(query, operation.parameters);
                }
                if (operation.op === 'betweenDate') {
                    query = this.betweenDate(query, operation.parameters);
                }
            });
            const queryResult = await query.first();
            return parseInt(queryResult.count || 0);
        }
        catch (e) {
            return 0;
        }
    }
    where(query, parameters) {
        return query.where(parameters);
    }
    beforeDate(query, parameters) {
        return query.andWhere(parameters.dateAccessor, '>=', parameters.date);
    }
    betweenDate(query, parameters) {
        if (parameters.range && parameters.range.length === 2) {
            return query.andWhereBetween(parameters.dateAccessor, [
                parameters.range[0],
                parameters.range[1],
            ]);
        }
        return query;
    }
    select() {
        return this.db.select(EVENT_COLUMNS).from(TABLE);
    }
    forFeatures(query, parameters) {
        return query
            .where({ type: parameters.type, project: parameters.projectId })
            .whereIn('feature_name', parameters.features)
            .whereIn('environment', parameters.environments);
    }
    async get(key) {
        const row = await this.db(TABLE).where({ id: key }).first();
        return this.rowToEvent(row);
    }
    async getAll(query) {
        return this.getEvents(query);
    }
    async getEvents(query) {
        try {
            let qB = this.db
                .select(EVENT_COLUMNS)
                .from(TABLE)
                .limit(100)
                .orderBy('created_at', 'desc');
            if (query) {
                qB = qB.where(query);
            }
            const rows = await qB;
            return rows.map(this.rowToEvent);
        }
        catch (err) {
            return [];
        }
    }
    async searchEvents(search = {}) {
        let query = this.db
            .select(EVENT_COLUMNS)
            .from(TABLE)
            .limit(search.limit ?? 100)
            .offset(search.offset ?? 0)
            .orderBy('created_at', 'desc');
        if (search.type) {
            query = query.andWhere({
                type: search.type,
            });
        }
        if (search.project) {
            query = query.andWhere({
                project: search.project,
            });
        }
        if (search.feature) {
            query = query.andWhere({
                feature_name: search.feature,
            });
        }
        if (search.query) {
            query = query.where((where) => where
                .orWhereRaw('type::text ILIKE ?', `%${search.query}%`)
                .orWhereRaw('created_by::text ILIKE ?', `%${search.query}%`)
                .orWhereRaw('data::text ILIKE ?', `%${search.query}%`)
                .orWhereRaw('pre_data::text ILIKE ?', `%${search.query}%`));
        }
        try {
            return (await query).map(this.rowToEvent);
        }
        catch (err) {
            return [];
        }
    }
    rowToEvent(row) {
        return {
            id: row.id,
            type: row.type,
            createdBy: row.created_by,
            createdAt: row.created_at,
            data: row.data,
            preData: row.pre_data,
            tags: row.tags || [],
            featureName: row.feature_name,
            project: row.project,
            environment: row.environment,
        };
    }
    eventToDbRow(e) {
        return {
            type: e.type,
            created_by: e.createdBy ?? 'admin',
            data: Array.isArray(e.data) ? JSON.stringify(e.data) : e.data,
            pre_data: Array.isArray(e.preData)
                ? JSON.stringify(e.preData)
                : e.preData,
            // @ts-expect-error workaround for json-array
            tags: JSON.stringify(e.tags),
            feature_name: e.featureName,
            project: e.project,
            environment: e.environment,
        };
    }
    setMaxListeners(number) {
        return this.eventEmitter.setMaxListeners(number);
    }
    on(eventName, listener) {
        return this.eventEmitter.on(eventName, listener);
    }
    emit(eventName, ...args) {
        return this.eventEmitter.emit(eventName, ...args);
    }
    off(eventName, listener) {
        return this.eventEmitter.off(eventName, listener);
    }
    async setUnannouncedToAnnounced() {
        const rows = await this.db(TABLE)
            .update({ announced: true })
            .where('announced', false)
            .whereNotNull('announced')
            .returning(EVENT_COLUMNS);
        return rows.map(this.rowToEvent);
    }
    async publishUnannouncedEvents() {
        const events = await this.setUnannouncedToAnnounced();
        events.forEach((e) => this.eventEmitter.emit(e.type, e));
    }
}
exports.default = EventStore;
//# sourceMappingURL=event-store.js.map