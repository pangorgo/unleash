/// <reference types="node" />
import { EventEmitter } from 'events';
import { LogProvider } from '../logger';
import { IResetQuery, IResetToken, IResetTokenCreate, IResetTokenQuery, IResetTokenStore } from '../types/stores/reset-token-store';
import { Db } from './db';
export declare class ResetTokenStore implements IResetTokenStore {
    private logger;
    private timer;
    private db;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    getActive(token: string): Promise<IResetToken>;
    getActiveTokens(): Promise<IResetToken[]>;
    insert(newToken: IResetTokenCreate): Promise<IResetToken>;
    useToken(token: IResetQuery): Promise<boolean>;
    deleteFromQuery({ reset_token }: IResetTokenQuery): Promise<void>;
    deleteAll(): Promise<void>;
    deleteExpired(): Promise<void>;
    expireExistingTokensForUser(user_id: number): Promise<void>;
    delete(reset_token: string): Promise<void>;
    destroy(): void;
    exists(reset_token: string): Promise<boolean>;
    get(key: string): Promise<IResetToken>;
    getAll(): Promise<IResetToken[]>;
}
