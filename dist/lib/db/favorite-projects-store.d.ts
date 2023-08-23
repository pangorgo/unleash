/// <reference types="node" />
import EventEmitter from 'events';
import { LogProvider } from '../logger';
import { IFavoriteProject } from '../types/favorites';
import { IFavoriteProjectKey, IFavoriteProjectsStore } from '../types/stores/favorite-projects';
import { Db } from './db';
export declare class FavoriteProjectsStore implements IFavoriteProjectsStore {
    private logger;
    private eventBus;
    private db;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    addFavoriteProject({ userId, project, }: IFavoriteProjectKey): Promise<IFavoriteProject>;
    delete({ userId, project }: IFavoriteProjectKey): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists({ userId, project }: IFavoriteProjectKey): Promise<boolean>;
    get({ userId, project, }: IFavoriteProjectKey): Promise<IFavoriteProject>;
    getAll(): Promise<IFavoriteProject[]>;
}
