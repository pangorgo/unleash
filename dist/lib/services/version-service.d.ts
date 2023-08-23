import { IUnleashStores } from '../types/stores';
import { IUnleashConfig } from '../types/option';
export interface IVersionInfo {
    oss: string;
    enterprise?: string;
}
export interface IVersionHolder {
    current: IVersionInfo;
    latest: Partial<IVersionInfo>;
    isLatest: boolean;
    instanceId: string;
}
export interface IVersionResponse {
    versions: IVersionInfo;
    latest: boolean;
}
export interface IFeatureUsageInfo {
    instanceId: string;
    versionOSS: string;
    versionEnterprise?: string;
    users: number;
    featureToggles: number;
    projects: number;
    contextFields: number;
    roles: number;
    customRootRoles: number;
    featureExports: number;
    featureImports: number;
    groups: number;
    environments: number;
    segments: number;
    strategies: number;
    SAMLenabled: boolean;
    OIDCenabled: boolean;
    customStrategies: number;
    customStrategiesInUse: number;
}
export default class VersionService {
    private logger;
    private settingStore;
    private strategyStore;
    private userStore;
    private featureToggleStore;
    private projectStore;
    private environmentStore;
    private contextFieldStore;
    private groupStore;
    private roleStore;
    private segmentStore;
    private eventStore;
    private featureStrategiesStore;
    private current;
    private latest?;
    private enabled;
    private telemetryEnabled;
    private versionCheckUrl;
    private instanceId?;
    private isLatest;
    private timer;
    constructor({ settingStore, strategyStore, userStore, featureToggleStore, projectStore, environmentStore, contextFieldStore, groupStore, roleStore, segmentStore, eventStore, featureStrategiesStore, }: Pick<IUnleashStores, 'settingStore' | 'strategyStore' | 'userStore' | 'featureToggleStore' | 'projectStore' | 'environmentStore' | 'contextFieldStore' | 'groupStore' | 'roleStore' | 'segmentStore' | 'eventStore' | 'featureStrategiesStore'>, { getLogger, versionCheck, enterpriseVersion, telemetry, }: Pick<IUnleashConfig, 'getLogger' | 'versionCheck' | 'enterpriseVersion' | 'telemetry'>);
    setup(): Promise<void>;
    setInstanceId(): Promise<void>;
    checkLatestVersion(): Promise<void>;
    getFeatureUsageInfo(): Promise<IFeatureUsageInfo>;
    hasOIDC(): Promise<boolean>;
    hasSAML(): Promise<boolean>;
    getVersionInfo(): IVersionHolder;
    destroy(): void;
}
