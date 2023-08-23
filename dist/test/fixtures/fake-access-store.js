"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fake_role_store_1 = __importDefault(require("./fake-role-store"));
class AccessStoreMock {
    constructor(roleStore) {
        this.userToRoleMap = new Map();
        this.fakeRolesStore = roleStore ?? new fake_role_store_1.default();
    }
    getProjectUserAndGroupCountsForRole(roleId) {
        throw new Error('Method not implemented.');
    }
    addAccessToProject(users, groups, projectId, roleId, createdBy) {
        throw new Error('Method not implemented.');
    }
    updateGroupProjectRole(userId, roleId, projectId) {
        throw new Error('Method not implemented.');
    }
    addGroupToRole(groupId, roleId, created_by, projectId) {
        throw new Error('Method not implemented.');
    }
    removeGroupFromRole(groupId, roleId, projectId) {
        throw new Error('Method not implemented.');
    }
    updateUserProjectRole(userId, roleId, projectId) {
        throw new Error('Method not implemented.');
    }
    removeUserFromRole(userId, roleId, projectId) {
        throw new Error('Method not implemented.');
    }
    wipePermissionsFromRole(role_id) {
        throw new Error('Method not implemented.');
    }
    unlinkUserRoles(userId) {
        throw new Error('Method not implemented.');
    }
    getRoleByName(name) {
        throw new Error('Method not implemented.');
    }
    getProjectUsersForRole(roleId, projectId) {
        throw new Error('Method not implemented.');
    }
    getProjectRoles() {
        throw new Error('Method not implemented.');
    }
    addEnvironmentPermissionsToRole(role_id, permissions) {
        return Promise.resolve(undefined);
    }
    getAvailablePermissions() {
        throw new Error('Method not implemented.');
    }
    getPermissionsForUser(userId) {
        return Promise.resolve([]);
    }
    getPermissionsForRole(roleId) {
        throw new Error('Method not implemented.');
    }
    getRoles() {
        return Promise.resolve([]);
    }
    getRoleWithId(id) {
        throw new Error('Method not implemented.');
    }
    getRolesForProject(projectId) {
        throw new Error('Method not implemented.');
    }
    removeRolesForProject(projectId) {
        throw new Error('Method not implemented.');
    }
    async getRolesForUserId(userId) {
        const roleId = this.userToRoleMap.get(userId);
        const found = roleId === undefined
            ? undefined
            : await this.fakeRolesStore.get(roleId);
        if (found) {
            return Promise.resolve([found]);
        }
        else {
            return Promise.resolve([]);
        }
    }
    getUserIdsForRole(roleId, projectId) {
        throw new Error('Method not implemented.');
    }
    getGroupIdsForRole(roleId, projectId) {
        throw new Error('Method not implemented.');
    }
    addUserToRole(userId, roleId) {
        this.userToRoleMap.set(userId, roleId);
        return Promise.resolve(undefined);
    }
    addPermissionsToRole(role_id, permissions, projectId) {
        // do nothing for now
        return Promise.resolve(undefined);
    }
    removePermissionFromRole(roleId, permission, projectId) {
        throw new Error('Method not implemented.');
    }
    getRootRoleForAllUsers() {
        throw new Error('Method not implemented.');
    }
    delete(key) {
        return Promise.resolve(undefined);
    }
    deleteAll() {
        return Promise.resolve(undefined);
    }
    destroy() { }
    exists(key) {
        return Promise.resolve(false);
    }
    get(key) {
        return Promise.resolve(undefined);
    }
    getAll() {
        return Promise.resolve([]);
    }
    getRootRoles() {
        return Promise.resolve([]);
    }
    removeRolesOfTypeForUser(userId, roleTypes) {
        return Promise.resolve(undefined);
    }
    cloneEnvironmentPermissions(sourceEnvironment, destinationEnvironment) {
        return Promise.resolve(undefined);
    }
    clearUserPersonalAccessTokens(userId) {
        return Promise.resolve(undefined);
    }
    unlinkUserGroups(userId) {
        return Promise.resolve(undefined);
    }
    clearPublicSignupUserTokens(userId) {
        return Promise.resolve(undefined);
    }
}
module.exports = AccessStoreMock;
exports.default = AccessStoreMock;
//# sourceMappingURL=fake-access-store.js.map