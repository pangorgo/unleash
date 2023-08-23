import { LogProvider } from '../logger';
import User from '../types/user';
import { IUserLookup } from '../types/stores/user-store';
import { IAdminCount } from '../types/stores/account-store';
import { IAccountStore } from '../types';
import { Db } from './db';
export declare class AccountStore implements IAccountStore {
    private db;
    private logger;
    constructor(db: Db, getLogger: LogProvider);
    buildSelectAccount(q: IUserLookup): any;
    activeAccounts(): any;
    hasAccount(idQuery: IUserLookup): Promise<number | undefined>;
    getAll(): Promise<User[]>;
    search(query: string): Promise<User[]>;
    getAllWithId(userIdList: number[]): Promise<User[]>;
    getByQuery(idQuery: IUserLookup): Promise<User>;
    delete(id: number): Promise<void>;
    deleteAll(): Promise<void>;
    count(): Promise<number>;
    destroy(): void;
    exists(id: number): Promise<boolean>;
    get(id: number): Promise<User>;
    getAccountByPersonalAccessToken(secret: string): Promise<User>;
    markSeenAt(secrets: string[]): Promise<void>;
    getAdminCount(): Promise<IAdminCount>;
}
