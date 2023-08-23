/// <reference types="node" />
import EventEmitter from 'events';
import { IClientApplication, IClientApplicationsStore } from '../types/stores/client-applications-store';
import { LogProvider } from '../logger';
import { IApplicationQuery } from '../types/query';
import { Db } from './db';
export default class ClientApplicationsStore implements IClientApplicationsStore {
    private db;
    private logger;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    upsert(details: Partial<IClientApplication>): Promise<void>;
    bulkUpsert(apps: Partial<IClientApplication>[]): Promise<void>;
    exists(appName: string): Promise<boolean>;
    getAll(): Promise<IClientApplication[]>;
    getApplication(appName: string): Promise<IClientApplication>;
    deleteApplication(appName: string): Promise<void>;
    /**
     * Could also be done in SQL:
     * (not sure if it is faster though)
     *
     * SELECT app_name from (
     *   SELECT app_name, json_array_elements(strategies)::text as strategyName from client_strategies
     *   ) as foo
     * WHERE foo.strategyName = '"other"';
     */
    getAppsForStrategy(query: IApplicationQuery): Promise<IClientApplication[]>;
    getUnannounced(): Promise<IClientApplication[]>;
    /** *
     * Updates all rows that have announced = false to announced =true and returns the rows altered
     * @return {[app]} - Apps that hadn't been announced
     */
    setUnannouncedToAnnounced(): Promise<IClientApplication[]>;
    delete(key: string): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    get(appName: string): Promise<IClientApplication>;
}
