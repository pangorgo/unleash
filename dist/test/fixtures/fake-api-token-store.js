"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notfound_error_1 = __importDefault(require("../../lib/error/notfound-error"));
const events_1 = __importDefault(require("events"));
class FakeApiTokenStore extends events_1.default {
    constructor() {
        super(...arguments);
        this.tokens = [];
    }
    async delete(key) {
        this.tokens.splice(this.tokens.findIndex((t) => t.secret === key), 1);
    }
    async count() {
        return this.tokens.length;
    }
    async deleteAll() {
        this.tokens = [];
    }
    destroy() { }
    async exists(key) {
        return this.tokens.some((token) => token.secret === key);
    }
    async get(key) {
        const token = this.tokens.find((t) => t.secret === key);
        if (token) {
            return token;
        }
        throw new notfound_error_1.default(`Could not find token with secret ${key}`);
    }
    async getAll() {
        return this.tokens;
    }
    async getAllActive() {
        return this.tokens.filter((token) => token.expiresAt === null || token.expiresAt > new Date());
    }
    async insert(newToken) {
        const apiToken = {
            createdAt: new Date(),
            project: newToken.projects?.join(',') || '*',
            alias: null,
            ...newToken,
        };
        this.tokens.push(apiToken);
        this.emit('insert');
        return apiToken;
    }
    async markSeenAt(secrets) {
        this.tokens
            .filter((t) => secrets.includes(t.secret))
            .forEach((t) => {
            // eslint-disable-next-line no-param-reassign
            t.seenAt = new Date();
        });
    }
    async setExpiry(secret, expiresAt) {
        const t = await this.get(secret);
        t.expiresAt = expiresAt;
        return t;
    }
}
exports.default = FakeApiTokenStore;
//# sourceMappingURL=fake-api-token-store.js.map