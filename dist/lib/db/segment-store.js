"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const T = {
    segments: 'segments',
    featureStrategies: 'feature_strategies',
    featureStrategySegment: 'feature_strategy_segment',
};
const COLUMNS = [
    'id',
    'name',
    'description',
    'segment_project_id',
    'created_by',
    'created_at',
    'constraints',
];
class SegmentStore {
    constructor(db, eventBus, getLogger, flagResolver) {
        this.db = db;
        this.eventBus = eventBus;
        this.flagResolver = flagResolver;
        this.logger = getLogger('lib/db/segment-store.ts');
    }
    async count() {
        return this.db
            .from(T.segments)
            .count('*')
            .then((res) => Number(res[0].count));
    }
    async create(segment, user) {
        const rows = await this.db(T.segments)
            .insert({
            id: segment.id,
            name: segment.name,
            description: segment.description,
            segment_project_id: segment.project || null,
            constraints: JSON.stringify(segment.constraints),
            created_by: user.username || user.email,
        })
            .returning(COLUMNS);
        return this.mapRow(rows[0]);
    }
    async update(id, segment) {
        const rows = await this.db(T.segments)
            .where({ id })
            .update({
            name: segment.name,
            description: segment.description,
            segment_project_id: segment.project || null,
            constraints: JSON.stringify(segment.constraints),
        })
            .returning(COLUMNS);
        return this.mapRow(rows[0]);
    }
    delete(id) {
        return this.db(T.segments).where({ id }).del();
    }
    async getAll() {
        const rows = await this.db
            .select(this.prefixColumns(), 'used_in_projects', 'used_in_features')
            .countDistinct(`${T.featureStrategies}.project_name AS used_in_projects`)
            .countDistinct(`${T.featureStrategies}.feature_name AS used_in_features`)
            .from(T.segments)
            .leftJoin(T.featureStrategySegment, `${T.segments}.id`, `${T.featureStrategySegment}.segment_id`)
            .leftJoin(T.featureStrategies, `${T.featureStrategies}.id`, `${T.featureStrategySegment}.feature_strategy_id`)
            .groupBy(this.prefixColumns())
            .orderBy('name', 'asc');
        return rows.map(this.mapRow);
    }
    async getActive() {
        const rows = await this.db
            .distinct(this.prefixColumns())
            .from(T.segments)
            .orderBy('name', 'asc')
            .join(T.featureStrategySegment, `${T.featureStrategySegment}.segment_id`, `${T.segments}.id`);
        return rows.map(this.mapRow);
    }
    async getActiveForClient() {
        const fullSegments = await this.getActive();
        return fullSegments.map((segments) => ({
            id: segments.id,
            name: segments.name,
            constraints: segments.constraints,
        }));
    }
    async getByStrategy(strategyId) {
        const rows = await this.db
            .select(this.prefixColumns())
            .from(T.segments)
            .join(T.featureStrategySegment, `${T.featureStrategySegment}.segment_id`, `${T.segments}.id`)
            .where(`${T.featureStrategySegment}.feature_strategy_id`, '=', strategyId);
        return rows.map(this.mapRow);
    }
    deleteAll() {
        return this.db(T.segments).del();
    }
    async exists(id) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1 FROM ${T.segments} WHERE id = ?) AS present`, [id]);
        return result.rows[0].present;
    }
    async get(id) {
        const rows = await this.db
            .select(this.prefixColumns())
            .from(T.segments)
            .where({ id });
        const row = rows[0];
        if (!row) {
            throw new notfound_error_1.default(`No segment exists with ID "${id}"`);
        }
        return this.mapRow(row);
    }
    async addToStrategy(id, strategyId) {
        await this.db(T.featureStrategySegment).insert({
            segment_id: id,
            feature_strategy_id: strategyId,
        });
    }
    async removeFromStrategy(id, strategyId) {
        await this.db(T.featureStrategySegment)
            .where({ segment_id: id, feature_strategy_id: strategyId })
            .del();
    }
    async getAllFeatureStrategySegments() {
        const rows = await this.db
            .select(['segment_id', 'feature_strategy_id'])
            .from(T.featureStrategySegment);
        return rows.map((row) => ({
            featureStrategyId: row.feature_strategy_id,
            segmentId: row.segment_id,
        }));
    }
    async existsByName(name) {
        const rows = await this.db
            .select(this.prefixColumns())
            .from(T.segments)
            .where({ name });
        return Boolean(rows[0]);
    }
    prefixColumns() {
        return COLUMNS.map((c) => `${T.segments}.${c}`);
    }
    mapRow(row) {
        if (!row) {
            throw new notfound_error_1.default('No row');
        }
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            project: row.segment_project_id || undefined,
            constraints: row.constraints,
            createdBy: row.created_by,
            createdAt: row.created_at,
            ...(row.used_in_projects && {
                usedInProjects: Number(row.used_in_projects),
            }),
            ...(row.used_in_features && {
                usedInFeatures: Number(row.used_in_features),
            }),
        };
    }
    destroy() { }
}
exports.default = SegmentStore;
//# sourceMappingURL=segment-store.js.map