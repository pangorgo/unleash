import { Strategy } from './strategy';
import { FeatureInterface } from './feature';
import { RepositoryInterface } from './repository';
import { Variant, VariantDefinition } from './variant';
import { Context } from './context';
import { SegmentForEvaluation } from './strategy/strategy';
import { PlaygroundStrategySchema } from 'lib/openapi/spec/playground-strategy-schema';
import { playgroundStrategyEvaluation } from '../../../openapi/spec/playground-strategy-schema';
export declare type StrategyEvaluationResult = Pick<PlaygroundStrategySchema, 'result' | 'segments' | 'constraints'>;
export declare type EvaluatedPlaygroundStrategy = Omit<PlaygroundStrategySchema, 'links'>;
export declare type FeatureStrategiesEvaluationResult = {
    result: boolean | typeof playgroundStrategyEvaluation.unknownResult;
    variant?: Variant;
    variants?: VariantDefinition[];
    strategies: EvaluatedPlaygroundStrategy[];
};
export default class UnleashClient {
    private repository;
    private strategies;
    constructor(repository: RepositoryInterface, strategies: Strategy[]);
    private getStrategy;
    isEnabled(name: string, context: Context, fallback: Function): FeatureStrategiesEvaluationResult;
    isFeatureEnabled(feature: FeatureInterface, context: Context, fallback: Function): FeatureStrategiesEvaluationResult;
    getSegment(repo: RepositoryInterface): (segmentId: number) => SegmentForEvaluation | undefined;
    getVariant(name: string, context: Context, fallbackVariant?: Variant): Variant;
    forceGetVariant(name: string, context: Context, forcedResult: Pick<FeatureStrategiesEvaluationResult, 'result' | 'variant'>, fallbackVariant?: Variant): Variant;
    private resolveVariant;
}
