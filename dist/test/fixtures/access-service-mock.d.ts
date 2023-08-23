import { AccessService } from '../../lib/services/access-service';
import User from '../../lib/types/user';
import { IRole } from '../../lib/types/stores/access-store';
import { IAvailablePermissions, IUserWithRole } from '../../lib/types/model';
import { IGroupModelWithProjectRole } from '../../lib/types/group';
declare class AccessServiceMock extends AccessService {
    constructor();
    hasPermission(user: User, permission: string, projectId?: string): Promise<boolean>;
    getPermissions(): Promise<IAvailablePermissions>;
    addUserToRole(userId: number, roleId: number): Promise<void>;
    setUserRootRole(userId: number, roleId: number): Promise<void>;
    addPermissionToRole(roleId: number, permission: string, projectId?: string): Promise<void>;
    removePermissionFromRole(roleId: number, permission: string, projectId?: string): Promise<void>;
    getRoles(): Promise<IRole[]>;
    getRolesForProject(projectId: string): Promise<IRole[]>;
    getRolesForUser(userId: number): Promise<IRole[]>;
    getUsersForRole(roleId: any): Promise<User[]>;
    getProjectRoleAccess(projectId: string): Promise<[IRole[], IUserWithRole[], IGroupModelWithProjectRole[]]>;
    createDefaultProjectRoles(owner: User, projectId: string): Promise<void>;
    removeDefaultProjectRoles(owner: User, projectId: string): Promise<void>;
}
export default AccessServiceMock;
