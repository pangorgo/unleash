/// <reference types="node" />
import { EventEmitter } from 'events';
import { LogProvider } from '../logger';
import { IApiTokenStore } from '../types/stores/api-token-store';
import { IApiToken, IApiTokenCreate } from '../types/models/api-token';
import { Db } from './db';
export declare class ApiTokenStore implements IApiTokenStore {
    private logger;
    private timer;
    private db;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    count(): Promise<number>;
    getAll(): Promise<IApiToken[]>;
    getAllActive(): Promise<IApiToken[]>;
    private makeTokenProjectQuery;
    insert(newToken: IApiTokenCreate): Promise<IApiToken>;
    destroy(): void;
    exists(secret: string): Promise<boolean>;
    get(key: string): Promise<IApiToken>;
    delete(secret: string): Promise<void>;
    deleteAll(): Promise<void>;
    setExpiry(secret: string, expiresAt: Date): Promise<IApiToken>;
    markSeenAt(secrets: string[]): Promise<void>;
}
