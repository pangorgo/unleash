import { LogProvider } from '../logger';
import { IFeatureType, IFeatureTypeStore } from '../types/stores/feature-type-store';
import { Db } from './db';
declare class FeatureTypeStore implements IFeatureTypeStore {
    private db;
    private logger;
    constructor(db: Db, getLogger: LogProvider);
    getAll(): Promise<IFeatureType[]>;
    private rowToFeatureType;
    get(id: string): Promise<IFeatureType>;
    getByName(name: string): Promise<IFeatureType>;
    delete(key: string): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists(key: string): Promise<boolean>;
    updateLifetime(id: string, newLifetimeDays: number | null): Promise<IFeatureType | undefined>;
}
export default FeatureTypeStore;
