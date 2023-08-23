import { SdkContextSchema } from 'lib/openapi/spec/sdk-context-schema';
import { FeatureEvaluator } from './feature-evaluator';
import { FeatureConfigurationClient } from 'lib/types/stores/feature-strategies-store';
import { Segment } from './feature-evaluator/strategy/strategy';
import { ISegment } from 'lib/types/model';
import { FeatureInterface } from 'unleash-client/lib/feature';
declare type NonEmptyList<T> = [T, ...T[]];
export declare const mapFeaturesForClient: (features: FeatureConfigurationClient[]) => FeatureInterface[];
export declare const mapSegmentsForClient: (segments: ISegment[]) => Segment[];
export declare type ClientInitOptions = {
    features: NonEmptyList<FeatureConfigurationClient>;
    segments?: ISegment[];
    context: SdkContextSchema;
    logError: (message: any, ...args: any[]) => void;
};
export declare const offlineUnleashClient: ({ features, context, segments, }: ClientInitOptions) => Promise<FeatureEvaluator>;
export {};
