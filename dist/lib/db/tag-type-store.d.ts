/// <reference types="node" />
import { EventEmitter } from 'events';
import { LogProvider } from '../logger';
import { ITagType, ITagTypeStore } from '../types/stores/tag-type-store';
import { Db } from './db';
interface ITagTypeTable {
    name: string;
    description?: string;
    icon?: string;
}
export default class TagTypeStore implements ITagTypeStore {
    private db;
    private logger;
    private readonly timer;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    getAll(): Promise<ITagType[]>;
    get(name: string): Promise<ITagType>;
    exists(name: string): Promise<boolean>;
    createTagType(newTagType: ITagType): Promise<void>;
    delete(name: string): Promise<void>;
    deleteAll(): Promise<void>;
    bulkImport(tagTypes: ITagType[]): Promise<ITagType[]>;
    updateTagType({ name, description, icon }: ITagType): Promise<void>;
    destroy(): void;
    rowToTagType(row: ITagTypeTable): ITagType;
}
export {};
