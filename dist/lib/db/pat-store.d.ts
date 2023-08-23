import { LogProvider } from '../logger';
import { IPatStore } from '../types/stores/pat-store';
import Pat, { IPat } from '../types/models/pat';
import { Db } from './db';
export default class PatStore implements IPatStore {
    private db;
    private logger;
    constructor(db: Db, getLogger: LogProvider);
    create(token: IPat): Promise<IPat>;
    delete(id: number): Promise<void>;
    deleteForUser(id: number, userId: number): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists(id: number): Promise<boolean>;
    existsWithDescriptionByUser(description: string, userId: number): Promise<boolean>;
    countByUser(userId: number): Promise<number>;
    get(id: number): Promise<Pat>;
    getAll(): Promise<Pat[]>;
    getAllByUser(userId: number): Promise<Pat[]>;
}
