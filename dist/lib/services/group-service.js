"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupService = void 0;
const bad_data_error_1 = __importDefault(require("../error/bad-data-error"));
const events_1 = require("../types/events");
const name_exists_error_1 = __importDefault(require("../error/name-exists-error"));
class GroupService {
    constructor(stores, { getLogger }) {
        this.logger = getLogger('service/group-service.js');
        this.groupStore = stores.groupStore;
        this.eventStore = stores.eventStore;
        this.accountStore = stores.accountStore;
    }
    async getAll() {
        const groups = await this.groupStore.getAll();
        const allGroupUsers = await this.groupStore.getAllUsersByGroups(groups.map((g) => g.id));
        const users = await this.accountStore.getAllWithId(allGroupUsers.map((u) => u.userId));
        const groupProjects = await this.groupStore.getGroupProjects(groups.map((g) => g.id));
        return groups.map((group) => {
            const mappedGroup = this.mapGroupWithUsers(group, allGroupUsers, users);
            return this.mapGroupWithProjects(groupProjects, mappedGroup);
        });
    }
    mapGroupWithProjects(groupProjects, group) {
        return {
            ...group,
            projects: groupProjects
                .filter((project) => project.groupId === group.id)
                .map((project) => project.project),
        };
    }
    async getGroup(id) {
        const group = await this.groupStore.get(id);
        const groupUsers = await this.groupStore.getAllUsersByGroups([id]);
        const users = await this.accountStore.getAllWithId(groupUsers.map((u) => u.userId));
        return this.mapGroupWithUsers(group, groupUsers, users);
    }
    async createGroup(group, userName) {
        await this.validateGroup(group);
        const newGroup = await this.groupStore.create(group);
        await this.groupStore.addUsersToGroup(newGroup.id, group.users, userName);
        await this.eventStore.store({
            type: events_1.GROUP_CREATED,
            createdBy: userName,
            data: group,
        });
        return newGroup;
    }
    async updateGroup(group, userName) {
        const preData = await this.groupStore.get(group.id);
        await this.validateGroup(group, preData);
        const newGroup = await this.groupStore.update(group);
        const existingUsers = await this.groupStore.getAllUsersByGroups([
            group.id,
        ]);
        const existingUserIds = existingUsers.map((g) => g.userId);
        const deletableUsers = existingUsers.filter((existingUser) => !group.users.some((groupUser) => groupUser.user.id == existingUser.userId));
        await this.groupStore.updateGroupUsers(newGroup.id, group.users.filter((user) => !existingUserIds.includes(user.user.id)), deletableUsers, userName);
        await this.eventStore.store({
            type: events_1.GROUP_UPDATED,
            createdBy: userName,
            data: newGroup,
            preData,
        });
        return newGroup;
    }
    async getProjectGroups(projectId) {
        const groupRoles = await this.groupStore.getProjectGroupRoles(projectId);
        if (groupRoles.length > 0) {
            const groups = await this.groupStore.getAllWithId(groupRoles.map((a) => a.groupId));
            const groupUsers = await this.groupStore.getAllUsersByGroups(groups.map((g) => g.id));
            const users = await this.accountStore.getAllWithId(groupUsers.map((u) => u.userId));
            return groups.map((group) => {
                const groupRole = groupRoles.find((g) => g.groupId == group.id);
                return {
                    ...this.mapGroupWithUsers(group, groupUsers, users),
                    roleId: groupRole.roleId,
                    addedAt: groupRole.createdAt,
                };
            });
        }
        return [];
    }
    async deleteGroup(id) {
        return this.groupStore.delete(id);
    }
    async validateGroup(group, existingGroup) {
        if (!group.name) {
            throw new bad_data_error_1.default('Group name cannot be empty');
        }
        if (!existingGroup || existingGroup.name != group.name) {
            if (await this.groupStore.existsWithName(group.name)) {
                throw new name_exists_error_1.default('Group name already exists');
            }
        }
        if (group.id &&
            group.rootRole &&
            (await this.groupStore.hasProjectRole(group.id))) {
            throw new bad_data_error_1.default('This group already has a project role and cannot also be given a root role');
        }
    }
    async getRolesForProject(projectId) {
        return this.groupStore.getProjectGroupRoles(projectId);
    }
    mapGroupWithUsers(group, allGroupUsers, allUsers) {
        const groupUsers = allGroupUsers.filter((user) => user.groupId == group.id);
        const groupUsersId = groupUsers.map((user) => user.userId);
        const selectedUsers = allUsers.filter((user) => groupUsersId.includes(user.id));
        const finalUsers = selectedUsers.map((user) => {
            const roleUser = groupUsers.find((gu) => gu.userId == user.id);
            return {
                user: user,
                joinedAt: roleUser.joinedAt,
                createdBy: roleUser.createdBy,
            };
        });
        return { ...group, users: finalUsers };
    }
    async syncExternalGroups(userId, externalGroups, createdBy) {
        if (Array.isArray(externalGroups)) {
            let newGroups = await this.groupStore.getNewGroupsForExternalUser(userId, externalGroups);
            await this.groupStore.addUserToGroups(userId, newGroups.map((g) => g.id), createdBy);
            let oldGroups = await this.groupStore.getOldGroupsForExternalUser(userId, externalGroups);
            await this.groupStore.deleteUsersFromGroup(oldGroups);
        }
    }
    async getGroupsForUser(userId) {
        return this.groupStore.getGroupsForUser(userId);
    }
}
exports.GroupService = GroupService;
//# sourceMappingURL=group-service.js.map