import { IClientMetricsEnv, IClientMetricsEnvVariant } from '../types/stores/client-metrics-store-v2';
export declare const collapseHourlyMetrics: (metrics: IClientMetricsEnv[]) => IClientMetricsEnv[];
export declare const spreadVariants: (metrics: IClientMetricsEnv[]) => IClientMetricsEnvVariant[];
