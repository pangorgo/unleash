"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pat_1 = __importDefault(require("../types/models/pat"));
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const TABLE = 'personal_access_tokens';
const PAT_PUBLIC_COLUMNS = [
    'id',
    'description',
    'user_id',
    'expires_at',
    'created_at',
    'seen_at',
];
const fromRow = (row) => {
    if (!row) {
        throw new notfound_error_1.default('No PAT found');
    }
    return new pat_1.default({
        id: row.id,
        secret: row.secret,
        userId: row.user_id,
        description: row.description,
        createdAt: row.created_at,
        seenAt: row.seen_at,
        expiresAt: row.expires_at,
    });
};
const toRow = (pat) => ({
    secret: pat.secret,
    description: pat.description,
    user_id: pat.userId,
    expires_at: pat.expiresAt,
});
class PatStore {
    constructor(db, getLogger) {
        this.db = db;
        this.logger = getLogger('pat-store.ts');
    }
    async create(token) {
        const row = await this.db(TABLE).insert(toRow(token)).returning('*');
        return fromRow(row[0]);
    }
    async delete(id) {
        return this.db(TABLE).where({ id: id }).del();
    }
    async deleteForUser(id, userId) {
        return this.db(TABLE).where({ id: id, user_id: userId }).del();
    }
    async deleteAll() {
        await this.db(TABLE).del();
    }
    destroy() { }
    async exists(id) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1 FROM ${TABLE} WHERE id = ?) AS present`, [id]);
        const { present } = result.rows[0];
        return present;
    }
    async existsWithDescriptionByUser(description, userId) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1 FROM ${TABLE} WHERE description = ? AND user_id = ?) AS present`, [description, userId]);
        const { present } = result.rows[0];
        return present;
    }
    async countByUser(userId) {
        const result = await this.db.raw(`SELECT COUNT(*) AS count FROM ${TABLE} WHERE user_id = ?`, [userId]);
        const { count } = result.rows[0];
        return count;
    }
    async get(id) {
        const row = await this.db(TABLE).where({ id }).first();
        return fromRow(row);
    }
    async getAll() {
        const groups = await this.db.select(PAT_PUBLIC_COLUMNS).from(TABLE);
        return groups.map(fromRow);
    }
    async getAllByUser(userId) {
        const groups = await this.db
            .select(PAT_PUBLIC_COLUMNS)
            .from(TABLE)
            .where('user_id', userId);
        return groups.map(fromRow);
    }
}
exports.default = PatStore;
//# sourceMappingURL=pat-store.js.map