import { FeatureStrategiesEvaluationResult } from './client';
import { RepositoryInterface } from './repository';
import { Context } from './context';
import { Strategy } from './strategy';
import { ClientFeaturesResponse, FeatureInterface } from './feature';
import { Variant } from './variant';
import { FallbackFunction } from './helpers';
import { BootstrapOptions } from './repository/bootstrap-provider';
import { StorageProvider } from './repository/storage-provider';
export { Strategy };
export interface FeatureEvaluatorConfig {
    appName: string;
    environment?: string;
    strategies?: Strategy[];
    repository?: RepositoryInterface;
    bootstrap?: BootstrapOptions;
    storageProvider?: StorageProvider<ClientFeaturesResponse>;
}
export interface StaticContext {
    appName: string;
    environment: string;
}
export declare class FeatureEvaluator {
    private repository;
    private client;
    private staticContext;
    constructor({ appName, environment, strategies, repository, bootstrap, storageProvider, }: FeatureEvaluatorConfig);
    start(): Promise<void>;
    destroy(): void;
    isEnabled(name: string, context?: Context, fallbackFunction?: FallbackFunction): FeatureStrategiesEvaluationResult;
    isEnabled(name: string, context?: Context, fallbackValue?: boolean): FeatureStrategiesEvaluationResult;
    getVariant(name: string, context?: Context, fallbackVariant?: Variant): Variant;
    forceGetVariant(name: string, forcedResults: Pick<FeatureStrategiesEvaluationResult, 'result' | 'variant'>, context?: Context, fallbackVariant?: Variant): Variant;
    getFeatureToggleDefinition(toggleName: string): FeatureInterface;
    getFeatureToggleDefinitions(): FeatureInterface[];
}
