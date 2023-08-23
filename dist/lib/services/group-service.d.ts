import { ICreateGroupModel, IGroup, IGroupModel, IGroupModelWithProjectRole, IGroupProject, IGroupRole } from '../types/group';
import { IUnleashConfig, IUnleashStores } from '../types';
export declare class GroupService {
    private groupStore;
    private eventStore;
    private accountStore;
    private logger;
    constructor(stores: Pick<IUnleashStores, 'groupStore' | 'eventStore' | 'accountStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    getAll(): Promise<IGroupModel[]>;
    mapGroupWithProjects(groupProjects: IGroupProject[], group: IGroupModel): IGroupModel;
    getGroup(id: number): Promise<IGroupModel>;
    createGroup(group: ICreateGroupModel, userName: string): Promise<IGroup>;
    updateGroup(group: ICreateGroupModel, userName: string): Promise<IGroup>;
    getProjectGroups(projectId?: string): Promise<IGroupModelWithProjectRole[]>;
    deleteGroup(id: number): Promise<void>;
    validateGroup(group: ICreateGroupModel, existingGroup?: IGroup): Promise<void>;
    getRolesForProject(projectId: string): Promise<IGroupRole[]>;
    private mapGroupWithUsers;
    syncExternalGroups(userId: number, externalGroups: string[], createdBy?: string): Promise<void>;
    getGroupsForUser(userId: number): Promise<IGroup[]>;
}
