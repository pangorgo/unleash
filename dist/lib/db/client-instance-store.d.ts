/// <reference types="node" />
import EventEmitter from 'events';
import { LogProvider } from '../logger';
import { IClientInstance, IClientInstanceStore, INewClientInstance } from '../types/stores/client-instance-store';
import { Db } from './db';
export default class ClientInstanceStore implements IClientInstanceStore {
    private db;
    private logger;
    private eventBus;
    private metricTimer;
    private timer;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    removeInstancesOlderThanTwoDays(): Promise<void>;
    setLastSeen({ appName, instanceId, environment, clientIp, }: INewClientInstance): Promise<void>;
    bulkUpsert(instances: INewClientInstance[]): Promise<void>;
    delete({ appName, instanceId, }: Pick<INewClientInstance, 'appName' | 'instanceId'>): Promise<void>;
    deleteAll(): Promise<void>;
    get({ appName, instanceId, }: Pick<INewClientInstance, 'appName' | 'instanceId'>): Promise<IClientInstance>;
    exists({ appName, instanceId, }: Pick<INewClientInstance, 'appName' | 'instanceId'>): Promise<boolean>;
    insert(details: INewClientInstance): Promise<void>;
    getAll(): Promise<IClientInstance[]>;
    getByAppName(appName: string): Promise<IClientInstance[]>;
    getDistinctApplications(): Promise<string[]>;
    getDistinctApplicationsCount(daysBefore?: number): Promise<number>;
    deleteForApplication(appName: string): Promise<void>;
    destroy(): void;
}
