import { FeatureToggle, FeatureToggleDTO, FeatureToggleLegacy, FeatureToggleWithEnvironment, IConstraint, IFeatureEnvironmentInfo, IFeatureOverview, IFeatureStrategy, IFeatureToggleQuery, ISegment, IStrategyConfig, IUnleashConfig, IUnleashStores, IVariant, Saved, Unsaved } from '../types';
import { FeatureConfigurationClient } from '../types/stores/feature-strategies-store';
import { Operation } from 'fast-json-patch';
import { SetStrategySortOrderSchema } from 'lib/openapi/spec/set-strategy-sort-order-schema';
import { AccessService } from './access-service';
import { User } from '../server-impl';
import { IFeatureProjectUserParams } from '../routes/admin-api/project/project-features';
import { ISegmentService } from 'lib/segments/segment-service-interface';
import { IChangeRequestAccessReadModel } from '../features/change-request-access-service/change-request-access-read-model';
interface IFeatureContext {
    featureName: string;
    projectId: string;
}
interface IFeatureStrategyContext extends IFeatureContext {
    environment: string;
}
export interface IGetFeatureParams {
    featureName: string;
    archived?: boolean;
    projectId?: string;
    environmentVariants?: boolean;
    userId?: number;
}
declare class FeatureToggleService {
    private logger;
    private featureStrategiesStore;
    private featureToggleStore;
    private featureToggleClientStore;
    private tagStore;
    private featureEnvironmentStore;
    private projectStore;
    private eventStore;
    private contextFieldStore;
    private segmentService;
    private accessService;
    private flagResolver;
    private changeRequestAccessReadModel;
    constructor({ featureStrategiesStore, featureToggleStore, featureToggleClientStore, projectStore, eventStore, featureTagStore, featureEnvironmentStore, contextFieldStore, }: Pick<IUnleashStores, 'featureStrategiesStore' | 'featureToggleStore' | 'featureToggleClientStore' | 'projectStore' | 'eventStore' | 'featureTagStore' | 'featureEnvironmentStore' | 'contextFieldStore'>, { getLogger, flagResolver, }: Pick<IUnleashConfig, 'getLogger' | 'flagResolver'>, segmentService: ISegmentService, accessService: AccessService, changeRequestAccessReadModel: IChangeRequestAccessReadModel);
    validateFeaturesContext(featureNames: string[], projectId: string): Promise<void>;
    validateFeatureBelongsToProject({ featureName, projectId, }: IFeatureContext): Promise<void>;
    validateUpdatedProperties({ featureName, projectId }: IFeatureContext, strategy: IFeatureStrategy): void;
    validateProjectCanAccessSegments(projectId: string, segmentIds?: number[]): Promise<void>;
    validateConstraints(constraints: IConstraint[]): Promise<IConstraint[]>;
    validateConstraint(input: IConstraint): Promise<IConstraint>;
    patchFeature(project: string, featureName: string, createdBy: string, operations: Operation[]): Promise<FeatureToggle>;
    featureStrategyToPublic(featureStrategy: IFeatureStrategy, segments?: ISegment[]): Saved<IStrategyConfig>;
    updateStrategiesSortOrder(context: IFeatureStrategyContext, sortOrders: SetStrategySortOrderSchema, createdBy: string, user?: User): Promise<Saved<any>>;
    unprotectedUpdateStrategiesSortOrder(context: IFeatureStrategyContext, sortOrders: SetStrategySortOrderSchema, createdBy: string): Promise<Saved<any>>;
    createStrategy(strategyConfig: Unsaved<IStrategyConfig>, context: IFeatureStrategyContext, createdBy: string, user?: User): Promise<Saved<IStrategyConfig>>;
    unprotectedCreateStrategy(strategyConfig: Unsaved<IStrategyConfig>, context: IFeatureStrategyContext, createdBy: string): Promise<Saved<IStrategyConfig>>;
    /**
     * PUT /api/admin/projects/:projectId/features/:featureName/strategies/:strategyId ?
     * {
     *
     * }
     * @param id
     * @param updates
     * @param context - Which context does this strategy live in (projectId, featureName, environment)
     * @param userName - Human readable id of the user performing the update
     * @param user - Optional User object performing the action
     */
    updateStrategy(id: string, updates: Partial<IFeatureStrategy>, context: IFeatureStrategyContext, userName: string, user?: User): Promise<Saved<IStrategyConfig>>;
    optionallyDisableFeature(featureName: string, environment: string, projectId: string, userName: string): Promise<void>;
    unprotectedUpdateStrategy(id: string, updates: Partial<IFeatureStrategy>, context: IFeatureStrategyContext, userName: string): Promise<Saved<IStrategyConfig>>;
    updateStrategyParameter(id: string, name: string, value: string | number, context: IFeatureStrategyContext, userName: string): Promise<Saved<IStrategyConfig>>;
    /**
     * DELETE /api/admin/projects/:projectId/features/:featureName/environments/:environmentName/strategies/:strategyId
     * {
     *
     * }
     * @param id - strategy id
     * @param context - Which context does this strategy live in (projectId, featureName, environment)
     * @param createdBy - Which user does this strategy belong to
     * @param user
     */
    deleteStrategy(id: string, context: IFeatureStrategyContext, createdBy: string, user?: User): Promise<void>;
    unprotectedDeleteStrategy(id: string, context: IFeatureStrategyContext, createdBy: string): Promise<void>;
    getStrategiesForEnvironment(project: string, featureName: string, environment?: string): Promise<Saved<IStrategyConfig>[]>;
    /**
     * GET /api/admin/projects/:project/features/:featureName
     * @param featureName
     * @param archived - return archived or non archived toggles
     * @param projectId - provide if you're requesting the feature in the context of a specific project.
     * @param userId
     */
    getFeature({ featureName, archived, projectId, environmentVariants, userId, }: IGetFeatureParams): Promise<FeatureToggleWithEnvironment>;
    /**
     * GET /api/admin/projects/:project/features/:featureName/variants
     * @deprecated - Variants should be fetched from FeatureEnvironmentStore (since variants are now; since 4.18, connected to environments)
     * @param featureName
     * @return The list of variants
     */
    getVariants(featureName: string): Promise<IVariant[]>;
    getVariantsForEnv(featureName: string, environment: string): Promise<IVariant[]>;
    getFeatureMetadata(featureName: string): Promise<FeatureToggle>;
    getClientFeatures(query?: IFeatureToggleQuery): Promise<FeatureConfigurationClient[]>;
    getPlaygroundFeatures(query?: IFeatureToggleQuery): Promise<FeatureConfigurationClient[]>;
    /**
     * @deprecated Legacy!
     *
     * Used to retrieve metadata of all feature toggles defined in Unleash.
     * @param query - Allow you to limit search based on criteria such as project, tags, namePrefix. See @IFeatureToggleQuery
     * @param archived - Return archived or active toggles
     * @returns
     */
    getFeatureToggles(query?: IFeatureToggleQuery, userId?: number, archived?: boolean): Promise<FeatureToggle[]>;
    getFeatureOverview(params: IFeatureProjectUserParams): Promise<IFeatureOverview[]>;
    getFeatureToggle(featureName: string): Promise<FeatureToggleWithEnvironment>;
    createFeatureToggle(projectId: string, value: FeatureToggleDTO, createdBy: string, isValidated?: boolean): Promise<FeatureToggle>;
    cloneFeatureToggle(featureName: string, projectId: string, newFeatureName: string, replaceGroupId: boolean, // eslint-disable-line
    userName: string): Promise<FeatureToggle>;
    updateFeatureToggle(projectId: string, updatedFeature: FeatureToggleDTO, userName: string, featureName: string): Promise<FeatureToggle>;
    getFeatureCountForProject(projectId: string): Promise<number>;
    removeAllStrategiesForEnv(toggleName: string, environment?: string): Promise<void>;
    getStrategy(strategyId: string): Promise<Saved<IStrategyConfig>>;
    getEnvironmentInfo(project: string, environment: string, featureName: string): Promise<IFeatureEnvironmentInfo>;
    deleteEnvironment(projectId: string, environment: string): Promise<void>;
    /** Validations  */
    validateName(name: string): Promise<string>;
    validateUniqueFeatureName(name: string): Promise<void>;
    hasFeature(name: string): Promise<boolean>;
    updateStale(featureName: string, isStale: boolean, createdBy: string): Promise<any>;
    archiveToggle(featureName: string, createdBy: string, projectId?: string): Promise<void>;
    archiveToggles(featureNames: string[], createdBy: string, projectId: string): Promise<void>;
    setToggleStaleness(featureNames: string[], stale: boolean, createdBy: string, projectId: string): Promise<void>;
    bulkUpdateEnabled(project: string, featureNames: string[], environment: string, enabled: boolean, createdBy: string, user?: User, shouldActivateDisabledStrategies?: boolean): Promise<void>;
    updateEnabled(project: string, featureName: string, environment: string, enabled: boolean, createdBy: string, user?: User, shouldActivateDisabledStrategies?: boolean): Promise<FeatureToggle>;
    unprotectedUpdateEnabled(project: string, featureName: string, environment: string, enabled: boolean, createdBy: string, shouldActivateDisabledStrategies?: boolean): Promise<FeatureToggle>;
    storeFeatureUpdatedEventLegacy(featureName: string, createdBy: string): Promise<FeatureToggleLegacy>;
    toggle(projectId: string, featureName: string, environment: string, userName: string): Promise<FeatureToggle>;
    getFeatureToggleLegacy(featureName: string): Promise<FeatureToggleLegacy>;
    changeProject(featureName: string, newProject: string, createdBy: string): Promise<void>;
    getArchivedFeatures(): Promise<FeatureToggle[]>;
    deleteFeature(featureName: string, createdBy: string): Promise<void>;
    deleteFeatures(featureNames: string[], projectId: string, createdBy: string): Promise<void>;
    reviveFeatures(featureNames: string[], projectId: string, createdBy: string): Promise<void>;
    reviveToggle(featureName: string, createdBy: string): Promise<void>;
    getMetadataForAllFeatures(archived: boolean): Promise<FeatureToggle[]>;
    getMetadataForAllFeaturesByProjectId(archived: boolean, project: string): Promise<FeatureToggle[]>;
    getProjectId(name: string): Promise<string | undefined>;
    updateFeatureStrategyProject(featureName: string, newProjectId: string): Promise<void>;
    updateVariants(featureName: string, project: string, newVariants: Operation[], user: User): Promise<FeatureToggle>;
    updateVariantsOnEnv(featureName: string, project: string, environment: string, newVariants: Operation[], user: User): Promise<IVariant[]>;
    saveVariants(featureName: string, project: string, newVariants: IVariant[], createdBy: string): Promise<FeatureToggle>;
    saveVariantsOnEnv(projectId: string, featureName: string, environment: string, newVariants: IVariant[], user: User, oldVariants?: IVariant[]): Promise<IVariant[]>;
    crProtectedSaveVariantsOnEnv(projectId: string, featureName: string, environment: string, newVariants: IVariant[], user: User, oldVariants?: IVariant[]): Promise<IVariant[]>;
    crProtectedSetVariantsOnEnvs(projectId: string, featureName: string, environments: string[], newVariants: IVariant[], user: User): Promise<IVariant[]>;
    setVariantsOnEnvs(projectId: string, featureName: string, environments: string[], newVariants: IVariant[], user: User): Promise<IVariant[]>;
    fixVariantWeights(variants: IVariant[]): IVariant[];
    private stopWhenChangeRequestsEnabled;
    private stopWhenCannotCreateStrategies;
    updatePotentiallyStaleFeatures(): Promise<void>;
}
export default FeatureToggleService;
