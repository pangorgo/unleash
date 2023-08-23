import { IStrategyConfig } from '../../../types';
import { FeatureStrategiesEvaluationResult } from './client';
import { Context } from './context';
export declare type FallbackFunction = (name: string, context: Context) => boolean;
export declare function createFallbackFunction(name: string, context: Context, fallback?: FallbackFunction | boolean): () => FeatureStrategiesEvaluationResult;
export declare function resolveContextValue(context: Context, field: string): string | undefined;
export declare function safeName(str?: string): string;
export declare function getDefaultStrategy(featureName: string): IStrategyConfig;
export declare function getProjectDefaultStrategy(defaultStrategy: IStrategyConfig, featureName: string): IStrategyConfig;
