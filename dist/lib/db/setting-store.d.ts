import { LogProvider } from '../logger';
import { ISettingStore } from '../types/stores/settings-store';
import { Db } from './db';
export default class SettingStore implements ISettingStore {
    private db;
    private logger;
    constructor(db: Db, getLogger: LogProvider);
    updateRow(name: string, content: any): Promise<void>;
    insertNewRow(name: string, content: any): Promise<number[]>;
    exists(name: string): Promise<boolean>;
    get(name: string): Promise<any>;
    insert(name: string, content: any): Promise<void>;
    delete(name: string): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    getAll(): Promise<any[]>;
}
