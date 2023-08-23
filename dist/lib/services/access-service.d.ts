import User, { IProjectUser, IUser } from '../types/user';
import { IAccessInfo, IProjectRoleUsage, IRole, IRoleWithPermissions, IRoleWithProject, IUserPermission, IUserRole } from '../types/stores/access-store';
import { IUnleashStores } from '../types/stores';
import { IAvailablePermissions, ICustomRole, IPermission, IRoleData, IUserWithRole, RoleName } from '../types/model';
import { IGroup, IGroupModelWithProjectRole } from '../types/group';
import { GroupService } from './group-service';
import { IUnleashConfig } from 'lib/types';
interface IRoleCreation {
    name: string;
    description: string;
    type?: 'root-custom' | 'custom';
    permissions?: IPermission[];
}
export interface IRoleValidation {
    name: string;
    description?: string;
    permissions?: Pick<IPermission, 'id' | 'environment'>[];
}
interface IRoleUpdate {
    id: number;
    name: string;
    description: string;
    type?: 'root-custom' | 'custom';
    permissions?: IPermission[];
}
export declare class AccessService {
    private store;
    private accountStore;
    private roleStore;
    private groupService;
    private groupStore;
    private environmentStore;
    private logger;
    private flagResolver;
    constructor({ accessStore, accountStore, roleStore, environmentStore, groupStore, }: Pick<IUnleashStores, 'accessStore' | 'accountStore' | 'roleStore' | 'environmentStore' | 'groupStore'>, { getLogger, flagResolver, }: Pick<IUnleashConfig, 'getLogger' | 'flagResolver'>, groupService: GroupService);
    /**
     * Used to check if a user has access to the requested resource
     *
     * @param user
     * @param permission
     * @param projectId
     */
    hasPermission(user: Pick<IUser, 'id' | 'permissions' | 'isAPI'>, permission: string | string[], projectId?: string, environment?: string): Promise<boolean>;
    getPermissionsForUser(user: Pick<IUser, 'id' | 'isAPI' | 'permissions'>): Promise<IUserPermission[]>;
    getPermissions(): Promise<IAvailablePermissions>;
    addUserToRole(userId: number, roleId: number, projectId: string): Promise<void>;
    addGroupToRole(groupId: number, roleId: number, createdBy: string, projectId: string): Promise<void>;
    addAccessToProject(users: IAccessInfo[], groups: IAccessInfo[], projectId: string, roleId: number, createdBy: string): Promise<void>;
    getRoleByName(roleName: string): Promise<IRole>;
    setUserRootRole(userId: number, role: number | RoleName): Promise<void>;
    getUserRootRoles(userId: number): Promise<IRoleWithProject[]>;
    removeUserFromRole(userId: number, roleId: number, projectId: string): Promise<void>;
    removeGroupFromRole(groupId: number, roleId: number, projectId: string): Promise<void>;
    updateUserProjectRole(userId: number, roleId: number, projectId: string): Promise<void>;
    updateGroupProjectRole(userId: number, roleId: number, projectId: string): Promise<void>;
    addPermissionToRole(roleId: number, permission: string, environment?: string): Promise<void>;
    removePermissionFromRole(roleId: number, permission: string, environment?: string): Promise<void>;
    getRoles(): Promise<IRole[]>;
    getRole(id: number): Promise<IRoleWithPermissions>;
    getRoleData(roleId: number): Promise<IRoleData>;
    getProjectRoles(): Promise<IRole[]>;
    getRolesForProject(projectId: string): Promise<IRole[]>;
    getRolesForUser(userId: number): Promise<IRole[]>;
    wipeUserPermissions(userId: number): Promise<void[]>;
    getUsersForRole(roleId: number): Promise<IUser[]>;
    getGroupsForRole(roleId: number): Promise<IGroup[]>;
    getProjectUsersForRole(roleId: number, projectId?: string): Promise<IProjectUser[]>;
    getProjectRoleAccess(projectId: string): Promise<[IRole[], IUserWithRole[], IGroupModelWithProjectRole[]]>;
    getProjectRoleUsage(roleId: number): Promise<IProjectRoleUsage[]>;
    createDefaultProjectRoles(owner: IUser, projectId: string): Promise<void>;
    removeDefaultProjectRoles(owner: User, projectId: string): Promise<void>;
    getRootRoleForAllUsers(): Promise<IUserRole[]>;
    getRootRoles(): Promise<IRole[]>;
    resolveRootRole(rootRole: number | RoleName): Promise<IRole | undefined>;
    getRootRole(roleName: RoleName): Promise<IRole | undefined>;
    getAllRoles(): Promise<ICustomRole[]>;
    createRole(role: IRoleCreation): Promise<ICustomRole>;
    updateRole(role: IRoleUpdate): Promise<ICustomRole>;
    deleteRole(id: number): Promise<void>;
    validateRoleIsUnique(roleName: string, existingId?: number): Promise<void>;
    validateRoleIsNotBuiltIn(roleId: number): Promise<void>;
    validateRole(role: IRoleValidation, existingId?: number): Promise<IRoleCreation>;
}
export {};
