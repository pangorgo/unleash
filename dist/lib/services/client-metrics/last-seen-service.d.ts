import { IUnleashConfig } from '../../server-impl';
import { IUnleashStores } from '../../types';
import { IClientMetricsEnv } from '../../types/stores/client-metrics-store-v2';
export declare type LastSeenInput = {
    featureName: string;
    environment: string;
};
export declare class LastSeenService {
    private timers;
    private lastSeenToggles;
    private logger;
    private featureToggleStore;
    constructor({ featureToggleStore }: Pick<IUnleashStores, 'featureToggleStore'>, config: IUnleashConfig, lastSeenInterval?: number);
    store(): Promise<number>;
    updateLastSeen(clientMetrics: IClientMetricsEnv[]): void;
    destroy(): void;
}
