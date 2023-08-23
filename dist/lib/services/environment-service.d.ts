import { IEnvironment, IProjectEnvironment, ISortOrder, IUnleashConfig, IUnleashStores } from '../types';
import { CreateFeatureStrategySchema } from '../openapi';
export default class EnvironmentService {
    private logger;
    private environmentStore;
    private featureStrategiesStore;
    private projectStore;
    private featureEnvironmentStore;
    private flagResolver;
    constructor({ environmentStore, featureStrategiesStore, featureEnvironmentStore, projectStore, }: Pick<IUnleashStores, 'environmentStore' | 'featureStrategiesStore' | 'featureEnvironmentStore' | 'projectStore'>, { getLogger, flagResolver, }: Pick<IUnleashConfig, 'getLogger' | 'flagResolver'>);
    getAll(): Promise<IEnvironment[]>;
    get(name: string): Promise<IEnvironment>;
    getProjectEnvironments(projectId: string): Promise<IProjectEnvironment[]>;
    updateSortOrder(sortOrder: ISortOrder): Promise<void>;
    toggleEnvironment(name: string, value: boolean): Promise<void>;
    addEnvironmentToProject(environment: string, projectId: string): Promise<void>;
    addDefaultStrategy(environment: string, projectId: string, strategy: CreateFeatureStrategySchema): Promise<CreateFeatureStrategySchema>;
    overrideEnabledProjects(environmentNamesToEnable: string[]): Promise<void>;
    private remapProjectsLinks;
    forceRemoveEnvironmentFromProject(environment: string, projectId: string): Promise<void>;
    removeEnvironmentFromProject(environment: string, projectId: string): Promise<void>;
}
