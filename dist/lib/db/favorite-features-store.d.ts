/// <reference types="node" />
import EventEmitter from 'events';
import { IFavoriteFeaturesStore } from '../types';
import { LogProvider } from '../logger';
import { IFavoriteFeatureKey } from '../types/stores/favorite-features';
import { IFavoriteFeature } from '../types/favorites';
import { Db } from './db';
export declare class FavoriteFeaturesStore implements IFavoriteFeaturesStore {
    private logger;
    private eventBus;
    private db;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    addFavoriteFeature({ userId, feature, }: IFavoriteFeatureKey): Promise<IFavoriteFeature>;
    delete({ userId, feature }: IFavoriteFeatureKey): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists({ userId, feature }: IFavoriteFeatureKey): Promise<boolean>;
    get({ userId, feature, }: IFavoriteFeatureKey): Promise<IFavoriteFeature>;
    getAll(): Promise<IFavoriteFeature[]>;
}
