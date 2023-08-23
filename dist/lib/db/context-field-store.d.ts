import { Db } from './db';
import { LogProvider } from '../logger';
import { IContextField, IContextFieldDto, IContextFieldStore } from '../types/stores/context-field-store';
import { IFlagResolver } from '../types';
interface ICreateContextField {
    name: string;
    description: string;
    stickiness: boolean;
    sort_order: number;
    legal_values?: string;
    updated_at: Date;
}
declare class ContextFieldStore implements IContextFieldStore {
    private db;
    private logger;
    private flagResolver;
    constructor(db: Db, getLogger: LogProvider, flagResolver: IFlagResolver);
    prefixColumns(columns?: string[]): string[];
    fieldToRow(data: IContextFieldDto): Omit<ICreateContextField, 'updated_at'>;
    getAll(): Promise<IContextField[]>;
    get(key: string): Promise<IContextField>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists(key: string): Promise<boolean>;
    create(contextField: IContextFieldDto): Promise<IContextField>;
    update(data: IContextFieldDto): Promise<IContextField>;
    delete(name: string): Promise<void>;
    count(): Promise<number>;
}
export default ContextFieldStore;
