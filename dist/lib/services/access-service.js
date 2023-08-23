"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessService = void 0;
const permissions = __importStar(require("../types/permissions"));
const model_1 = require("../types/model");
const name_exists_error_1 = __importDefault(require("../error/name-exists-error"));
const role_in_use_error_1 = __importDefault(require("../error/role-in-use-error"));
const role_schema_1 = require("../schema/role-schema");
const constants_1 = require("../util/constants");
const project_1 = require("../types/project");
const invalid_operation_error_1 = __importDefault(require("../error/invalid-operation-error"));
const bad_data_error_1 = __importDefault(require("../error/bad-data-error"));
const { ADMIN } = permissions;
const PROJECT_ADMIN = [
    permissions.UPDATE_PROJECT,
    permissions.DELETE_PROJECT,
    permissions.CREATE_FEATURE,
    permissions.UPDATE_FEATURE,
    permissions.DELETE_FEATURE,
];
const isProjectPermission = (permission) => PROJECT_ADMIN.includes(permission);
class AccessService {
    constructor({ accessStore, accountStore, roleStore, environmentStore, groupStore, }, { getLogger, flagResolver, }, groupService) {
        this.store = accessStore;
        this.accountStore = accountStore;
        this.roleStore = roleStore;
        this.groupService = groupService;
        this.environmentStore = environmentStore;
        this.logger = getLogger('/services/access-service.ts');
        this.flagResolver = flagResolver;
        this.groupStore = groupStore;
    }
    /**
     * Used to check if a user has access to the requested resource
     *
     * @param user
     * @param permission
     * @param projectId
     */
    async hasPermission(user, permission, projectId, environment) {
        const permissionsArray = Array.isArray(permission)
            ? permission
            : [permission];
        const permissionLogInfo = permissionsArray.length === 1
            ? `permission=${permissionsArray[0]}`
            : `permissions=[${permissionsArray.join(',')}]`;
        this.logger.info(`Checking ${permissionLogInfo}, userId=${user.id}, projectId=${projectId}, environment=${environment}`);
        try {
            const userP = await this.getPermissionsForUser(user);
            return userP
                .filter((p) => !p.project ||
                p.project === projectId ||
                p.project === constants_1.ALL_PROJECTS)
                .filter((p) => !p.environment ||
                p.environment === environment ||
                p.environment === constants_1.ALL_ENVS)
                .some((p) => permissionsArray.includes(p.permission) ||
                p.permission === ADMIN);
        }
        catch (e) {
            this.logger.error(`Error checking ${permissionLogInfo}, userId=${user.id} projectId=${projectId}`, e);
            return Promise.resolve(false);
        }
    }
    async getPermissionsForUser(user) {
        if (user.isAPI) {
            return user.permissions?.map((p) => ({
                permission: p,
            }));
        }
        return this.store.getPermissionsForUser(user.id);
    }
    async getPermissions() {
        const bindablePermissions = await this.store.getAvailablePermissions();
        const environments = await this.environmentStore.getAll();
        const rootPermissions = bindablePermissions.filter(({ type }) => type === 'root');
        const projectPermissions = bindablePermissions.filter((x) => {
            return x.type === 'project';
        });
        const environmentPermissions = bindablePermissions.filter((perm) => {
            return perm.type === 'environment';
        });
        const allEnvironmentPermissions = environments.map((env) => {
            return {
                name: env.name,
                permissions: environmentPermissions.map((permission) => {
                    return { environment: env.name, ...permission };
                }),
            };
        });
        return {
            root: rootPermissions,
            project: projectPermissions,
            environments: allEnvironmentPermissions,
        };
    }
    async addUserToRole(userId, roleId, projectId) {
        return this.store.addUserToRole(userId, roleId, projectId);
    }
    async addGroupToRole(groupId, roleId, createdBy, projectId) {
        return this.store.addGroupToRole(groupId, roleId, createdBy, projectId);
    }
    async addAccessToProject(users, groups, projectId, roleId, createdBy) {
        return this.store.addAccessToProject(users, groups, projectId, roleId, createdBy);
    }
    async getRoleByName(roleName) {
        return this.roleStore.getRoleByName(roleName);
    }
    async setUserRootRole(userId, role) {
        const newRootRole = await this.resolveRootRole(role);
        if (newRootRole) {
            try {
                await this.store.removeRolesOfTypeForUser(userId, constants_1.ROOT_ROLE_TYPES);
                await this.store.addUserToRole(userId, newRootRole.id, project_1.DEFAULT_PROJECT);
            }
            catch (error) {
                throw new Error(`Could not add role=${newRootRole.name} to userId=${userId}`);
            }
        }
        else {
            throw new bad_data_error_1.default(`Could not find rootRole=${role}`);
        }
    }
    async getUserRootRoles(userId) {
        const userRoles = await this.store.getRolesForUserId(userId);
        return userRoles.filter(({ type }) => constants_1.ROOT_ROLE_TYPES.includes(type));
    }
    async removeUserFromRole(userId, roleId, projectId) {
        return this.store.removeUserFromRole(userId, roleId, projectId);
    }
    async removeGroupFromRole(groupId, roleId, projectId) {
        return this.store.removeGroupFromRole(groupId, roleId, projectId);
    }
    async updateUserProjectRole(userId, roleId, projectId) {
        return this.store.updateUserProjectRole(userId, roleId, projectId);
    }
    async updateGroupProjectRole(userId, roleId, projectId) {
        return this.store.updateGroupProjectRole(userId, roleId, projectId);
    }
    //This actually only exists for testing purposes
    async addPermissionToRole(roleId, permission, environment) {
        if (isProjectPermission(permission) && !environment) {
            throw new Error(`ProjectId cannot be empty for permission=${permission}`);
        }
        return this.store.addPermissionsToRole(roleId, [permission], environment);
    }
    //This actually only exists for testing purposes
    async removePermissionFromRole(roleId, permission, environment) {
        if (isProjectPermission(permission) && !environment) {
            throw new Error(`ProjectId cannot be empty for permission=${permission}`);
        }
        return this.store.removePermissionFromRole(roleId, permission, environment);
    }
    async getRoles() {
        return this.roleStore.getRoles();
    }
    async getRole(id) {
        const role = await this.store.get(id);
        const rolePermissions = await this.store.getPermissionsForRole(role.id);
        return {
            ...role,
            permissions: rolePermissions,
        };
    }
    async getRoleData(roleId) {
        const [role, rolePerms, users] = await Promise.all([
            this.store.get(roleId),
            this.store.getPermissionsForRole(roleId),
            this.getUsersForRole(roleId),
        ]);
        return { role, permissions: rolePerms, users };
    }
    async getProjectRoles() {
        return this.roleStore.getProjectRoles();
    }
    async getRolesForProject(projectId) {
        return this.roleStore.getRolesForProject(projectId);
    }
    async getRolesForUser(userId) {
        return this.store.getRolesForUserId(userId);
    }
    async wipeUserPermissions(userId) {
        return Promise.all([
            this.store.unlinkUserRoles(userId),
            this.store.unlinkUserGroups(userId),
            this.store.clearUserPersonalAccessTokens(userId),
            this.store.clearPublicSignupUserTokens(userId),
        ]);
    }
    async getUsersForRole(roleId) {
        const userIdList = await this.store.getUserIdsForRole(roleId);
        if (userIdList.length > 0) {
            return this.accountStore.getAllWithId(userIdList);
        }
        return [];
    }
    async getGroupsForRole(roleId) {
        const groupdIdList = await this.store.getGroupIdsForRole(roleId);
        if (groupdIdList.length > 0) {
            return this.groupStore.getAllWithId(groupdIdList);
        }
        return [];
    }
    async getProjectUsersForRole(roleId, projectId) {
        const userRoleList = await this.store.getProjectUsersForRole(roleId, projectId);
        if (userRoleList.length > 0) {
            const userIdList = userRoleList.map((u) => u.userId);
            const users = await this.accountStore.getAllWithId(userIdList);
            return users.map((user) => {
                const role = userRoleList.find((r) => r.userId == user.id);
                return {
                    ...user,
                    addedAt: role.addedAt,
                };
            });
        }
        return [];
    }
    async getProjectRoleAccess(projectId) {
        const roles = await this.roleStore.getProjectRoles();
        const users = await Promise.all(roles.map(async (role) => {
            const projectUsers = await this.getProjectUsersForRole(role.id, projectId);
            return projectUsers.map((u) => ({ ...u, roleId: role.id }));
        }));
        const groups = await this.groupService.getProjectGroups(projectId);
        return [roles, users.flat(), groups];
    }
    async getProjectRoleUsage(roleId) {
        return this.store.getProjectUserAndGroupCountsForRole(roleId);
    }
    async createDefaultProjectRoles(owner, projectId) {
        if (!projectId) {
            throw new Error('ProjectId cannot be empty');
        }
        const ownerRole = await this.roleStore.getRoleByName(model_1.RoleName.OWNER);
        // TODO: remove this when all users is guaranteed to have a unique id.
        if (owner.id) {
            this.logger.info(`Making ${owner.id} admin of ${projectId} via roleId=${ownerRole.id}`);
            await this.store.addUserToRole(owner.id, ownerRole.id, projectId);
        }
    }
    async removeDefaultProjectRoles(owner, projectId) {
        this.logger.info(`Removing project roles for ${projectId}`);
        return this.roleStore.removeRolesForProject(projectId);
    }
    async getRootRoleForAllUsers() {
        return this.roleStore.getRootRoleForAllUsers();
    }
    async getRootRoles() {
        return this.roleStore.getRootRoles();
    }
    async resolveRootRole(rootRole) {
        const rootRoles = await this.getRootRoles();
        let role;
        if (typeof rootRole === 'number') {
            role = rootRoles.find((r) => r.id === rootRole);
        }
        else {
            role = rootRoles.find((r) => r.name === rootRole);
        }
        return role;
    }
    async getRootRole(roleName) {
        const roles = await this.roleStore.getRootRoles();
        return roles.find((r) => r.name === roleName);
    }
    async getAllRoles() {
        return this.roleStore.getAll();
    }
    async createRole(role) {
        // CUSTOM_PROJECT_ROLE_TYPE is assumed by default for backward compatibility
        const roleType = role.type === constants_1.CUSTOM_ROOT_ROLE_TYPE
            ? constants_1.CUSTOM_ROOT_ROLE_TYPE
            : constants_1.CUSTOM_PROJECT_ROLE_TYPE;
        if (roleType === constants_1.CUSTOM_ROOT_ROLE_TYPE &&
            this.flagResolver.isEnabled('customRootRolesKillSwitch')) {
            throw new invalid_operation_error_1.default('Custom root roles are not enabled.');
        }
        const baseRole = {
            ...(await this.validateRole(role)),
            roleType,
        };
        const rolePermissions = role.permissions;
        const newRole = await this.roleStore.create(baseRole);
        if (rolePermissions) {
            if (roleType === constants_1.CUSTOM_ROOT_ROLE_TYPE) {
                await this.store.addPermissionsToRole(newRole.id, rolePermissions.map(({ name }) => name));
            }
            else {
                await this.store.addEnvironmentPermissionsToRole(newRole.id, rolePermissions);
            }
        }
        return newRole;
    }
    async updateRole(role) {
        const roleType = role.type === constants_1.CUSTOM_ROOT_ROLE_TYPE
            ? constants_1.CUSTOM_ROOT_ROLE_TYPE
            : constants_1.CUSTOM_PROJECT_ROLE_TYPE;
        if (roleType === constants_1.CUSTOM_ROOT_ROLE_TYPE &&
            this.flagResolver.isEnabled('customRootRolesKillSwitch')) {
            throw new invalid_operation_error_1.default('Custom root roles are not enabled.');
        }
        await this.validateRole(role, role.id);
        const baseRole = {
            id: role.id,
            name: role.name,
            description: role.description,
            roleType,
        };
        const rolePermissions = role.permissions;
        const newRole = await this.roleStore.update(baseRole);
        if (rolePermissions) {
            await this.store.wipePermissionsFromRole(newRole.id);
            if (roleType === constants_1.CUSTOM_ROOT_ROLE_TYPE) {
                await this.store.addPermissionsToRole(newRole.id, rolePermissions.map(({ name }) => name));
            }
            else {
                await this.store.addEnvironmentPermissionsToRole(newRole.id, rolePermissions);
            }
        }
        return newRole;
    }
    async deleteRole(id) {
        await this.validateRoleIsNotBuiltIn(id);
        const roleUsers = await this.getUsersForRole(id);
        const roleGroups = await this.getGroupsForRole(id);
        if (roleUsers.length > 0 || roleGroups.length > 0) {
            throw new role_in_use_error_1.default(`Role is in use by users(${roleUsers.length}) or groups(${roleGroups.length}). You cannot delete a role that is in use without first removing the role from the users and groups.`);
        }
        return this.roleStore.delete(id);
    }
    async validateRoleIsUnique(roleName, existingId) {
        const exists = await this.roleStore.nameInUse(roleName, existingId);
        if (exists) {
            throw new name_exists_error_1.default(`There already exists a role with the name ${roleName}`);
        }
        return Promise.resolve();
    }
    async validateRoleIsNotBuiltIn(roleId) {
        const role = await this.store.get(roleId);
        if (role.type !== constants_1.CUSTOM_PROJECT_ROLE_TYPE &&
            role.type !== constants_1.CUSTOM_ROOT_ROLE_TYPE) {
            throw new invalid_operation_error_1.default('You cannot change built in roles.');
        }
    }
    async validateRole(role, existingId) {
        const cleanedRole = await role_schema_1.roleSchema.validateAsync(role);
        if (existingId) {
            await this.validateRoleIsNotBuiltIn(existingId);
        }
        await this.validateRoleIsUnique(role.name, existingId);
        return cleanedRole;
    }
}
exports.AccessService = AccessService;
//# sourceMappingURL=access-service.js.map