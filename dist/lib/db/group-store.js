"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const group_1 = __importDefault(require("../types/group"));
const error_1 = require("../error");
const T = {
    GROUPS: 'groups',
    GROUP_USER: 'group_user',
    GROUP_ROLE: 'group_role',
    USERS: 'users',
    PROJECTS: 'projects',
    ROLES: 'roles',
};
const GROUP_COLUMNS = [
    'id',
    'name',
    'description',
    'mappings_sso',
    'created_at',
    'created_by',
    'root_role_id',
];
const rowToGroup = (row) => {
    if (!row) {
        throw new notfound_error_1.default('No group found');
    }
    return new group_1.default({
        id: row.id,
        name: row.name,
        description: row.description,
        mappingsSSO: row.mappings_sso,
        createdAt: row.created_at,
        createdBy: row.created_by,
        rootRole: row.root_role_id,
    });
};
const rowToGroupUser = (row) => {
    if (!row) {
        throw new notfound_error_1.default('No group user found');
    }
    return {
        userId: row.user_id,
        groupId: row.group_id,
        joinedAt: row.created_at,
        createdBy: row.created_by,
        rootRoleId: row.root_role_id,
    };
};
const groupToRow = (group) => ({
    name: group.name,
    description: group.description,
    mappings_sso: JSON.stringify(group.mappingsSSO),
    root_role_id: group.rootRole || null,
});
class GroupStore {
    constructor(db) {
        this.db = db;
    }
    async getAllWithId(ids) {
        const groups = await this.db
            .select(GROUP_COLUMNS)
            .from(T.GROUPS)
            .whereIn('id', ids);
        return groups.map(rowToGroup);
    }
    async update(group) {
        try {
            const rows = await this.db(T.GROUPS)
                .where({ id: group.id })
                .update(groupToRow(group))
                .returning(GROUP_COLUMNS);
            return rowToGroup(rows[0]);
        }
        catch (error) {
            if (error.code === error_1.FOREIGN_KEY_VIOLATION &&
                error.constraint === 'fk_group_role_id') {
                throw new error_1.BadDataError(`Incorrect role id ${group.rootRole}`);
            }
            throw error;
        }
    }
    async getProjectGroupRoles(projectId) {
        const rows = await this.db
            .select('gr.group_id', 'gr.role_id', 'gr.created_at', 'r.name')
            .from(`${T.GROUP_ROLE} as gr`)
            .innerJoin(`${T.ROLES} as r`, 'gr.role_id', 'r.id')
            .where('project', projectId);
        return rows.map((r) => {
            return {
                groupId: r.group_id,
                roleId: r.role_id,
                createdAt: r.created_at,
                name: r.name,
            };
        });
    }
    async getGroupProjects(groupIds) {
        const rows = await this.db
            .select('group_id', 'project')
            .from(T.GROUP_ROLE)
            .whereIn('group_id', groupIds)
            .distinct();
        return rows.map((r) => {
            return {
                groupId: r.group_id,
                project: r.project,
            };
        });
    }
    async getAllUsersByGroups(groupIds) {
        const rows = await this.db
            .select('gu.group_id', 'u.id as user_id', 'gu.created_at', 'gu.created_by', 'g.root_role_id')
            .from(`${T.GROUP_USER} AS gu`)
            .join(`${T.USERS} AS u`, 'u.id', 'gu.user_id')
            .join(`${T.GROUPS} AS g`, 'g.id', 'gu.group_id')
            .whereIn('gu.group_id', groupIds);
        return rows.map(rowToGroupUser);
    }
    async getAll() {
        const groups = await this.db.select(GROUP_COLUMNS).from(T.GROUPS);
        return groups.map(rowToGroup);
    }
    async delete(id) {
        return this.db(T.GROUPS).where({ id }).del();
    }
    async deleteAll() {
        await this.db(T.GROUPS).del();
    }
    destroy() { }
    async exists(id) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1 FROM ${T.GROUPS} WHERE id = ?) AS present`, [id]);
        const { present } = result.rows[0];
        return present;
    }
    async existsWithName(name) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1 FROM ${T.GROUPS} WHERE name = ?) AS present`, [name]);
        const { present } = result.rows[0];
        return present;
    }
    async get(id) {
        const row = await this.db(T.GROUPS).where({ id }).first();
        return rowToGroup(row);
    }
    async create(group) {
        try {
            const row = await this.db(T.GROUPS)
                .insert(groupToRow(group))
                .returning('*');
            return rowToGroup(row[0]);
        }
        catch (error) {
            if (error.code === error_1.FOREIGN_KEY_VIOLATION &&
                error.constraint === 'fk_group_role_id') {
                throw new error_1.BadDataError(`Incorrect role id ${group.rootRole}`);
            }
            throw error;
        }
    }
    async count() {
        return this.db(T.GROUPS)
            .count('*')
            .then((res) => Number(res[0].count));
    }
    async addUsersToGroup(groupId, users, userName) {
        try {
            const rows = (users || []).map((user) => {
                return {
                    group_id: groupId,
                    user_id: user.user.id,
                    created_by: userName,
                };
            });
            return await this.db.batchInsert(T.GROUP_USER, rows);
        }
        catch (error) {
            if (error.code === error_1.FOREIGN_KEY_VIOLATION &&
                error.constraint === 'group_user_user_id_fkey') {
                throw new error_1.BadDataError('Incorrect user id in the users group');
            }
            throw error;
        }
    }
    async deleteUsersFromGroup(deletableUsers) {
        return this.db(T.GROUP_USER)
            .whereIn(['group_id', 'user_id'], deletableUsers.map((user) => [user.groupId, user.userId]))
            .delete();
    }
    async updateGroupUsers(groupId, newUsers, deletableUsers, userName) {
        await this.addUsersToGroup(groupId, newUsers, userName);
        await this.deleteUsersFromGroup(deletableUsers);
    }
    async getNewGroupsForExternalUser(userId, externalGroups) {
        const rows = await this.db(`${T.GROUPS} as g`)
            .leftJoin(`${T.GROUP_USER} as gs`, function () {
            this.on('g.id', 'gs.group_id').andOnVal('gs.user_id', '=', userId);
        })
            .where('gs.user_id', null)
            .whereRaw('mappings_sso \\?| :groups', { groups: externalGroups });
        return rows.map(rowToGroup);
    }
    async addUserToGroups(userId, groupIds, createdBy) {
        const rows = groupIds.map((groupId) => {
            return {
                group_id: groupId,
                user_id: userId,
                created_by: createdBy,
            };
        });
        return this.db.batchInsert(T.GROUP_USER, rows);
    }
    async getOldGroupsForExternalUser(userId, externalGroups) {
        const rows = await this.db(`${T.GROUP_USER} as gu`)
            .leftJoin(`${T.GROUPS} as g`, 'g.id', 'gu.group_id')
            .whereNotIn('g.id', this.db(T.GROUPS)
            .select('id')
            .whereRaw('mappings_sso \\?| :groups', {
            groups: externalGroups,
        })
            .orWhereRaw('jsonb_array_length(mappings_sso) = 0'))
            .where('gu.user_id', userId);
        return rows.map(rowToGroupUser);
    }
    async getGroupsForUser(userId) {
        const rows = await this.db(T.GROUPS)
            .leftJoin(T.GROUP_USER, 'groups.id', 'group_user.group_id')
            .where('user_id', userId);
        return rows.map(rowToGroup);
    }
    async hasProjectRole(groupId) {
        const result = await this.db.raw(`SELECT EXISTS(SELECT 1 FROM ${T.GROUP_ROLE} WHERE group_id = ?) AS present`, [groupId]);
        const { present } = result.rows[0];
        return present;
    }
}
exports.default = GroupStore;
//# sourceMappingURL=group-store.js.map