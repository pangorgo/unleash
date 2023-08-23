/// <reference types="node" />
import EventEmitter from 'events';
import { LogProvider } from '../logger';
import { ICustomRole } from 'lib/types/model';
import { ICustomRoleInsert, ICustomRoleUpdate, IRoleStore } from 'lib/types/stores/role-store';
import { IRole, IUserRole } from 'lib/types/stores/access-store';
import { Db } from './db';
import { RoleSchema } from 'lib/openapi';
interface IRoleRow {
    id: number;
    name: string;
    description: string;
    type: string;
}
export default class RoleStore implements IRoleStore {
    private logger;
    private eventBus;
    private db;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    getAll(): Promise<ICustomRole[]>;
    count(): Promise<number>;
    filteredCount(filter: Partial<RoleSchema>): Promise<number>;
    filteredCountInUse(filter: Partial<RoleSchema>): Promise<number>;
    create(role: ICustomRoleInsert): Promise<ICustomRole>;
    delete(id: number): Promise<void>;
    get(id: number): Promise<ICustomRole>;
    update(role: ICustomRoleUpdate): Promise<ICustomRole>;
    exists(id: number): Promise<boolean>;
    nameInUse(name: string, existingId?: number): Promise<boolean>;
    deleteAll(): Promise<void>;
    mapRow(row: IRoleRow): ICustomRole;
    getRoles(): Promise<IRole[]>;
    getRoleWithId(id: number): Promise<IRole>;
    getProjectRoles(): Promise<IRole[]>;
    getRolesForProject(projectId: string): Promise<IRole[]>;
    getRootRoles(): Promise<IRole[]>;
    removeRolesForProject(projectId: string): Promise<void>;
    getRootRoleForAllUsers(): Promise<IUserRole[]>;
    getRoleByName(name: string): Promise<IRole>;
    destroy(): void;
}
export {};
