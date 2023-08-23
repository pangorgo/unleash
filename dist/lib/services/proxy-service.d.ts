import { IUnleashConfig, IUnleashServices, IUnleashStores } from '../types';
import { ClientMetricsSchema, ProxyFeatureSchema } from '../openapi';
import ApiUser from '../types/api-user';
import { Context } from 'unleash-client';
import { FrontendSettings } from '../types/settings/frontend-settings';
declare type Config = Pick<IUnleashConfig, 'getLogger' | 'frontendApi' | 'frontendApiOrigins'>;
declare type Stores = Pick<IUnleashStores, 'projectStore' | 'eventStore'>;
declare type Services = Pick<IUnleashServices, 'featureToggleServiceV2' | 'segmentService' | 'clientMetricsServiceV2' | 'settingService' | 'configurationRevisionService'>;
export declare class ProxyService {
    private readonly config;
    private readonly logger;
    private readonly stores;
    private readonly services;
    /**
     * This is intentionally a Promise becasue we want to be able to await
     * until the client (which might be being created by a different request) is ready
     * Check this test that fails if we don't use a Promise: src/test/e2e/api/proxy/proxy.concurrency.e2e.test.ts
     */
    private readonly clients;
    private cachedFrontendSettings?;
    private timer;
    constructor(config: Config, stores: Stores, services: Services);
    getProxyFeatures(token: ApiUser, context: Context): Promise<ProxyFeatureSchema[]>;
    registerProxyMetrics(token: ApiUser, metrics: ClientMetricsSchema, ip: string): Promise<void>;
    private clientForProxyToken;
    private createClientForProxyToken;
    deleteClientForProxyToken(secret: string): Promise<void>;
    stopAll(): void;
    private static assertExpectedTokenType;
    setFrontendSettings(value: FrontendSettings, createdBy: string): Promise<void>;
    private fetchFrontendSettings;
    getFrontendSettings(useCache?: boolean): Promise<FrontendSettings>;
    destroy(): void;
}
export {};
