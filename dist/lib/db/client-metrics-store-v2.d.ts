import { LogProvider } from '../logger';
import { IClientMetricsEnv, IClientMetricsEnvKey, IClientMetricsStoreV2 } from '../types/stores/client-metrics-store-v2';
import { Db } from './db';
import { IFlagResolver } from '../types';
export declare class ClientMetricsStoreV2 implements IClientMetricsStoreV2 {
    private db;
    private logger;
    private flagResolver;
    constructor(db: Db, getLogger: LogProvider, flagResolver: IFlagResolver);
    get(key: IClientMetricsEnvKey): Promise<IClientMetricsEnv>;
    getAll(query?: Object): Promise<IClientMetricsEnv[]>;
    exists(key: IClientMetricsEnvKey): Promise<boolean>;
    delete(key: IClientMetricsEnvKey): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    batchInsertMetrics(metrics: IClientMetricsEnv[]): Promise<void>;
    getMetricsForFeatureToggle(featureName: string, hoursBack?: number): Promise<IClientMetricsEnv[]>;
    getSeenAppsForFeatureToggle(featureName: string, hoursBack?: number): Promise<string[]>;
    getSeenTogglesForApp(appName: string, hoursBack?: number): Promise<string[]>;
    clearMetrics(hoursAgo: number): Promise<void>;
}
