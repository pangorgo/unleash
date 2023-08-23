/// <reference types="node" />
import EventEmitter from 'events';
import { Db } from './db';
import { LogProvider } from '../logger';
import { IEnvironment, IEnvironmentCreate, IProjectEnvironment } from '../types/model';
import { IEnvironmentStore } from '../types/stores/environment-store';
export default class EnvironmentStore implements IEnvironmentStore {
    private logger;
    private db;
    private timer;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    importEnvironments(environments: IEnvironment[]): Promise<IEnvironment[]>;
    deleteAll(): Promise<void>;
    count(): Promise<number>;
    getMaxSortOrder(): Promise<number>;
    get(key: string): Promise<IEnvironment>;
    getAll(query?: Object): Promise<IEnvironment[]>;
    getAllWithCounts(query?: Object): Promise<IEnvironment[]>;
    getProjectEnvironments(projectId: string, query?: Object): Promise<IProjectEnvironment[]>;
    exists(name: string): Promise<boolean>;
    getByName(name: string): Promise<IEnvironment>;
    updateProperty(id: string, field: string, value: string | number): Promise<void>;
    updateSortOrder(id: string, value: number): Promise<void>;
    update(env: Pick<IEnvironment, 'type' | 'protected'>, name: string): Promise<IEnvironment>;
    create(env: IEnvironmentCreate): Promise<IEnvironment>;
    disable(environments: IEnvironment[]): Promise<void>;
    enable(environments: IEnvironment[]): Promise<void>;
    delete(name: string): Promise<void>;
    destroy(): void;
}
