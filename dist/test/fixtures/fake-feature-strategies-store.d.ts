import { FeatureToggleWithEnvironment, IFeatureOverview, IFeatureToggleClient, IFeatureToggleQuery, IFeatureStrategy, FeatureToggle } from '../../lib/types/model';
import { IFeatureStrategiesStore } from '../../lib/types/stores/feature-strategies-store';
import { IFeatureProjectUserParams } from '../../lib/routes/admin-api/project/project-features';
interface ProjectEnvironment {
    projectName: string;
    environment: string;
}
export default class FakeFeatureStrategiesStore implements IFeatureStrategiesStore {
    environmentAndFeature: Map<string, any[]>;
    projectToEnvironment: ProjectEnvironment[];
    featureStrategies: IFeatureStrategy[];
    featureToggles: FeatureToggle[];
    createStrategyFeatureEnv(strategyConfig: Omit<IFeatureStrategy, 'id' | 'createdAt'>): Promise<IFeatureStrategy>;
    getStrategiesByContextField(contextFieldName: string): Promise<IFeatureStrategy[]>;
    createFeature(feature: any): Promise<void>;
    deleteFeatureStrategies(): Promise<void>;
    hasStrategy(id: string): Promise<boolean>;
    get(id: string): Promise<IFeatureStrategy>;
    exists(key: string): Promise<boolean>;
    delete(key: string): Promise<void>;
    deleteAll(): Promise<void>;
    updateSortOrder(id: string, sortOrder: number): Promise<void>;
    destroy(): void;
    removeAllStrategiesForFeatureEnv(feature_name: string, environment: string): Promise<void>;
    getAll(): Promise<IFeatureStrategy[]>;
    getStrategiesForFeatureEnv(project_name: string, feature_name: string, environment: string): Promise<IFeatureStrategy[]>;
    getFeatureToggleForEnvironment(featureName: string, environment: string): Promise<FeatureToggleWithEnvironment>;
    getFeatureToggleWithEnvs(featureName: string, userId?: number, archived?: boolean): Promise<FeatureToggleWithEnvironment>;
    getFeatureToggleWithVariantEnvs(featureName: string, userId?: number, archived?: boolean): Promise<FeatureToggleWithEnvironment>;
    getFeatures(featureQuery?: IFeatureToggleQuery, archived?: boolean): Promise<IFeatureToggleClient[]>;
    getStrategyById(id: string): Promise<IFeatureStrategy>;
    connectEnvironmentAndFeature(feature_name: string, environment: string, enabled?: boolean): Promise<void>;
    removeEnvironmentForFeature(feature_name: string, environment: string): Promise<void>;
    disconnectEnvironmentFromProject(environment: string, project: string): Promise<void>;
    updateStrategy(id: string, updates: Partial<IFeatureStrategy>): Promise<IFeatureStrategy>;
    deleteConfigurationsForProjectAndEnvironment(projectId: String, environment: String): Promise<void>;
    isEnvironmentEnabled(featureName: string, environment: string): Promise<boolean>;
    setProjectForStrategiesBelongingToFeature(featureName: string, newProjectId: string): Promise<void>;
    setEnvironmentEnabledStatus(environment: string, featureName: string, enabled: boolean): Promise<boolean>;
    getStrategiesBySegment(): Promise<IFeatureStrategy[]>;
    getFeatureOverview(params: IFeatureProjectUserParams): Promise<IFeatureOverview[]>;
    getAllByFeatures(features: string[], environment?: string): Promise<IFeatureStrategy[]>;
    getCustomStrategiesInUseCount(): Promise<number>;
}
export {};
