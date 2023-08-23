import { IUser } from '../../lib/types/user';
import { IUserLookup, IAccountStore, IAdminCount } from '../../lib/types/stores/account-store';
export declare class FakeAccountStore implements IAccountStore {
    data: IUser[];
    idSeq: number;
    constructor();
    hasAccount({ id, username, email, }: IUserLookup): Promise<number | undefined>;
    destroy(): void;
    exists(key: number): Promise<boolean>;
    count(): Promise<number>;
    get(key: number): Promise<IUser>;
    getByQuery({ id, username, email }: IUserLookup): Promise<IUser>;
    getAll(): Promise<IUser[]>;
    delete(id: number): Promise<void>;
    buildSelectUser(): any;
    search(): Promise<IUser[]>;
    getAllWithId(): Promise<IUser[]>;
    deleteAll(): Promise<void>;
    getAccountByPersonalAccessToken(secret: string): Promise<IUser>;
    markSeenAt(secrets: string[]): Promise<void>;
    getAdminCount(): Promise<IAdminCount>;
}
