"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TABLE = 'settings';
class SettingStore {
    constructor(db, getLogger) {
        this.db = db;
        this.logger = getLogger('settings-store.ts');
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async updateRow(name, content) {
        return this.db(TABLE)
            .where('name', name)
            .update({
            content: JSON.stringify(content),
        });
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async insertNewRow(name, content) {
        return this.db(TABLE).insert({ name, content });
    }
    async exists(name) {
        const result = await this.db.raw(`SELECT EXISTS (SELECT 1 FROM ${TABLE} WHERE name = ?) AS present`, [name]);
        const { present } = result.rows[0];
        return present;
    }
    async get(name) {
        const result = await this.db.select().from(TABLE).where('name', name);
        if (result.length > 0) {
            return result[0].content;
        }
        return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async insert(name, content) {
        const exists = await this.exists(name);
        if (exists) {
            await this.updateRow(name, content);
        }
        else {
            await this.insertNewRow(name, content);
        }
    }
    async delete(name) {
        await this.db(TABLE).where({ name }).del();
    }
    async deleteAll() {
        await this.db(TABLE).del();
    }
    destroy() { }
    async getAll() {
        const rows = await this.db(TABLE).select();
        return rows.map((r) => r.content);
    }
}
exports.default = SettingStore;
module.exports = SettingStore;
//# sourceMappingURL=setting-store.js.map