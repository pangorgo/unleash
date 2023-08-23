import { IFeatureToggleQuery, IFeatureToggleStore } from '../../lib/types/stores/feature-toggle-store';
import { FeatureToggle, FeatureToggleDTO, IFeatureEnvironment, IVariant } from 'lib/types/model';
import { LastSeenInput } from '../../lib/services/client-metrics/last-seen-service';
export default class FakeFeatureToggleStore implements IFeatureToggleStore {
    features: FeatureToggle[];
    archive(featureName: string): Promise<FeatureToggle>;
    batchArchive(featureNames: string[]): Promise<FeatureToggle[]>;
    batchStale(featureNames: string[], stale: boolean): Promise<FeatureToggle[]>;
    batchDelete(featureNames: string[]): Promise<void>;
    batchRevive(featureNames: string[]): Promise<FeatureToggle[]>;
    count(query: Partial<IFeatureToggleQuery>): Promise<number>;
    getAllByNames(names: string[]): Promise<FeatureToggle[]>;
    getProjectId(name: string): Promise<string>;
    private getFilterQuery;
    create(project: string, data: FeatureToggle): Promise<FeatureToggle>;
    delete(key: string): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists(key: string): Promise<boolean>;
    get(key: string): Promise<FeatureToggle>;
    getAll(): Promise<FeatureToggle[]>;
    getFeatureMetadata(name: string): Promise<FeatureToggle>;
    getBy(query: Partial<IFeatureToggleQuery>): Promise<FeatureToggle[]>;
    revive(featureName: string): Promise<FeatureToggle>;
    update(project: string, data: FeatureToggleDTO): Promise<FeatureToggle>;
    setLastSeen(data: LastSeenInput[]): Promise<void>;
    getVariants(featureName: string): Promise<IVariant[]>;
    getAllVariants(): Promise<IFeatureEnvironment[]>;
    getVariantsForEnv(featureName: string, environment_name: string): Promise<IVariant[]>;
    saveVariants(project: string, featureName: string, newVariants: IVariant[]): Promise<FeatureToggle>;
    saveVariantsOnEnv(featureName: string, environment: string, newVariants: IVariant[]): Promise<IVariant[]>;
    countByDate(queryModifiers: {
        archived?: boolean;
        project?: string;
        date?: string;
        range?: string[];
        dateAccessor: string;
    }): Promise<number>;
    dropAllVariants(): Promise<void>;
    updatePotentiallyStaleFeatures(): Promise<{
        name: string;
        potentiallyStale: boolean;
        project: string;
    }[]>;
    isPotentiallyStale(): Promise<boolean>;
}
