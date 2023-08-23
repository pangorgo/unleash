"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiTokenStore = void 0;
const metrics_helper_1 = __importDefault(require("../util/metrics-helper"));
const metric_events_1 = require("../metric-events");
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const api_token_1 = require("../types/models/api-token");
const constants_1 = require("../util/constants");
const TABLE = 'api_tokens';
const API_LINK_TABLE = 'api_token_project';
const ALL = '*';
const tokenRowReducer = (acc, tokenRow) => {
    const { project, ...token } = tokenRow;
    if (!acc[tokenRow.secret]) {
        acc[tokenRow.secret] = {
            secret: token.secret,
            tokenName: token.token_name ? token.token_name : token.username,
            type: token.type.toLowerCase(),
            project: ALL,
            projects: [ALL],
            environment: token.environment ? token.environment : ALL,
            expiresAt: token.expires_at,
            createdAt: token.created_at,
            alias: token.alias,
            seenAt: token.seen_at,
            username: token.token_name ? token.token_name : token.username,
        };
    }
    const currentToken = acc[tokenRow.secret];
    if (tokenRow.project) {
        if ((0, api_token_1.isAllProjects)(currentToken.projects)) {
            currentToken.projects = [];
        }
        currentToken.projects.push(tokenRow.project);
        currentToken.project = currentToken.projects.join(',');
    }
    return acc;
};
const toRow = (newToken) => ({
    username: newToken.tokenName ?? newToken.username,
    token_name: newToken.tokenName ?? newToken.username,
    secret: newToken.secret,
    type: newToken.type,
    environment: newToken.environment === ALL ? undefined : newToken.environment,
    expires_at: newToken.expiresAt,
    alias: newToken.alias || null,
});
const toTokens = (rows) => {
    const tokens = rows.reduce(tokenRowReducer, {});
    return Object.values(tokens);
};
class ApiTokenStore {
    constructor(db, eventBus, getLogger) {
        this.db = db;
        this.logger = getLogger('api-tokens.js');
        this.timer = (action) => metrics_helper_1.default.wrapTimer(eventBus, metric_events_1.DB_TIME, {
            store: 'api-tokens',
            action,
        });
    }
    count() {
        return this.db(TABLE)
            .count('*')
            .then((res) => Number(res[0].count));
    }
    async getAll() {
        const stopTimer = this.timer('getAll');
        const rows = await this.makeTokenProjectQuery();
        stopTimer();
        return toTokens(rows);
    }
    async getAllActive() {
        const stopTimer = this.timer('getAllActive');
        const rows = await this.makeTokenProjectQuery()
            .where('expires_at', 'IS', null)
            .orWhere('expires_at', '>', 'now()');
        stopTimer();
        return toTokens(rows);
    }
    makeTokenProjectQuery() {
        return this.db(`${TABLE} as tokens`)
            .leftJoin(`${API_LINK_TABLE} as token_project_link`, 'tokens.secret', 'token_project_link.secret')
            .select('tokens.secret', 'username', 'token_name', 'type', 'expires_at', 'created_at', 'alias', 'seen_at', 'environment', 'token_project_link.project');
    }
    async insert(newToken) {
        const response = await this.db.transaction(async (tx) => {
            const [row] = await tx(TABLE).insert(toRow(newToken), ['created_at']);
            const updateProjectTasks = (newToken.projects || [])
                .filter((project) => {
                return project !== constants_1.ALL_PROJECTS;
            })
                .map((project) => {
                return tx.raw(`INSERT INTO ${API_LINK_TABLE} VALUES (?, ?)`, [newToken.secret, project]);
            });
            await Promise.all(updateProjectTasks);
            return {
                ...newToken,
                username: newToken.tokenName,
                alias: newToken.alias || null,
                project: newToken.projects?.join(',') || '*',
                createdAt: row.created_at,
            };
        });
        return response;
    }
    destroy() { }
    async exists(secret) {
        const result = await this.db.raw(`SELECT EXISTS (SELECT 1 FROM ${TABLE} WHERE secret = ?) AS present`, [secret]);
        const { present } = result.rows[0];
        return present;
    }
    async get(key) {
        const row = await this.makeTokenProjectQuery().where('tokens.secret', key);
        return toTokens(row)[0];
    }
    async delete(secret) {
        return this.db(TABLE).where({ secret }).del();
    }
    async deleteAll() {
        return this.db(TABLE).del();
    }
    async setExpiry(secret, expiresAt) {
        const rows = await this.makeTokenProjectQuery()
            .update({ expires_at: expiresAt })
            .where({ secret })
            .returning('*');
        if (rows.length > 0) {
            return toTokens(rows)[0];
        }
        throw new notfound_error_1.default('Could not find api-token.');
    }
    async markSeenAt(secrets) {
        const now = new Date();
        try {
            await this.db(TABLE)
                .whereIn('secret', secrets)
                .update({ seen_at: now });
        }
        catch (err) {
            this.logger.error('Could not update lastSeen, error: ', err);
        }
    }
}
exports.ApiTokenStore = ApiTokenStore;
//# sourceMappingURL=api-token-store.js.map