"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicSignupTokenService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const model_1 = require("../types/model");
const events_1 = require("../types/events");
const url_1 = require("url");
const date_fns_1 = require("date-fns");
class PublicSignupTokenService {
    constructor({ publicSignupTokenStore, roleStore, eventStore, }, config, userService) {
        this.store = publicSignupTokenStore;
        this.userService = userService;
        this.roleStore = roleStore;
        this.eventStore = eventStore;
        this.logger = config.getLogger('/services/public-signup-token-service.ts');
        this.unleashBase = config.server.unleashUrl;
    }
    getUrl(secret) {
        return new url_1.URL(`${this.unleashBase}/new-user?invite=${secret}`).toString();
    }
    async get(secret) {
        return this.store.get(secret);
    }
    async getAllTokens() {
        return this.store.getAll();
    }
    async getAllActiveTokens() {
        return this.store.getAllActive();
    }
    async validate(secret) {
        return this.store.isValid(secret);
    }
    async update(secret, { expiresAt, enabled }, createdBy) {
        const result = await this.store.update(secret, { expiresAt, enabled });
        await this.eventStore.store(new events_1.PublicSignupTokenUpdatedEvent({
            createdBy,
            data: { secret, enabled, expiresAt },
        }));
        return result;
    }
    async addTokenUser(secret, createUser) {
        const token = await this.get(secret);
        const user = await this.userService.createUser({
            ...createUser,
            rootRole: token.role.id,
        });
        await this.store.addTokenUser(secret, user.id);
        await this.eventStore.store(new events_1.PublicSignupTokenUserAddedEvent({
            createdBy: 'System',
            data: { secret, userId: user.id },
        }));
        return user;
    }
    async createNewPublicSignupToken(tokenCreate, createdBy) {
        const viewerRole = await this.roleStore.getRoleByName(model_1.RoleName.VIEWER);
        const secret = this.generateSecretKey();
        const url = this.getUrl(secret);
        const cappedDate = this.getMinimumDate(new Date(tokenCreate.expiresAt), (0, date_fns_1.add)(new Date(), { months: 1 }));
        const newToken = {
            name: tokenCreate.name,
            expiresAt: cappedDate,
            secret: secret,
            roleId: viewerRole ? viewerRole.id : -1,
            createdBy: createdBy,
            url: url,
        };
        const token = await this.store.insert(newToken);
        await this.eventStore.store(new events_1.PublicSignupTokenCreatedEvent({
            createdBy: createdBy,
            data: token,
        }));
        return token;
    }
    generateSecretKey() {
        return crypto_1.default.randomBytes(16).toString('hex');
    }
    getMinimumDate(date1, date2) {
        return date1 < date2 ? date1 : date2;
    }
    destroy() {
        clearInterval(this.timer);
        this.timer = null;
    }
}
exports.PublicSignupTokenService = PublicSignupTokenService;
//# sourceMappingURL=public-signup-token-service.js.map