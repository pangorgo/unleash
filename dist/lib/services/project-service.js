"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const joi_1 = require("joi");
const name_exists_error_1 = __importDefault(require("../error/name-exists-error"));
const invalid_operation_error_1 = __importDefault(require("../error/invalid-operation-error"));
const util_1 = require("../routes/util");
const project_schema_1 = require("./project-schema");
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const types_1 = require("../types");
const incompatible_project_error_1 = __importDefault(require("../error/incompatible-project-error"));
const project_without_owner_error_1 = __importDefault(require("../error/project-without-owner-error"));
const util_2 = require("../util");
const time_to_production_1 = require("../features/feature-toggle/time-to-production/time-to-production");
const unique_1 = require("../util/unique");
const error_1 = require("../error");
const getCreatedBy = (user) => user.email || user.username || 'unknown';
class ProjectService {
    constructor({ projectStore, eventStore, featureToggleStore, featureTypeStore, environmentStore, featureEnvironmentStore, featureTagStore, accountStore, projectStatsStore, }, config, accessService, featureToggleService, groupService, favoriteService) {
        this.store = projectStore;
        this.environmentStore = environmentStore;
        this.featureEnvironmentStore = featureEnvironmentStore;
        this.accessService = accessService;
        this.eventStore = eventStore;
        this.featureToggleStore = featureToggleStore;
        this.featureTypeStore = featureTypeStore;
        this.featureToggleService = featureToggleService;
        this.favoritesService = favoriteService;
        this.tagStore = featureTagStore;
        this.accountStore = accountStore;
        this.groupService = groupService;
        this.projectStatsStore = projectStatsStore;
        this.logger = config.getLogger('services/project-service.js');
        this.flagResolver = config.flagResolver;
    }
    async getProjects(query, userId) {
        return this.store.getProjectsWithCounts(query, userId);
    }
    async getProject(id) {
        return this.store.get(id);
    }
    async createProject(newProject, user) {
        const data = await project_schema_1.projectSchema.validateAsync(newProject);
        await this.validateUniqueId(data.id);
        await this.store.create(data);
        const enabledEnvironments = await this.environmentStore.getAll({
            enabled: true,
        });
        // TODO: Only if enabled!
        await Promise.all(enabledEnvironments.map(async (e) => {
            await this.featureEnvironmentStore.connectProject(e.name, data.id);
        }));
        await this.accessService.createDefaultProjectRoles(user, data.id);
        await this.eventStore.store({
            type: types_1.PROJECT_CREATED,
            createdBy: getCreatedBy(user),
            data,
            project: newProject.id,
        });
        return data;
    }
    async updateProject(updatedProject, user) {
        const preData = await this.store.get(updatedProject.id);
        const project = await project_schema_1.projectSchema.validateAsync(updatedProject);
        await this.store.update(project);
        await this.eventStore.store({
            type: types_1.PROJECT_UPDATED,
            project: project.id,
            createdBy: getCreatedBy(user),
            data: project,
            preData,
        });
    }
    async checkProjectsCompatibility(feature, newProjectId) {
        const featureEnvs = await this.featureEnvironmentStore.getAll({
            feature_name: feature.name,
        });
        const newEnvs = await this.store.getEnvironmentsForProject(newProjectId);
        return (0, util_2.arraysHaveSameItems)(featureEnvs.map((env) => env.environment), newEnvs.map((projectEnv) => projectEnv.environment));
    }
    async addEnvironmentToProject(project, environment) {
        await this.store.addEnvironmentToProject(project, environment);
    }
    async changeProject(newProjectId, featureName, user, currentProjectId) {
        const feature = await this.featureToggleStore.get(featureName);
        if (feature.project !== currentProjectId) {
            throw new error_1.PermissionError(types_1.MOVE_FEATURE_TOGGLE);
        }
        const project = await this.getProject(newProjectId);
        if (!project) {
            throw new notfound_error_1.default(`Project ${newProjectId} not found`);
        }
        const authorized = await this.accessService.hasPermission(user, types_1.MOVE_FEATURE_TOGGLE, newProjectId);
        if (!authorized) {
            throw new error_1.PermissionError(types_1.MOVE_FEATURE_TOGGLE);
        }
        const isCompatibleWithTargetProject = await this.checkProjectsCompatibility(feature, newProjectId);
        if (!isCompatibleWithTargetProject) {
            throw new incompatible_project_error_1.default(newProjectId);
        }
        const updatedFeature = await this.featureToggleService.changeProject(featureName, newProjectId, getCreatedBy(user));
        await this.featureToggleService.updateFeatureStrategyProject(featureName, newProjectId);
        return updatedFeature;
    }
    async deleteProject(id, user) {
        if (id === types_1.DEFAULT_PROJECT) {
            throw new invalid_operation_error_1.default('You can not delete the default project!');
        }
        const toggles = await this.featureToggleStore.getAll({
            project: id,
            archived: false,
        });
        if (toggles.length > 0) {
            throw new invalid_operation_error_1.default('You can not delete a project with active feature toggles');
        }
        await this.store.delete(id);
        await this.eventStore.store({
            type: types_1.PROJECT_DELETED,
            createdBy: getCreatedBy(user),
            project: id,
        });
        await this.accessService.removeDefaultProjectRoles(user, id);
    }
    async validateId(id) {
        await util_1.nameType.validateAsync(id);
        await this.validateUniqueId(id);
        return true;
    }
    async validateUniqueId(id) {
        const exists = await this.store.hasProject(id);
        if (exists) {
            throw new name_exists_error_1.default('A project with this id already exists.');
        }
    }
    // RBAC methods
    async getAccessToProject(projectId) {
        const [roles, users, groups] = await this.accessService.getProjectRoleAccess(projectId);
        return {
            roles,
            users,
            groups,
        };
    }
    // Deprecated: See addAccess instead.
    async addUser(projectId, roleId, userId, createdBy) {
        const [roles, users] = await this.accessService.getProjectRoleAccess(projectId);
        const user = await this.accountStore.get(userId);
        const role = roles.find((r) => r.id === roleId);
        if (!role) {
            throw new notfound_error_1.default(`Could not find roleId=${roleId} on project=${projectId}`);
        }
        const alreadyHasAccess = users.some((u) => u.id === userId);
        if (alreadyHasAccess) {
            throw new Error(`User already has access to project=${projectId}`);
        }
        await this.accessService.addUserToRole(userId, role.id, projectId);
        await this.eventStore.store(new types_1.ProjectUserAddedEvent({
            project: projectId,
            createdBy: createdBy || 'system-user',
            data: {
                roleId,
                userId,
                roleName: role.name,
                email: user.email,
            },
        }));
    }
    async removeUser(projectId, roleId, userId, createdBy) {
        const role = await this.findProjectRole(projectId, roleId);
        await this.validateAtLeastOneOwner(projectId, role);
        await this.accessService.removeUserFromRole(userId, role.id, projectId);
        const user = await this.accountStore.get(userId);
        await this.eventStore.store(new types_1.ProjectUserRemovedEvent({
            project: projectId,
            createdBy,
            preData: {
                roleId,
                userId,
                roleName: role.name,
                email: user.email,
            },
        }));
    }
    async addGroup(projectId, roleId, groupId, modifiedBy) {
        const role = await this.accessService.getRole(roleId);
        const group = await this.groupService.getGroup(groupId);
        const project = await this.getProject(projectId);
        if (group.id == null)
            throw new joi_1.ValidationError('Unexpected empty group id', [], undefined);
        await this.accessService.addGroupToRole(group.id, role.id, modifiedBy, project.id);
        await this.eventStore.store(new types_1.ProjectGroupAddedEvent({
            project: project.id,
            createdBy: modifiedBy,
            data: {
                groupId: group.id,
                projectId: project.id,
                roleName: role.name,
            },
        }));
    }
    async removeGroup(projectId, roleId, groupId, modifiedBy) {
        const group = await this.groupService.getGroup(groupId);
        const role = await this.accessService.getRole(roleId);
        const project = await this.getProject(projectId);
        if (group.id == null)
            throw new joi_1.ValidationError('Unexpected empty group id', [], undefined);
        await this.accessService.removeGroupFromRole(group.id, role.id, project.id);
        await this.eventStore.store(new types_1.ProjectGroupRemovedEvent({
            project: projectId,
            createdBy: modifiedBy,
            preData: {
                groupId: group.id,
                projectId: project.id,
                roleName: role.name,
            },
        }));
    }
    async addAccess(projectId, roleId, usersAndGroups, createdBy) {
        await this.accessService.addAccessToProject(usersAndGroups.users, usersAndGroups.groups, projectId, roleId, createdBy);
        await this.eventStore.store(new types_1.ProjectAccessAddedEvent({
            project: projectId,
            createdBy,
            data: {
                roleId,
                groups: usersAndGroups.groups.map(({ id }) => id),
                users: usersAndGroups.users.map(({ id }) => id),
            },
        }));
    }
    async findProjectGroupRole(projectId, roleId) {
        const roles = await this.groupService.getRolesForProject(projectId);
        const role = roles.find((r) => r.roleId === roleId);
        if (!role) {
            throw new notfound_error_1.default(`Couldn't find roleId=${roleId} on project=${projectId}`);
        }
        return role;
    }
    async findProjectRole(projectId, roleId) {
        const roles = await this.accessService.getRolesForProject(projectId);
        const role = roles.find((r) => r.id === roleId);
        if (!role) {
            throw new notfound_error_1.default(`Couldn't find roleId=${roleId} on project=${projectId}`);
        }
        return role;
    }
    async validateAtLeastOneOwner(projectId, currentRole) {
        if (currentRole.name === types_1.RoleName.OWNER) {
            const users = await this.accessService.getProjectUsersForRole(currentRole.id, projectId);
            const groups = await this.groupService.getProjectGroups(projectId);
            const roleGroups = groups.filter((g) => g.roleId == currentRole.id);
            if (users.length + roleGroups.length < 2) {
                throw new project_without_owner_error_1.default();
            }
        }
    }
    async changeRole(projectId, roleId, userId, createdBy) {
        const usersWithRoles = await this.getAccessToProject(projectId);
        const user = usersWithRoles.users.find((u) => u.id === userId);
        if (!user)
            throw new joi_1.ValidationError('Unexpected empty user', [], undefined);
        const currentRole = usersWithRoles.roles.find((r) => r.id === user.roleId);
        if (!currentRole)
            throw new joi_1.ValidationError('Unexpected empty current role', [], undefined);
        if (currentRole.id === roleId) {
            // Nothing to do....
            return;
        }
        await this.validateAtLeastOneOwner(projectId, currentRole);
        await this.accessService.updateUserProjectRole(userId, roleId, projectId);
        const role = await this.findProjectRole(projectId, roleId);
        await this.eventStore.store(new types_1.ProjectUserUpdateRoleEvent({
            project: projectId,
            createdBy,
            preData: {
                userId,
                roleId: currentRole.id,
                roleName: currentRole.name,
                email: user.email,
            },
            data: {
                userId,
                roleId,
                roleName: role.name,
                email: user.email,
            },
        }));
    }
    async changeGroupRole(projectId, roleId, userId, createdBy) {
        const usersWithRoles = await this.getAccessToProject(projectId);
        const user = usersWithRoles.groups.find((u) => u.id === userId);
        if (!user)
            throw new joi_1.ValidationError('Unexpected empty user', [], undefined);
        const currentRole = usersWithRoles.roles.find((r) => r.id === user.roleId);
        if (!currentRole)
            throw new joi_1.ValidationError('Unexpected empty current role', [], undefined);
        if (currentRole.id === roleId) {
            // Nothing to do....
            return;
        }
        await this.validateAtLeastOneOwner(projectId, currentRole);
        await this.accessService.updateGroupProjectRole(userId, roleId, projectId);
        const role = await this.findProjectGroupRole(projectId, roleId);
        await this.eventStore.store(new types_1.ProjectGroupUpdateRoleEvent({
            project: projectId,
            createdBy,
            preData: {
                userId,
                roleId: currentRole.id,
                roleName: currentRole.name,
            },
            data: {
                userId,
                roleId,
                roleName: role.name,
            },
        }));
    }
    async getMembers(projectId) {
        return this.store.getMembersCountByProject(projectId);
    }
    async getProjectUsers(projectId) {
        const [, users, groups] = await this.accessService.getProjectRoleAccess(projectId);
        const actualUsers = users.map((user) => ({
            id: user.id,
            email: user.email,
            username: user.username,
        }));
        const actualGroupUsers = groups
            .flatMap((group) => group.users)
            .map((user) => user.user)
            .map((user) => ({
            id: user.id,
            email: user.email,
            username: user.username,
        }));
        return (0, unique_1.uniqueByKey)([...actualUsers, ...actualGroupUsers], 'id');
    }
    async isProjectUser(userId, projectId) {
        const users = await this.getProjectUsers(projectId);
        return Boolean(users.find((user) => user.id === userId));
    }
    async getProjectsByUser(userId) {
        return this.store.getProjectsByUser(userId);
    }
    async getProjectRoleUsage(roleId) {
        return this.accessService.getProjectRoleUsage(roleId);
    }
    async statusJob() {
        const projects = await this.store.getAll();
        const statusUpdates = await Promise.all(projects.map((project) => this.getStatusUpdates(project.id)));
        await Promise.all(statusUpdates.map((statusUpdate) => {
            return this.projectStatsStore.updateProjectStats(statusUpdate.projectId, statusUpdate.updates);
        }));
    }
    async getStatusUpdates(projectId) {
        const dateMinusThirtyDays = (0, date_fns_1.subDays)(new Date(), 30).toISOString();
        const dateMinusSixtyDays = (0, date_fns_1.subDays)(new Date(), 60).toISOString();
        const [createdCurrentWindow, createdPastWindow, archivedCurrentWindow, archivedPastWindow,] = await Promise.all([
            await this.featureToggleStore.countByDate({
                project: projectId,
                dateAccessor: 'created_at',
                date: dateMinusThirtyDays,
            }),
            await this.featureToggleStore.countByDate({
                project: projectId,
                dateAccessor: 'created_at',
                range: [dateMinusSixtyDays, dateMinusThirtyDays],
            }),
            await this.featureToggleStore.countByDate({
                project: projectId,
                archived: true,
                dateAccessor: 'archived_at',
                date: dateMinusThirtyDays,
            }),
            await this.featureToggleStore.countByDate({
                project: projectId,
                archived: true,
                dateAccessor: 'archived_at',
                range: [dateMinusSixtyDays, dateMinusThirtyDays],
            }),
        ]);
        const [projectActivityCurrentWindow, projectActivityPastWindow] = await Promise.all([
            this.eventStore.queryCount([
                { op: 'where', parameters: { project: projectId } },
                {
                    op: 'beforeDate',
                    parameters: {
                        dateAccessor: 'created_at',
                        date: dateMinusThirtyDays,
                    },
                },
            ]),
            this.eventStore.queryCount([
                { op: 'where', parameters: { project: projectId } },
                {
                    op: 'betweenDate',
                    parameters: {
                        dateAccessor: 'created_at',
                        range: [dateMinusSixtyDays, dateMinusThirtyDays],
                    },
                },
            ]),
        ]);
        const avgTimeToProdCurrentWindow = (0, time_to_production_1.calculateAverageTimeToProd)(await this.projectStatsStore.getTimeToProdDates(projectId));
        const projectMembersAddedCurrentWindow = await this.store.getMembersCountByProjectAfterDate(projectId, dateMinusThirtyDays);
        return {
            projectId,
            updates: {
                avgTimeToProdCurrentWindow,
                createdCurrentWindow,
                createdPastWindow,
                archivedCurrentWindow,
                archivedPastWindow,
                projectActivityCurrentWindow,
                projectActivityPastWindow,
                projectMembersAddedCurrentWindow,
            },
        };
    }
    async getProjectOverview(projectId, archived = false, userId) {
        const [project, environments, features, members, favorite, projectStats,] = await Promise.all([
            this.store.get(projectId),
            this.store.getEnvironmentsForProject(projectId),
            this.featureToggleService.getFeatureOverview({
                projectId,
                archived,
                userId,
            }),
            this.store.getMembersCountByProject(projectId),
            userId
                ? this.favoritesService.isFavoriteProject({
                    project: projectId,
                    userId,
                })
                : Promise.resolve(false),
            this.projectStatsStore.getProjectStats(projectId),
        ]);
        return {
            stats: projectStats,
            name: project.name,
            description: project.description,
            mode: project.mode,
            featureLimit: project.featureLimit,
            defaultStickiness: project.defaultStickiness,
            health: project.health || 0,
            favorite: favorite,
            updatedAt: project.updatedAt,
            createdAt: project.createdAt,
            environments,
            features,
            members,
            version: 1,
        };
    }
}
exports.default = ProjectService;
//# sourceMappingURL=project-service.js.map