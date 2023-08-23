"use strict";
/* eslint camelcase: "off" */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../types/user"));
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const TABLE = 'users';
const USER_COLUMNS_PUBLIC = [
    'id',
    'name',
    'username',
    'email',
    'image_url',
    'seen_at',
    'is_service',
];
const USER_COLUMNS = [...USER_COLUMNS_PUBLIC, 'login_attempts', 'created_at'];
const emptify = (value) => {
    if (!value) {
        return undefined;
    }
    return value;
};
const safeToLower = (s) => (s ? s.toLowerCase() : s);
const mapUserToColumns = (user) => ({
    name: user.name,
    username: user.username,
    email: safeToLower(user.email),
    image_url: user.imageUrl,
});
const rowToUser = (row) => {
    if (!row) {
        throw new notfound_error_1.default('No user found');
    }
    return new user_1.default({
        id: row.id,
        name: emptify(row.name),
        username: emptify(row.username),
        email: emptify(row.email),
        imageUrl: emptify(row.image_url),
        loginAttempts: row.login_attempts,
        seenAt: row.seen_at,
        createdAt: row.created_at,
        isService: row.is_service,
    });
};
class UserStore {
    constructor(db, getLogger) {
        this.db = db;
        this.logger = getLogger('user-store.ts');
    }
    async update(id, fields) {
        await this.activeUsers()
            .where('id', id)
            .update(mapUserToColumns(fields));
        return this.get(id);
    }
    async insert(user) {
        const rows = await this.db(TABLE)
            .insert(mapUserToColumns(user))
            .returning(USER_COLUMNS);
        return rowToUser(rows[0]);
    }
    async upsert(user) {
        const id = await this.hasUser(user);
        if (id) {
            return this.update(id, user);
        }
        return this.insert(user);
    }
    buildSelectUser(q) {
        const query = this.activeAll();
        if (q.id) {
            return query.where('id', q.id);
        }
        if (q.email) {
            return query.where('email', safeToLower(q.email));
        }
        if (q.username) {
            return query.where('username', q.username);
        }
        throw new Error('Can only find users with id, username or email.');
    }
    activeAll() {
        return this.db(TABLE).where({
            deleted_at: null,
        });
    }
    activeUsers() {
        return this.db(TABLE).where({
            deleted_at: null,
            is_service: false,
        });
    }
    async hasUser(idQuery) {
        const query = this.buildSelectUser(idQuery);
        const item = await query.first('id');
        return item ? item.id : undefined;
    }
    async getAll() {
        const users = await this.activeUsers().select(USER_COLUMNS);
        return users.map(rowToUser);
    }
    async search(query) {
        const users = await this.activeUsers()
            .select(USER_COLUMNS_PUBLIC)
            .where('name', 'ILIKE', `%${query}%`)
            .orWhere('username', 'ILIKE', `${query}%`)
            .orWhere('email', 'ILIKE', `${query}%`);
        return users.map(rowToUser);
    }
    async getAllWithId(userIdList) {
        const users = await this.activeUsers()
            .select(USER_COLUMNS_PUBLIC)
            .whereIn('id', userIdList);
        return users.map(rowToUser);
    }
    async getByQuery(idQuery) {
        const row = await this.buildSelectUser(idQuery).first(USER_COLUMNS);
        return rowToUser(row);
    }
    async delete(id) {
        return this.activeUsers()
            .where({ id })
            .update({
            deleted_at: new Date(),
            email: null,
            username: null,
            name: this.db.raw('name || ?', '(Deleted)'),
        });
    }
    async getPasswordHash(userId) {
        const item = await this.activeUsers()
            .where('id', userId)
            .first('password_hash');
        if (!item) {
            throw new notfound_error_1.default('User not found');
        }
        return item.password_hash;
    }
    async setPasswordHash(userId, passwordHash) {
        return this.activeUsers().where('id', userId).update({
            password_hash: passwordHash,
        });
    }
    async incLoginAttempts(user) {
        return this.buildSelectUser(user).increment('login_attempts', 1);
    }
    async successfullyLogin(user) {
        return this.buildSelectUser(user).update({
            login_attempts: 0,
            seen_at: new Date(),
        });
    }
    async deleteAll() {
        await this.activeUsers().del();
    }
    async count() {
        return this.activeUsers()
            .count('*')
            .then((res) => Number(res[0].count));
    }
    destroy() { }
    async exists(id) {
        const result = await this.db.raw(`SELECT EXISTS (SELECT 1 FROM ${TABLE} WHERE id = ? and deleted_at = null) AS present`, [id]);
        const { present } = result.rows[0];
        return present;
    }
    async get(id) {
        const row = await this.activeUsers().where({ id }).first();
        return rowToUser(row);
    }
}
module.exports = UserStore;
exports.default = UserStore;
//# sourceMappingURL=user-store.js.map