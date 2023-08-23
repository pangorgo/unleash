import { IUnleashConfig } from '../types/option';
import { FeatureToggle, IEnvironment, IFeatureEnvironment, IFeatureStrategy, IImportData, IImportFile, IProject, ISegment, ITag } from '../types/model';
import { IFeatureTag } from '../types/stores/feature-tag-store';
import { ITagType } from '../types/stores/tag-type-store';
import { IStrategy } from '../types/stores/strategy-store';
import { IUnleashStores } from '../types/stores';
import { PartialSome } from '../types/partial';
export interface IBackupOption {
    includeFeatureToggles: boolean;
    includeStrategies: boolean;
    includeProjects: boolean;
    includeTags: boolean;
}
interface IExportIncludeOptions {
    includeFeatureToggles?: boolean;
    includeStrategies?: boolean;
    includeProjects?: boolean;
    includeTags?: boolean;
    includeEnvironments?: boolean;
    includeSegments?: boolean;
}
export default class StateService {
    private logger;
    private toggleStore;
    private featureStrategiesStore;
    private strategyStore;
    private eventStore;
    private tagStore;
    private tagTypeStore;
    private projectStore;
    private featureEnvironmentStore;
    private featureTagStore;
    private environmentStore;
    private segmentStore;
    constructor(stores: IUnleashStores, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    importFile({ file, dropBeforeImport, userName, keepExisting, }: IImportFile): Promise<void>;
    replaceGlobalEnvWithDefaultEnv(data: any): void;
    moveVariantsToFeatureEnvironments(data: any): void;
    import({ data, userName, dropBeforeImport, keepExisting, }: IImportData): Promise<void>;
    enabledIn(feature: string, env: any): {};
    importFeatureEnvironments({ featureEnvironments }: {
        featureEnvironments: any;
    }): Promise<void>;
    importFeatureStrategies({ featureStrategies, dropBeforeImport, keepExisting, }: {
        featureStrategies: any;
        dropBeforeImport: any;
        keepExisting: any;
    }): Promise<void>;
    convertLegacyFeatures({ features, }: {
        features: any;
    }): Promise<{
        features: any;
        featureStrategies: any;
        featureEnvironments: any;
    }>;
    importFeatures({ features, userName, dropBeforeImport, keepExisting, featureEnvironments, }: {
        features: any;
        userName: any;
        dropBeforeImport: any;
        keepExisting: any;
        featureEnvironments: any;
    }): Promise<void>;
    importStrategies({ strategies, userName, dropBeforeImport, keepExisting, }: {
        strategies: any;
        userName: any;
        dropBeforeImport: any;
        keepExisting: any;
    }): Promise<void>;
    importEnvironments({ environments, userName, dropBeforeImport, keepExisting, }: {
        environments: any;
        userName: any;
        dropBeforeImport: any;
        keepExisting: any;
    }): Promise<IEnvironment[]>;
    importProjects({ projects, importedEnvironments, userName, dropBeforeImport, keepExisting, }: {
        projects: any;
        importedEnvironments: any;
        userName: any;
        dropBeforeImport: any;
        keepExisting: any;
    }): Promise<void>;
    importTagData({ tagTypes, tags, featureTags, userName, dropBeforeImport, keepExisting, }: {
        tagTypes: any;
        tags: any;
        featureTags: any;
        userName: any;
        dropBeforeImport: any;
        keepExisting: any;
    }): Promise<void>;
    compareFeatureTags: (old: IFeatureTag, tag: IFeatureTag) => boolean;
    importFeatureTags(featureTags: IFeatureTag[], keepExisting: boolean, oldFeatureTags: IFeatureTag[], userName: string): Promise<void>;
    compareTags: (old: ITag, tag: ITag) => boolean;
    importTags(tags: ITag[], keepExisting: boolean, oldTags: ITag[], userName: string): Promise<void>;
    importTagTypes(tagTypes: ITagType[], keepExisting: boolean, oldTagTypes: ITagType[], // eslint-disable-line
    userName: string): Promise<void>;
    importSegments(segments: PartialSome<ISegment, 'id'>[], userName: string, dropBeforeImport: boolean): Promise<void>;
    importFeatureStrategySegments(featureStrategySegments: {
        featureStrategyId: string;
        segmentId: number;
    }[]): Promise<void>;
    export(opts: IExportIncludeOptions): Promise<{
        features: FeatureToggle[];
        strategies: IStrategy[];
        version: number;
        projects: IProject[];
        tagTypes: ITagType[];
        tags: ITag[];
        featureTags: IFeatureTag[];
        featureStrategies: IFeatureStrategy[];
        environments: IEnvironment[];
        featureEnvironments: IFeatureEnvironment[];
    }>;
    exportV4({ includeFeatureToggles, includeStrategies, includeProjects, includeTags, includeEnvironments, includeSegments, }: IExportIncludeOptions): Promise<{
        features: FeatureToggle[];
        strategies: IStrategy[];
        version: number;
        projects: IProject[];
        tagTypes: ITagType[];
        tags: ITag[];
        featureTags: IFeatureTag[];
        featureStrategies: IFeatureStrategy[];
        environments: IEnvironment[];
        featureEnvironments: IFeatureEnvironment[];
    }>;
}
export {};
