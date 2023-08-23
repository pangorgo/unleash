import { IUnleashConfig } from '../../types';
import { IUnleashStores } from '../../types';
import { ToggleMetricsSummary } from '../../types/models/metrics';
import { IClientMetricsEnv } from '../../types/stores/client-metrics-store-v2';
import ApiUser from '../../types/api-user';
import User from '../../types/user';
import { LastSeenService } from './last-seen-service';
import { ClientMetricsSchema } from 'lib/openapi';
export default class ClientMetricsServiceV2 {
    private config;
    private timers;
    private unsavedMetrics;
    private clientMetricsStoreV2;
    private lastSeenService;
    private flagResolver;
    private logger;
    constructor({ clientMetricsStoreV2 }: Pick<IUnleashStores, 'clientMetricsStoreV2'>, config: IUnleashConfig, lastSeenService: LastSeenService, bulkInterval?: number);
    filterValidToggleNames(toggleNames: string[]): Promise<string[]>;
    registerBulkMetrics(metrics: IClientMetricsEnv[]): Promise<void>;
    registerClientMetrics(data: ClientMetricsSchema, clientIp: string): Promise<void>;
    bulkAdd(): Promise<void>;
    getFeatureToggleMetricsSummary(featureName: string): Promise<ToggleMetricsSummary>;
    getClientMetricsForToggle(featureName: string, hoursBack?: number): Promise<IClientMetricsEnv[]>;
    resolveMetricsEnvironment(user: User | ApiUser, data: {
        environment?: string;
    }): string;
    destroy(): void;
}
