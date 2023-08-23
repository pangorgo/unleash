"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("../types/events");
const crypto_1 = __importDefault(require("crypto"));
const bad_data_error_1 = __importDefault(require("../error/bad-data-error"));
const name_exists_error_1 = __importDefault(require("../error/name-exists-error"));
const operation_denied_error_1 = require("../error/operation-denied-error");
const constants_1 = require("../util/constants");
class PatService {
    constructor({ patStore, eventStore, }, config) {
        this.config = config;
        this.logger = config.getLogger('services/pat-service.ts');
        this.patStore = patStore;
        this.eventStore = eventStore;
    }
    async createPat(pat, forUserId, editor) {
        await this.validatePat(pat, forUserId);
        pat.secret = this.generateSecretKey();
        pat.userId = forUserId;
        const newPat = await this.patStore.create(pat);
        pat.secret = '***';
        await this.eventStore.store({
            type: events_1.PAT_CREATED,
            createdBy: editor.email || editor.username,
            data: pat,
        });
        return newPat;
    }
    async getAll(userId) {
        return this.patStore.getAllByUser(userId);
    }
    async deletePat(id, forUserId, editor) {
        const pat = await this.patStore.get(id);
        pat.secret = '***';
        await this.eventStore.store({
            type: events_1.PAT_DELETED,
            createdBy: editor.email || editor.username,
            data: pat,
        });
        return this.patStore.deleteForUser(id, forUserId);
    }
    async validatePat({ description, expiresAt }, userId) {
        if (!description) {
            throw new bad_data_error_1.default('PAT description cannot be empty');
        }
        if (new Date(expiresAt) < new Date()) {
            throw new bad_data_error_1.default('The expiry date should be in future.');
        }
        if ((await this.patStore.countByUser(userId)) >= constants_1.PAT_LIMIT) {
            throw new operation_denied_error_1.OperationDeniedError(`Too many PATs (${constants_1.PAT_LIMIT}) already exist for this user.`);
        }
        if (await this.patStore.existsWithDescriptionByUser(description, userId)) {
            throw new name_exists_error_1.default('PAT description already exists');
        }
    }
    generateSecretKey() {
        const randomStr = crypto_1.default.randomBytes(28).toString('hex');
        return `user:${randomStr}`;
    }
}
exports.default = PatService;
module.exports = PatService;
//# sourceMappingURL=pat-service.js.map