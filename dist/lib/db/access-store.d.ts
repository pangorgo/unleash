/// <reference types="node" />
import { EventEmitter } from 'events';
import { IAccessInfo, IAccessStore, IProjectRoleUsage, IRole, IRoleWithProject, IUserPermission, IUserRole } from '../types/stores/access-store';
import { IPermission } from '../types/model';
import { Db } from './db';
interface IPermissionRow {
    id: number;
    permission: string;
    display_name: string;
    environment?: string;
    type: string;
    project?: string;
    role_id: number;
}
export declare class AccessStore implements IAccessStore {
    private logger;
    private timer;
    private db;
    constructor(db: Db, eventBus: EventEmitter, getLogger: Function);
    delete(key: number): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists(key: number): Promise<boolean>;
    get(key: number): Promise<IRole>;
    getAll(): Promise<IRole[]>;
    getAvailablePermissions(): Promise<IPermission[]>;
    mapPermission(permission: IPermissionRow): IPermission;
    getPermissionsForUser(userId: number): Promise<IUserPermission[]>;
    mapUserPermission(row: IPermissionRow): IUserPermission;
    getPermissionsForRole(roleId: number): Promise<IPermission[]>;
    addEnvironmentPermissionsToRole(role_id: number, permissions: IPermission[]): Promise<void>;
    unlinkUserRoles(userId: number): Promise<void>;
    unlinkUserGroups(userId: number): Promise<void>;
    clearUserPersonalAccessTokens(userId: number): Promise<void>;
    clearPublicSignupUserTokens(userId: number): Promise<void>;
    getProjectUsersForRole(roleId: number, projectId?: string): Promise<IUserRole[]>;
    getRolesForUserId(userId: number): Promise<IRoleWithProject[]>;
    getUserIdsForRole(roleId: number): Promise<number[]>;
    getGroupIdsForRole(roleId: number): Promise<number[]>;
    getProjectUserAndGroupCountsForRole(roleId: number): Promise<IProjectRoleUsage[]>;
    addUserToRole(userId: number, roleId: number, projectId?: string): Promise<void>;
    removeUserFromRole(userId: number, roleId: number, projectId?: string): Promise<void>;
    addGroupToRole(groupId: number, roleId: number, createdBy: string, projectId?: string): Promise<void>;
    removeGroupFromRole(groupId: number, roleId: number, projectId?: string): Promise<void>;
    updateUserProjectRole(userId: number, roleId: number, projectId: string): Promise<void>;
    updateGroupProjectRole(groupId: number, roleId: number, projectId: string): Promise<void>;
    addAccessToProject(users: IAccessInfo[], groups: IAccessInfo[], projectId: string, roleId: number, createdBy: string): Promise<void>;
    removeRolesOfTypeForUser(userId: number, roleTypes: string[]): Promise<void>;
    addPermissionsToRole(role_id: number, permissions: string[], environment?: string): Promise<void>;
    removePermissionFromRole(role_id: number, permission: string, environment?: string): Promise<void>;
    wipePermissionsFromRole(role_id: number): Promise<void>;
    cloneEnvironmentPermissions(sourceEnvironment: string, destinationEnvironment: string): Promise<void>;
}
export {};
