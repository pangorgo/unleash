"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessStore = void 0;
const metrics_helper_1 = __importDefault(require("../util/metrics-helper"));
const metric_events_1 = require("../metric-events");
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const constants_1 = require("../util/constants");
const T = {
    ROLE_USER: 'role_user',
    ROLES: 'roles',
    GROUPS: 'groups',
    GROUP_ROLE: 'group_role',
    GROUP_USER: 'group_user',
    ROLE_PERMISSION: 'role_permission',
    PERMISSIONS: 'permissions',
    PERMISSION_TYPES: 'permission_types',
    CHANGE_REQUEST_SETTINGS: 'change_request_settings',
    PERSONAL_ACCESS_TOKENS: 'personal_access_tokens',
    PUBLIC_SIGNUP_TOKENS_USER: 'public_signup_tokens_user',
};
class AccessStore {
    constructor(db, eventBus, getLogger) {
        this.db = db;
        this.logger = getLogger('access-store.ts');
        this.timer = (action) => metrics_helper_1.default.wrapTimer(eventBus, metric_events_1.DB_TIME, {
            store: 'access-store',
            action,
        });
    }
    async delete(key) {
        await this.db(T.ROLES).where({ id: key }).del();
    }
    async deleteAll() {
        await this.db(T.ROLES).del();
    }
    destroy() { }
    async exists(key) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1 FROM ${T.ROLES} WHERE id = ?) AS present`, [key]);
        const { present } = result.rows[0];
        return present;
    }
    async get(key) {
        const role = await this.db
            .select(['id', 'name', 'type', 'description'])
            .where('id', key)
            .first()
            .from(T.ROLES);
        if (!role) {
            throw new notfound_error_1.default(`Could not find role with id: ${key}`);
        }
        return role;
    }
    async getAll() {
        return Promise.resolve([]);
    }
    async getAvailablePermissions() {
        const rows = await this.db
            .select(['id', 'permission', 'type', 'display_name'])
            .where('type', 'project')
            .orWhere('type', 'environment')
            .orWhere('type', 'root')
            .from(`${T.PERMISSIONS} as p`);
        return rows.map(this.mapPermission);
    }
    mapPermission(permission) {
        return {
            id: permission.id,
            name: permission.permission,
            displayName: permission.display_name,
            type: permission.type,
        };
    }
    async getPermissionsForUser(userId) {
        const stopTimer = this.timer('getPermissionsForUser');
        let userPermissionQuery = this.db
            .select('project', 'permission', 'environment', 'type', 'ur.role_id')
            .from(`${T.ROLE_PERMISSION} AS rp`)
            .join(`${T.ROLE_USER} AS ur`, 'ur.role_id', 'rp.role_id')
            .join(`${T.PERMISSIONS} AS p`, 'p.id', 'rp.permission_id')
            .where('ur.user_id', '=', userId);
        userPermissionQuery = userPermissionQuery.union((db) => {
            db.select('project', 'permission', 'environment', 'p.type', 'gr.role_id')
                .from(`${T.GROUP_USER} AS gu`)
                .join(`${T.GROUPS} AS g`, 'g.id', 'gu.group_id')
                .join(`${T.GROUP_ROLE} AS gr`, 'gu.group_id', 'gr.group_id')
                .join(`${T.ROLE_PERMISSION} AS rp`, 'rp.role_id', 'gr.role_id')
                .join(`${T.PERMISSIONS} AS p`, 'p.id', 'rp.permission_id')
                .whereNull('g.root_role_id')
                .andWhere('gu.user_id', '=', userId);
        });
        userPermissionQuery = userPermissionQuery.union((db) => {
            db.select(this.db.raw("'default' as project"), 'permission', 'environment', 'p.type', 'g.root_role_id as role_id')
                .from(`${T.GROUP_USER} as gu`)
                .join(`${T.GROUPS} AS g`, 'g.id', 'gu.group_id')
                .join(`${T.ROLE_PERMISSION} as rp`, 'rp.role_id', 'g.root_role_id')
                .join(`${T.PERMISSIONS} as p`, 'p.id', 'rp.permission_id')
                .whereNotNull('g.root_role_id')
                .andWhere('gu.user_id', '=', userId);
        });
        const rows = await userPermissionQuery;
        stopTimer();
        return rows.map(this.mapUserPermission);
    }
    mapUserPermission(row) {
        let project = undefined;
        // Since the editor should have access to the default project,
        // we map the project to the project and environment specific
        // permissions that are connected to the editor role.
        if (row.type !== constants_1.ROOT_PERMISSION_TYPE) {
            project = row.project;
        }
        const environment = row.type === constants_1.ENVIRONMENT_PERMISSION_TYPE
            ? row.environment
            : undefined;
        return {
            project,
            environment,
            permission: row.permission,
        };
    }
    async getPermissionsForRole(roleId) {
        const stopTimer = this.timer('getPermissionsForRole');
        const rows = await this.db
            .select('p.id', 'p.permission', 'rp.environment', 'p.display_name', 'p.type')
            .from(`${T.ROLE_PERMISSION} as rp`)
            .join(`${T.PERMISSIONS} as p`, 'p.id', 'rp.permission_id')
            .where('rp.role_id', '=', roleId);
        stopTimer();
        return rows.map((permission) => {
            return {
                id: permission.id,
                name: permission.permission,
                environment: permission.environment,
                displayName: permission.display_name,
                type: permission.type,
            };
        });
    }
    async addEnvironmentPermissionsToRole(role_id, permissions) {
        const rows = permissions.map((permission) => {
            return {
                role_id,
                permission_id: permission.id,
                environment: permission.environment,
            };
        });
        await this.db.batchInsert(T.ROLE_PERMISSION, rows);
    }
    async unlinkUserRoles(userId) {
        return this.db(T.ROLE_USER)
            .where({
            user_id: userId,
        })
            .delete();
    }
    async unlinkUserGroups(userId) {
        return this.db(T.GROUP_USER)
            .where({
            user_id: userId,
        })
            .delete();
    }
    async clearUserPersonalAccessTokens(userId) {
        return this.db(T.PERSONAL_ACCESS_TOKENS)
            .where({
            user_id: userId,
        })
            .delete();
    }
    async clearPublicSignupUserTokens(userId) {
        return this.db(T.PUBLIC_SIGNUP_TOKENS_USER)
            .where({
            user_id: userId,
        })
            .delete();
    }
    async getProjectUsersForRole(roleId, projectId) {
        const rows = await this.db
            .select(['user_id', 'ru.created_at'])
            .from(`${T.ROLE_USER} AS ru`)
            .join(`${T.ROLES} as r`, 'ru.role_id', 'id')
            .where('r.id', roleId)
            .andWhere('ru.project', projectId);
        return rows.map((r) => ({
            userId: r.user_id,
            addedAt: r.created_at,
        }));
    }
    async getRolesForUserId(userId) {
        return this.db
            .select(['id', 'name', 'type', 'project', 'description'])
            .from(T.ROLES)
            .innerJoin(`${T.ROLE_USER} as ru`, 'ru.role_id', 'id')
            .where('ru.user_id', '=', userId);
    }
    async getUserIdsForRole(roleId) {
        const rows = await this.db
            .select(['user_id'])
            .from(T.ROLE_USER)
            .where('role_id', roleId);
        return rows.map((r) => r.user_id);
    }
    async getGroupIdsForRole(roleId) {
        const rows = await this.db
            .select(['group_id'])
            .from(T.GROUP_ROLE)
            .where('role_id', roleId);
        return rows.map((r) => r.group_id);
    }
    async getProjectUserAndGroupCountsForRole(roleId) {
        const query = await this.db.raw(`
            SELECT 
                uq.project,
                sum(uq.user_count) AS user_count,
                sum(uq.svc_account_count) AS svc_account_count,
                sum(uq.group_count) AS group_count
            FROM (
                SELECT 
                    project,
                    0 AS user_count,
                    0 AS svc_account_count,
                    count(project) AS group_count
                FROM group_role
                WHERE role_id = ?
                GROUP BY project

                UNION SELECT
                    project,
                    count(us.id) AS user_count,
                    count(svc.id) AS svc_account_count,
                    0 AS group_count
                FROM role_user AS usr_r
                LEFT OUTER JOIN public.users AS us ON us.id = usr_r.user_id AND us.is_service = 'false'
                LEFT OUTER JOIN public.users AS svc ON svc.id = usr_r.user_id AND svc.is_service = 'true'
                WHERE usr_r.role_id = ?
                GROUP BY usr_r.project
            ) AS uq
            GROUP BY uq.project
        `, [roleId, roleId]);
        /*
        const rows2 = await this.db(T.ROLE_USER)
            .select('project', this.db.raw('count(project) as user_count'))
            .where('role_id', roleId)
            .groupBy('project');
            */
        return query.rows.map((r) => {
            return {
                project: r.project,
                role: roleId,
                userCount: Number(r.user_count),
                groupCount: Number(r.group_count),
                serviceAccountCount: Number(r.svc_account_count),
            };
        });
    }
    async addUserToRole(userId, roleId, projectId) {
        return this.db(T.ROLE_USER).insert({
            user_id: userId,
            role_id: roleId,
            project: projectId,
        });
    }
    async removeUserFromRole(userId, roleId, projectId) {
        return this.db(T.ROLE_USER)
            .where({
            user_id: userId,
            role_id: roleId,
            project: projectId,
        })
            .delete();
    }
    async addGroupToRole(groupId, roleId, createdBy, projectId) {
        return this.db(T.GROUP_ROLE).insert({
            group_id: groupId,
            role_id: roleId,
            project: projectId,
            created_by: createdBy,
        });
    }
    async removeGroupFromRole(groupId, roleId, projectId) {
        return this.db(T.GROUP_ROLE)
            .where({
            group_id: groupId,
            role_id: roleId,
            project: projectId,
        })
            .delete();
    }
    async updateUserProjectRole(userId, roleId, projectId) {
        return this.db(T.ROLE_USER)
            .where({
            user_id: userId,
            project: projectId,
        })
            .whereNotIn('role_id', this.db(T.ROLES).select('id as role_id').where('type', 'root'))
            .update('role_id', roleId);
    }
    updateGroupProjectRole(groupId, roleId, projectId) {
        return this.db(T.GROUP_ROLE)
            .where({
            group_id: groupId,
            project: projectId,
        })
            .whereNotIn('role_id', this.db(T.ROLES).select('id as role_id').where('type', 'root'))
            .update('role_id', roleId);
    }
    async addAccessToProject(users, groups, projectId, roleId, createdBy) {
        const userRows = users.map((user) => {
            return {
                user_id: user.id,
                project: projectId,
                role_id: roleId,
            };
        });
        const groupRows = groups.map((group) => {
            return {
                group_id: group.id,
                project: projectId,
                role_id: roleId,
                created_by: createdBy,
            };
        });
        await this.db.transaction(async (tx) => {
            if (userRows.length > 0) {
                await tx(T.ROLE_USER)
                    .insert(userRows)
                    .onConflict(['project', 'role_id', 'user_id'])
                    .merge();
            }
            if (groupRows.length > 0) {
                await tx(T.GROUP_ROLE)
                    .insert(groupRows)
                    .onConflict(['project', 'role_id', 'group_id'])
                    .merge();
            }
        });
    }
    async removeRolesOfTypeForUser(userId, roleTypes) {
        const rolesToRemove = this.db(T.ROLES)
            .select('id')
            .whereIn('type', roleTypes);
        return this.db(T.ROLE_USER)
            .where({ user_id: userId })
            .whereIn('role_id', rolesToRemove)
            .delete();
    }
    async addPermissionsToRole(role_id, permissions, environment) {
        const rows = await this.db
            .select('id as permissionId')
            .from(T.PERMISSIONS)
            .whereIn('permission', permissions);
        const newRoles = rows.map((row) => ({
            role_id,
            environment,
            permission_id: row.permissionId,
        }));
        return this.db.batchInsert(T.ROLE_PERMISSION, newRoles);
    }
    async removePermissionFromRole(role_id, permission, environment) {
        const rows = await this.db
            .select('id as permissionId')
            .from(T.PERMISSIONS)
            .where('permission', permission);
        const permissionId = rows[0].permissionId;
        return this.db(T.ROLE_PERMISSION)
            .where({
            role_id,
            permission_id: permissionId,
            environment,
        })
            .delete();
    }
    async wipePermissionsFromRole(role_id) {
        return this.db(T.ROLE_PERMISSION)
            .where({
            role_id,
        })
            .delete();
    }
    async cloneEnvironmentPermissions(sourceEnvironment, destinationEnvironment) {
        return this.db.raw(`insert into role_permission
                (role_id, permission_id, environment)
                (select role_id, permission_id, ?
                from ${T.ROLE_PERMISSION} where environment = ?)`, [destinationEnvironment, sourceEnvironment]);
    }
}
exports.AccessStore = AccessStore;
//# sourceMappingURL=access-store.js.map