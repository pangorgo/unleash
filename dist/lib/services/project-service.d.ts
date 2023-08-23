import User, { IUser } from '../types/user';
import { AccessService } from './access-service';
import { FeatureToggle, IProject, IProjectOverview, IProjectWithCount, IUnleashConfig, IUnleashStores, IUserWithRole, IProjectRoleUsage } from '../types';
import { IProjectQuery } from '../types/stores/project-store';
import { IProjectAccessModel, IRoleDescriptor } from '../types/stores/access-store';
import FeatureToggleService from './feature-toggle-service';
import { GroupService } from './group-service';
import { IGroupModelWithProjectRole, IGroupRole } from 'lib/types/group';
import { FavoritesService } from './favorites-service';
export interface AccessWithRoles {
    users: IUserWithRole[];
    roles: IRoleDescriptor[];
    groups: IGroupModelWithProjectRole[];
}
declare type Days = number;
declare type Count = number;
export interface IProjectStats {
    avgTimeToProdCurrentWindow: Days;
    createdCurrentWindow: Count;
    createdPastWindow: Count;
    archivedCurrentWindow: Count;
    archivedPastWindow: Count;
    projectActivityCurrentWindow: Count;
    projectActivityPastWindow: Count;
    projectMembersAddedCurrentWindow: Count;
}
interface ICalculateStatus {
    projectId: string;
    updates: IProjectStats;
}
export default class ProjectService {
    private store;
    private accessService;
    private eventStore;
    private featureToggleStore;
    private featureTypeStore;
    private featureEnvironmentStore;
    private environmentStore;
    private groupService;
    private logger;
    private featureToggleService;
    private tagStore;
    private accountStore;
    private favoritesService;
    private projectStatsStore;
    private flagResolver;
    constructor({ projectStore, eventStore, featureToggleStore, featureTypeStore, environmentStore, featureEnvironmentStore, featureTagStore, accountStore, projectStatsStore, }: Pick<IUnleashStores, 'projectStore' | 'eventStore' | 'featureToggleStore' | 'featureTypeStore' | 'environmentStore' | 'featureEnvironmentStore' | 'featureTagStore' | 'accountStore' | 'projectStatsStore'>, config: IUnleashConfig, accessService: AccessService, featureToggleService: FeatureToggleService, groupService: GroupService, favoriteService: FavoritesService);
    getProjects(query?: IProjectQuery, userId?: number): Promise<IProjectWithCount[]>;
    getProject(id: string): Promise<IProject>;
    createProject(newProject: Pick<IProject, 'id' | 'name' | 'mode' | 'defaultStickiness'>, user: IUser): Promise<IProject>;
    updateProject(updatedProject: IProject, user: User): Promise<void>;
    checkProjectsCompatibility(feature: FeatureToggle, newProjectId: string): Promise<boolean>;
    addEnvironmentToProject(project: string, environment: string): Promise<void>;
    changeProject(newProjectId: string, featureName: string, user: User, currentProjectId: string): Promise<any>;
    deleteProject(id: string, user: User): Promise<void>;
    validateId(id: string): Promise<boolean>;
    validateUniqueId(id: string): Promise<void>;
    getAccessToProject(projectId: string): Promise<AccessWithRoles>;
    addUser(projectId: string, roleId: number, userId: number, createdBy: string): Promise<void>;
    removeUser(projectId: string, roleId: number, userId: number, createdBy: string): Promise<void>;
    addGroup(projectId: string, roleId: number, groupId: number, modifiedBy: string): Promise<void>;
    removeGroup(projectId: string, roleId: number, groupId: number, modifiedBy: string): Promise<void>;
    addAccess(projectId: string, roleId: number, usersAndGroups: IProjectAccessModel, createdBy: string): Promise<void>;
    findProjectGroupRole(projectId: string, roleId: number): Promise<IGroupRole>;
    findProjectRole(projectId: string, roleId: number): Promise<IRoleDescriptor>;
    validateAtLeastOneOwner(projectId: string, currentRole: IRoleDescriptor): Promise<void>;
    changeRole(projectId: string, roleId: number, userId: number, createdBy: string): Promise<void>;
    changeGroupRole(projectId: string, roleId: number, userId: number, createdBy: string): Promise<void>;
    getMembers(projectId: string): Promise<number>;
    getProjectUsers(projectId: string): Promise<Array<Pick<IUser, 'id' | 'email' | 'username'>>>;
    isProjectUser(userId: number, projectId: string): Promise<boolean>;
    getProjectsByUser(userId: number): Promise<string[]>;
    getProjectRoleUsage(roleId: number): Promise<IProjectRoleUsage[]>;
    statusJob(): Promise<void>;
    getStatusUpdates(projectId: string): Promise<ICalculateStatus>;
    getProjectOverview(projectId: string, archived?: boolean, userId?: number): Promise<IProjectOverview>;
}
export {};
