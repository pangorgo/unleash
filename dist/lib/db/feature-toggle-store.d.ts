/// <reference types="node" />
import { Knex } from 'knex';
import EventEmitter from 'events';
import { LogProvider } from '../logger';
import { FeatureToggle, FeatureToggleDTO, IVariant } from '../types/model';
import { IFeatureToggleStore } from '../types/stores/feature-toggle-store';
import { Db } from './db';
import { LastSeenInput } from '../services/client-metrics/last-seen-service';
export declare type EnvironmentFeatureNames = {
    [key: string]: string[];
};
export interface FeaturesTable {
    name: string;
    description: string;
    type: string;
    stale: boolean;
    project: string;
    last_seen_at?: Date;
    created_at?: Date;
    impression_data: boolean;
    archived?: boolean;
    archived_at?: Date;
}
interface VariantDTO {
    variants: IVariant[];
}
export default class FeatureToggleStore implements IFeatureToggleStore {
    private db;
    private logger;
    private timer;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    count(query?: {
        archived?: boolean;
        project?: string;
        stale?: boolean;
    }): Promise<number>;
    deleteAll(): Promise<void>;
    destroy(): void;
    get(name: string): Promise<FeatureToggle>;
    getAll(query?: {
        archived?: boolean;
        project?: string;
        stale?: boolean;
    }): Promise<FeatureToggle[]>;
    getAllByNames(names: string[]): Promise<FeatureToggle[]>;
    countByDate(queryModifiers: {
        archived?: boolean;
        project?: string;
        date?: string;
        range?: string[];
        dateAccessor: string;
    }): Promise<number>;
    /**
     * Get projectId from feature filtered by name. Used by Rbac middleware
     * @deprecated
     * @param name
     */
    getProjectId(name: string): Promise<string>;
    exists(name: string): Promise<boolean>;
    setLastSeen(data: LastSeenInput[]): Promise<void>;
    private mapMetricDataToEnvBuckets;
    static filterByArchived: Knex.QueryCallbackWithArgs;
    rowToFeature(row: FeaturesTable): FeatureToggle;
    rowToEnvVariants(variantRows: VariantDTO[]): IVariant[];
    dtoToRow(project: string, data: FeatureToggleDTO): FeaturesTable;
    create(project: string, data: FeatureToggleDTO): Promise<FeatureToggle>;
    update(project: string, data: FeatureToggleDTO): Promise<FeatureToggle>;
    archive(name: string): Promise<FeatureToggle>;
    batchArchive(names: string[]): Promise<FeatureToggle[]>;
    batchStale(names: string[], stale: boolean): Promise<FeatureToggle[]>;
    delete(name: string): Promise<void>;
    batchDelete(names: string[]): Promise<void>;
    revive(name: string): Promise<FeatureToggle>;
    batchRevive(names: string[]): Promise<FeatureToggle[]>;
    getVariants(featureName: string): Promise<IVariant[]>;
    getVariantsForEnv(featureName: string, environment: string): Promise<IVariant[]>;
    saveVariants(project: string, featureName: string, newVariants: IVariant[]): Promise<FeatureToggle>;
    updatePotentiallyStaleFeatures(currentTime?: string): Promise<{
        name: string;
        potentiallyStale: boolean;
        project: string;
    }[]>;
    isPotentiallyStale(featureName: string): Promise<boolean>;
}
export {};
