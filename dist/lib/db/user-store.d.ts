import { LogProvider } from '../logger';
import User from '../types/user';
import { ICreateUser, IUserLookup, IUserStore, IUserUpdateFields } from '../types/stores/user-store';
import { Db } from './db';
declare class UserStore implements IUserStore {
    private db;
    private logger;
    constructor(db: Db, getLogger: LogProvider);
    update(id: number, fields: IUserUpdateFields): Promise<User>;
    insert(user: ICreateUser): Promise<User>;
    upsert(user: ICreateUser): Promise<User>;
    buildSelectUser(q: IUserLookup): any;
    activeAll(): any;
    activeUsers(): any;
    hasUser(idQuery: IUserLookup): Promise<number | undefined>;
    getAll(): Promise<User[]>;
    search(query: string): Promise<User[]>;
    getAllWithId(userIdList: number[]): Promise<User[]>;
    getByQuery(idQuery: IUserLookup): Promise<User>;
    delete(id: number): Promise<void>;
    getPasswordHash(userId: number): Promise<string>;
    setPasswordHash(userId: number, passwordHash: string): Promise<void>;
    incLoginAttempts(user: User): Promise<void>;
    successfullyLogin(user: User): Promise<void>;
    deleteAll(): Promise<void>;
    count(): Promise<number>;
    destroy(): void;
    exists(id: number): Promise<boolean>;
    get(id: number): Promise<User>;
}
export default UserStore;