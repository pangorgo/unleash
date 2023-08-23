import { IDBOption } from '../types';
import { Logger } from '../logger';
export declare const defaultLockKey = 479341;
export declare const defaultTimeout = 5000;
interface IDbLockOptions {
    timeout: number;
    lockKey: number;
    logger: Logger;
}
export declare const withDbLock: (dbConfig: IDBOption, config?: IDbLockOptions) => <A extends any[], R>(fn: (...args: A) => Promise<R>) => (...args: A) => Promise<R>;
export {};
