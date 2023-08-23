/// <reference types="node" />
import EventEmitter from 'events';
import { IClientMetricsEnv, IClientMetricsEnvKey, IClientMetricsStoreV2 } from '../../lib/types/stores/client-metrics-store-v2';
export default class FakeClientMetricsStoreV2 extends EventEmitter implements IClientMetricsStoreV2 {
    metrics: IClientMetricsEnv[];
    constructor();
    getSeenTogglesForApp(appName: string, hoursBack?: number): Promise<string[]>;
    clearMetrics(hoursBack: number): Promise<void>;
    getSeenAppsForFeatureToggle(featureName: string, hoursBack?: number): Promise<string[]>;
    getMetricsForFeatureToggle(featureName: string, hoursBack?: number): Promise<IClientMetricsEnv[]>;
    batchInsertMetrics(metrics: IClientMetricsEnv[]): Promise<void>;
    get(key: IClientMetricsEnvKey): Promise<IClientMetricsEnv>;
    getAll(query?: Object): Promise<IClientMetricsEnv[]>;
    exists(key: IClientMetricsEnvKey): Promise<boolean>;
    delete(key: IClientMetricsEnvKey): Promise<void>;
    getMetricsLastHour(): Promise<[]>;
    insert(): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
}
