/// <reference types="node" />
import EventEmitter from 'events';
import { LogProvider } from '../logger';
import { IAddon, IAddonDto, IAddonStore } from '../types/stores/addon-store';
import { Db } from './db';
export default class AddonStore implements IAddonStore {
    private db;
    private logger;
    private readonly timer;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    destroy(): void;
    getAll(query?: {}): Promise<IAddon[]>;
    get(id: number): Promise<IAddon>;
    insert(addon: IAddonDto): Promise<IAddon>;
    update(id: number, addon: IAddonDto): Promise<IAddon>;
    delete(id: number): Promise<void>;
    deleteAll(): Promise<void>;
    exists(id: number): Promise<boolean>;
    rowToAddon(row: any): IAddon;
    addonToRow(addon: IAddonDto): {
        provider: string;
        enabled: boolean;
        description: string;
        parameters: string;
        events: string;
        projects: string;
        environments: string;
    };
}
