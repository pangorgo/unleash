import { IGroupStore, IStoreGroup } from '../types/stores/group-store';
import Group, { ICreateGroupModel, ICreateGroupUserModel, IGroup, IGroupProject, IGroupRole, IGroupUser } from '../types/group';
import { Db } from './db';
export default class GroupStore implements IGroupStore {
    private db;
    constructor(db: Db);
    getAllWithId(ids: number[]): Promise<Group[]>;
    update(group: ICreateGroupModel): Promise<IGroup>;
    getProjectGroupRoles(projectId: string): Promise<IGroupRole[]>;
    getGroupProjects(groupIds: number[]): Promise<IGroupProject[]>;
    getAllUsersByGroups(groupIds: number[]): Promise<IGroupUser[]>;
    getAll(): Promise<Group[]>;
    delete(id: number): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists(id: number): Promise<boolean>;
    existsWithName(name: string): Promise<boolean>;
    get(id: number): Promise<Group>;
    create(group: IStoreGroup): Promise<Group>;
    count(): Promise<number>;
    addUsersToGroup(groupId: number, users: ICreateGroupUserModel[], userName: string): Promise<void>;
    deleteUsersFromGroup(deletableUsers: IGroupUser[]): Promise<void>;
    updateGroupUsers(groupId: number, newUsers: ICreateGroupUserModel[], deletableUsers: IGroupUser[], userName: string): Promise<void>;
    getNewGroupsForExternalUser(userId: number, externalGroups: string[]): Promise<IGroup[]>;
    addUserToGroups(userId: number, groupIds: number[], createdBy?: string): Promise<void>;
    getOldGroupsForExternalUser(userId: number, externalGroups: string[]): Promise<IGroupUser[]>;
    getGroupsForUser(userId: number): Promise<Group[]>;
    hasProjectRole(groupId: number): Promise<boolean>;
}
