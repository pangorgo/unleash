import { SdkContextSchema } from 'lib/openapi/spec/sdk-context-schema';
import { IUnleashServices } from 'lib/types/services';
import { ALL } from '../../types/models/api-token';
import { PlaygroundFeatureSchema } from 'lib/openapi/spec/playground-feature-schema';
import { IUnleashConfig } from 'lib/types';
import { EvaluatedPlaygroundStrategy } from 'lib/features/playground/feature-evaluator/client';
import { AdvancedPlaygroundFeatureSchema } from '../../openapi/spec/advanced-playground-feature-schema';
import { AdvancedPlaygroundEnvironmentFeatureSchema } from '../../openapi/spec/advanced-playground-environment-feature-schema';
import { playgroundStrategyEvaluation } from 'lib/openapi';
export declare type AdvancedPlaygroundEnvironmentFeatureEvaluationResult = Omit<AdvancedPlaygroundEnvironmentFeatureSchema, 'strategies'> & {
    strategies: {
        result: boolean | typeof playgroundStrategyEvaluation.unknownResult;
        data: EvaluatedPlaygroundStrategy[];
    };
};
export declare type AdvancedPlaygroundFeatureEvaluationResult = Omit<AdvancedPlaygroundFeatureSchema, 'environments'> & {
    environments: Record<string, AdvancedPlaygroundEnvironmentFeatureEvaluationResult[]>;
};
export declare type PlaygroundFeatureEvaluationResult = Omit<PlaygroundFeatureSchema, 'strategies'> & {
    strategies: {
        result: boolean | typeof playgroundStrategyEvaluation.unknownResult;
        data: EvaluatedPlaygroundStrategy[];
    };
};
export declare class PlaygroundService {
    private readonly logger;
    private readonly featureToggleService;
    private readonly segmentService;
    constructor(config: IUnleashConfig, { featureToggleServiceV2, segmentService, }: Pick<IUnleashServices, 'featureToggleServiceV2' | 'segmentService'>);
    evaluateAdvancedQuery(projects: typeof ALL | string[], environments: string[], context: SdkContextSchema, limit: number): Promise<AdvancedPlaygroundFeatureEvaluationResult[]>;
    private evaluate;
    private resolveFeatures;
    evaluateQuery(projects: typeof ALL | string[], environment: string, context: SdkContextSchema): Promise<PlaygroundFeatureEvaluationResult[]>;
}
