import { IUnleashConfig } from '../types/option';
import { IUnleashStores } from '../types/stores';
import VersionService from './version-service';
export declare type TimeRange = 'allTime' | '30d' | '7d';
export interface InstanceStats {
    instanceId: string;
    timestamp: Date;
    versionOSS: string;
    versionEnterprise?: string;
    users: number;
    featureToggles: number;
    projects: number;
    contextFields: number;
    roles: number;
    customRootRoles: number;
    customRootRolesInUse: number;
    featureExports: number;
    featureImports: number;
    groups: number;
    environments: number;
    segments: number;
    strategies: number;
    SAMLenabled: boolean;
    OIDCenabled: boolean;
    clientApps: {
        range: TimeRange;
        count: number;
    }[];
}
export interface InstanceStatsSigned extends InstanceStats {
    sum: string;
}
export declare class InstanceStatsService {
    private logger;
    private strategyStore;
    private userStore;
    private featureToggleStore;
    private contextFieldStore;
    private projectStore;
    private groupStore;
    private environmentStore;
    private segmentStore;
    private roleStore;
    private eventStore;
    private versionService;
    private settingStore;
    private clientInstanceStore;
    private snapshot?;
    private appCount?;
    constructor({ featureToggleStore, userStore, projectStore, environmentStore, strategyStore, contextFieldStore, groupStore, segmentStore, roleStore, settingStore, clientInstanceStore, eventStore, }: Pick<IUnleashStores, 'featureToggleStore' | 'userStore' | 'projectStore' | 'environmentStore' | 'strategyStore' | 'contextFieldStore' | 'groupStore' | 'segmentStore' | 'roleStore' | 'settingStore' | 'clientInstanceStore' | 'eventStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>, versionService: VersionService);
    refreshStatsSnapshot(): Promise<void>;
    getToggleCount(): Promise<number>;
    hasOIDC(): Promise<boolean>;
    hasSAML(): Promise<boolean>;
    /**
     * use getStatsSnapshot for low latency, sacrificing data-freshness
     */
    getStats(): Promise<InstanceStats>;
    getStatsSnapshot(): InstanceStats | undefined;
    getLabeledAppCounts(): Promise<{
        range: TimeRange;
        count: number;
    }[]>;
    getAppCountSnapshot(range: TimeRange): number | undefined;
    getSignedStats(): Promise<InstanceStatsSigned>;
}
