"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const owasp_password_strength_test_1 = __importDefault(require("owasp-password-strength-test"));
const joi_1 = __importDefault(require("joi"));
const user_1 = __importDefault(require("../types/user"));
const is_email_1 = __importDefault(require("../util/is-email"));
const invalid_token_error_1 = __importDefault(require("../error/invalid-token-error"));
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const owasp_validation_error_1 = __importDefault(require("../error/owasp-validation-error"));
const password_undefined_1 = __importDefault(require("../error/password-undefined"));
const events_1 = require("../types/events");
const model_1 = require("../types/model");
const simple_auth_settings_1 = require("../types/settings/simple-auth-settings");
const disabled_error_1 = __importDefault(require("../error/disabled-error"));
const bad_data_error_1 = __importDefault(require("../error/bad-data-error"));
const isDefined_1 = require("../util/isDefined");
const password_mismatch_1 = __importDefault(require("../error/password-mismatch"));
const systemUser = new user_1.default({ id: -1, username: 'system' });
const saltRounds = 10;
class UserService {
    constructor(stores, { server, getLogger, authentication, }, services) {
        this.passwordResetTimeouts = {};
        this.logger = getLogger('service/user-service.js');
        this.store = stores.userStore;
        this.eventStore = stores.eventStore;
        this.accessService = services.accessService;
        this.resetTokenService = services.resetTokenService;
        this.emailService = services.emailService;
        this.sessionService = services.sessionService;
        this.settingService = services.settingService;
        if (authentication && authentication.createAdminUser) {
            process.nextTick(() => this.initAdminUser());
        }
        this.baseUriPath = server.baseUriPath || '';
    }
    validatePassword(password) {
        if (password) {
            const result = owasp_password_strength_test_1.default.test(password);
            if (!result.strong) {
                throw new owasp_validation_error_1.default(result);
            }
            else
                return true;
        }
        else {
            throw new password_undefined_1.default();
        }
    }
    async initAdminUser() {
        const userCount = await this.store.count();
        if (userCount === 0) {
            // create default admin user
            try {
                const pwd = 'unleash4all';
                this.logger.info(`Creating default user "admin" with password "${pwd}"`);
                const user = await this.store.insert({
                    username: 'admin',
                });
                const passwordHash = await bcryptjs_1.default.hash(pwd, saltRounds);
                await this.store.setPasswordHash(user.id, passwordHash);
                await this.accessService.setUserRootRole(user.id, model_1.RoleName.ADMIN);
            }
            catch (e) {
                this.logger.error('Unable to create default user "admin"');
            }
        }
    }
    async getAll() {
        const users = await this.store.getAll();
        const defaultRole = await this.accessService.getRootRole(model_1.RoleName.VIEWER);
        const userRoles = await this.accessService.getRootRoleForAllUsers();
        const usersWithRootRole = users.map((u) => {
            const rootRole = userRoles.find((r) => r.userId === u.id);
            const roleId = rootRole ? rootRole.roleId : defaultRole.id;
            return { ...u, rootRole: roleId };
        });
        return usersWithRootRole;
    }
    async getUser(id) {
        const roles = await this.accessService.getUserRootRoles(id);
        const defaultRole = await this.accessService.getRootRole(model_1.RoleName.VIEWER);
        const roleId = roles.length > 0 ? roles[0].id : defaultRole.id;
        const user = await this.store.get(id);
        return { ...user, rootRole: roleId };
    }
    async search(query) {
        return this.store.search(query);
    }
    async getByEmail(email) {
        return this.store.getByQuery({ email });
    }
    async createUser({ username, email, name, password, rootRole }, updatedBy) {
        if (!username && !email) {
            throw new bad_data_error_1.default('You must specify username or email');
        }
        if (email) {
            joi_1.default.assert(email, joi_1.default.string().email(), 'Email');
        }
        const exists = await this.store.hasUser({ username, email });
        if (exists) {
            throw new bad_data_error_1.default('User already exists');
        }
        const user = await this.store.insert({
            username,
            email,
            name,
        });
        await this.accessService.setUserRootRole(user.id, rootRole);
        if (password) {
            const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
            await this.store.setPasswordHash(user.id, passwordHash);
        }
        await this.eventStore.store({
            type: events_1.USER_CREATED,
            createdBy: this.getCreatedBy(updatedBy),
            data: this.mapUserToData(user),
        });
        return user;
    }
    getCreatedBy(updatedBy = systemUser) {
        return updatedBy.username || updatedBy.email;
    }
    mapUserToData(user) {
        if (!user) {
            return undefined;
        }
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
        };
    }
    async updateUser({ id, name, email, rootRole }, updatedBy) {
        const preUser = await this.store.get(id);
        if (email) {
            joi_1.default.assert(email, joi_1.default.string().email(), 'Email');
        }
        if (rootRole) {
            await this.accessService.setUserRootRole(id, rootRole);
        }
        const payload = {
            name: name || preUser.name,
            email: email || preUser.email,
        };
        // Empty updates will throw, so make sure we have something to update.
        const user = Object.values(payload).some(isDefined_1.isDefined)
            ? await this.store.update(id, payload)
            : preUser;
        await this.eventStore.store({
            type: events_1.USER_UPDATED,
            createdBy: this.getCreatedBy(updatedBy),
            data: this.mapUserToData(user),
            preData: this.mapUserToData(preUser),
        });
        return user;
    }
    async deleteUser(userId, updatedBy) {
        const user = await this.store.get(userId);
        await this.accessService.wipeUserPermissions(userId);
        await this.sessionService.deleteSessionsForUser(userId);
        await this.store.delete(userId);
        await this.eventStore.store({
            type: events_1.USER_DELETED,
            createdBy: this.getCreatedBy(updatedBy),
            preData: this.mapUserToData(user),
        });
    }
    async loginUser(usernameOrEmail, password) {
        const settings = await this.settingService.get(simple_auth_settings_1.simpleAuthSettingsKey);
        if (settings?.disabled) {
            throw new disabled_error_1.default('Logging in with username/password has been disabled.');
        }
        const idQuery = (0, is_email_1.default)(usernameOrEmail)
            ? { email: usernameOrEmail }
            : { username: usernameOrEmail };
        let user, passwordHash;
        try {
            user = await this.store.getByQuery(idQuery);
            passwordHash = await this.store.getPasswordHash(user.id);
        }
        catch (error) { }
        if (user && passwordHash) {
            const match = await bcryptjs_1.default.compare(password, passwordHash);
            if (match) {
                await this.store.successfullyLogin(user);
                return user;
            }
        }
        throw new password_mismatch_1.default(`The combination of password and username you provided is invalid. If you have forgotten your password, visit ${this.baseUriPath}/forgotten-password or get in touch with your instance administrator.`);
    }
    /**
     * Used to login users without specifying password. Used when integrating
     * with external identity providers.
     *
     * @param usernameOrEmail
     * @param autoCreateUser
     * @returns
     */
    async loginUserWithoutPassword(email, autoCreateUser = false) {
        return this.loginUserSSO({ email, autoCreate: autoCreateUser });
    }
    async loginUserSSO({ email, name, rootRole, autoCreate = false, }) {
        let user;
        try {
            user = await this.store.getByQuery({ email });
            // Update user if autCreate is enabled.
            if (name && user.name !== name) {
                user = await this.store.update(user.id, { name, email });
            }
        }
        catch (e) {
            // User does not exists. Create if "autoCreate" is enabled
            if (autoCreate) {
                user = await this.createUser({
                    email,
                    name,
                    rootRole: rootRole || model_1.RoleName.EDITOR,
                });
            }
            else {
                throw e;
            }
        }
        await this.store.successfullyLogin(user);
        return user;
    }
    async changePassword(userId, password) {
        this.validatePassword(password);
        const passwordHash = await bcryptjs_1.default.hash(password, saltRounds);
        await this.store.setPasswordHash(userId, passwordHash);
        await this.sessionService.deleteSessionsForUser(userId);
        await this.resetTokenService.expireExistingTokensForUser(userId);
    }
    async changePasswordWithVerification(userId, newPassword, oldPassword) {
        const currentPasswordHash = await this.store.getPasswordHash(userId);
        const match = await bcryptjs_1.default.compare(oldPassword, currentPasswordHash);
        if (!match) {
            throw new password_mismatch_1.default(`The old password you provided is invalid. If you have forgotten your password, visit ${this.baseUriPath}/forgotten-password or get in touch with your instance administrator.`);
        }
        await this.changePassword(userId, newPassword);
    }
    async getUserForToken(token) {
        const { createdBy, userId } = await this.resetTokenService.isValid(token);
        const user = await this.getUser(userId);
        const role = await this.accessService.getRoleData(user.rootRole);
        return {
            token,
            createdBy,
            email: user.email,
            name: user.name,
            id: user.id,
            role: {
                id: user.rootRole,
                description: role.role.description,
                type: role.role.type,
                name: role.role.name,
            },
        };
    }
    /**
     * If the password is a strong password will update password and delete all sessions for the user we're changing the password for
     * @param token - the token authenticating this request
     * @param password - new password
     */
    async resetPassword(token, password) {
        this.validatePassword(password);
        const user = await this.getUserForToken(token);
        const allowed = await this.resetTokenService.useAccessToken({
            userId: user.id,
            token,
        });
        if (allowed) {
            await this.changePassword(user.id, password);
        }
        else {
            throw new invalid_token_error_1.default();
        }
    }
    async createResetPasswordEmail(receiverEmail, user = systemUser) {
        const receiver = await this.getByEmail(receiverEmail);
        if (!receiver) {
            throw new notfound_error_1.default(`Could not find ${receiverEmail}`);
        }
        if (this.passwordResetTimeouts[receiver.id]) {
            return;
        }
        const resetLink = await this.resetTokenService.createResetPasswordUrl(receiver.id, user.username || user.email);
        this.passwordResetTimeouts[receiver.id] = setTimeout(() => {
            delete this.passwordResetTimeouts[receiver.id];
        }, 1000 * 60); // 1 minute
        await this.emailService.sendResetMail(receiver.name, receiver.email, resetLink.toString());
        return resetLink;
    }
}
module.exports = UserService;
exports.default = UserService;
//# sourceMappingURL=user-service.js.map