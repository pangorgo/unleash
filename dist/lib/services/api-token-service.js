"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiTokenService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const permissions_1 = require("../types/permissions");
const api_user_1 = __importDefault(require("../types/api-user"));
const api_token_1 = require("../types/models/api-token");
const db_error_1 = require("../error/db-error");
const bad_data_error_1 = __importDefault(require("../error/bad-data-error"));
const constantTimeCompare_1 = require("../util/constantTimeCompare");
const types_1 = require("../types");
const util_1 = require("../util");
const resolveTokenPermissions = (tokenType) => {
    if (tokenType === api_token_1.ApiTokenType.ADMIN) {
        return [permissions_1.ADMIN];
    }
    if (tokenType === api_token_1.ApiTokenType.CLIENT) {
        return [permissions_1.CLIENT];
    }
    if (tokenType === api_token_1.ApiTokenType.FRONTEND) {
        return [permissions_1.FRONTEND];
    }
    return [];
};
class ApiTokenService {
    constructor({ apiTokenStore, environmentStore, eventStore, }, config) {
        this.activeTokens = [];
        this.lastSeenSecrets = new Set();
        this.store = apiTokenStore;
        this.eventStore = eventStore;
        this.environmentStore = environmentStore;
        this.logger = config.getLogger('/services/api-token-service.ts');
        this.fetchActiveTokens();
        this.updateLastSeen();
        if (config.authentication.initApiTokens.length > 0) {
            process.nextTick(async () => this.initApiTokens(config.authentication.initApiTokens));
        }
    }
    async fetchActiveTokens() {
        try {
            this.activeTokens = await this.getAllActiveTokens();
        }
        finally {
            // eslint-disable-next-line no-unsafe-finally
            return;
        }
    }
    async getToken(secret) {
        return this.store.get(secret);
    }
    async updateLastSeen() {
        if (this.lastSeenSecrets.size > 0) {
            const toStore = [...this.lastSeenSecrets];
            this.lastSeenSecrets = new Set();
            await this.store.markSeenAt(toStore);
        }
    }
    async getAllTokens() {
        return this.store.getAll();
    }
    async getAllActiveTokens() {
        return this.store.getAllActive();
    }
    async initApiTokens(tokens) {
        const tokenCount = await this.store.count();
        if (tokenCount > 0) {
            return;
        }
        try {
            const createAll = tokens
                .map(api_token_1.mapLegacyTokenWithSecret)
                .map((t) => this.insertNewApiToken(t, 'init-api-tokens'));
            await Promise.all(createAll);
        }
        catch (e) {
            this.logger.error('Unable to create initial Admin API tokens');
        }
    }
    getUserForToken(secret) {
        if (!secret) {
            return undefined;
        }
        let token = this.activeTokens.find((activeToken) => Boolean(activeToken.secret) &&
            (0, constantTimeCompare_1.constantTimeCompare)(activeToken.secret, secret));
        // If the token is not found, try to find it in the legacy format with alias.
        // This allows us to support the old format of tokens migrating to the embedded proxy.
        if (!token) {
            token = this.activeTokens.find((activeToken) => Boolean(activeToken.alias) &&
                (0, constantTimeCompare_1.constantTimeCompare)(activeToken.alias, secret));
        }
        if (token) {
            this.lastSeenSecrets.add(token.secret);
            return new api_user_1.default({
                tokenName: token.tokenName,
                permissions: resolveTokenPermissions(token.type),
                projects: token.projects,
                environment: token.environment,
                type: token.type,
                secret: token.secret,
            });
        }
        return undefined;
    }
    async updateExpiry(secret, expiresAt, updatedBy) {
        const previous = await this.store.get(secret);
        const token = await this.store.setExpiry(secret, expiresAt);
        await this.eventStore.store(new types_1.ApiTokenUpdatedEvent({
            createdBy: updatedBy,
            previousToken: (0, util_1.omitKeys)(previous, 'secret'),
            apiToken: (0, util_1.omitKeys)(token, 'secret'),
        }));
        return token;
    }
    async delete(secret, deletedBy) {
        if (await this.store.exists(secret)) {
            const token = await this.store.get(secret);
            await this.store.delete(secret);
            await this.eventStore.store(new types_1.ApiTokenDeletedEvent({
                createdBy: deletedBy,
                apiToken: (0, util_1.omitKeys)(token, 'secret'),
            }));
        }
    }
    /**
     * @deprecated This may be removed in a future release, prefer createApiTokenWithProjects
     */
    async createApiToken(newToken, createdBy = 'unleash-system') {
        const token = (0, api_token_1.mapLegacyToken)(newToken);
        return this.createApiTokenWithProjects(token, createdBy);
    }
    async createApiTokenWithProjects(newToken, createdBy = 'unleash-system') {
        (0, api_token_1.validateApiToken)(newToken);
        const environments = await this.environmentStore.getAll();
        (0, api_token_1.validateApiTokenEnvironment)(newToken, environments);
        const secret = this.generateSecretKey(newToken);
        const createNewToken = { ...newToken, secret };
        return this.insertNewApiToken(createNewToken, createdBy);
    }
    // TODO: Remove this service method after embedded proxy has been released in
    // 4.16.0
    async createMigratedProxyApiToken(newToken) {
        (0, api_token_1.validateApiToken)(newToken);
        const secret = this.generateSecretKey(newToken);
        const createNewToken = { ...newToken, secret };
        return this.insertNewApiToken(createNewToken, 'system-migration');
    }
    async insertNewApiToken(newApiToken, createdBy) {
        try {
            const token = await this.store.insert(newApiToken);
            this.activeTokens.push(token);
            await this.eventStore.store(new types_1.ApiTokenCreatedEvent({
                createdBy,
                apiToken: (0, util_1.omitKeys)(token, 'secret'),
            }));
            return token;
        }
        catch (error) {
            if (error.code === db_error_1.FOREIGN_KEY_VIOLATION) {
                let { message } = error;
                if (error.constraint === 'api_token_project_project_fkey') {
                    message = `Project=${this.findInvalidProject(error.detail, newApiToken.projects)} does not exist`;
                }
                else if (error.constraint === 'api_tokens_environment_fkey') {
                    message = `Environment=${newApiToken.environment} does not exist`;
                }
                throw new bad_data_error_1.default(message);
            }
            throw error;
        }
    }
    findInvalidProject(errorDetails, projects) {
        if (!errorDetails) {
            return 'invalid';
        }
        let invalidProject = projects.find((project) => {
            return errorDetails.includes(`=(${project})`);
        });
        return invalidProject || 'invalid';
    }
    generateSecretKey({ projects, environment }) {
        const randomStr = crypto_1.default.randomBytes(28).toString('hex');
        if (projects.length > 1) {
            return `[]:${environment}.${randomStr}`;
        }
        else {
            return `${projects[0]}:${environment}.${randomStr}`;
        }
    }
}
exports.ApiTokenService = ApiTokenService;
//# sourceMappingURL=api-token-service.js.map