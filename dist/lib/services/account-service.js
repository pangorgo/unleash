"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const date_fns_1 = require("date-fns");
const model_1 = require("../types/model");
class AccountService {
    constructor(stores, { getLogger }, services) {
        this.lastSeenSecrets = new Set();
        this.logger = getLogger('service/account-service.ts');
        this.store = stores.accountStore;
        this.accessService = services.accessService;
        this.updateLastSeen();
    }
    async getAll() {
        const accounts = await this.store.getAll();
        const defaultRole = await this.accessService.getRootRole(model_1.RoleName.VIEWER);
        const userRoles = await this.accessService.getRootRoleForAllUsers();
        const accountsWithRootRole = accounts.map((u) => {
            const rootRole = userRoles.find((r) => r.userId === u.id);
            const roleId = rootRole ? rootRole.roleId : defaultRole.id;
            return { ...u, rootRole: roleId };
        });
        return accountsWithRootRole;
    }
    async getAccountByPersonalAccessToken(secret) {
        return this.store.getAccountByPersonalAccessToken(secret);
    }
    async getAdminCount() {
        return this.store.getAdminCount();
    }
    async updateLastSeen() {
        if (this.lastSeenSecrets.size > 0) {
            const toStore = [...this.lastSeenSecrets];
            this.lastSeenSecrets = new Set();
            await this.store.markSeenAt(toStore);
        }
        this.seenTimer = setTimeout(async () => this.updateLastSeen(), (0, date_fns_1.minutesToMilliseconds)(3)).unref();
    }
    addPATSeen(secret) {
        this.lastSeenSecrets.add(secret);
    }
    destroy() {
        clearTimeout(this.seenTimer);
        this.seenTimer = null;
    }
}
exports.AccountService = AccountService;
//# sourceMappingURL=account-service.js.map