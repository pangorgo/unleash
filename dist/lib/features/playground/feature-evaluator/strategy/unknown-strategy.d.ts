import { StrategyEvaluationResult } from '../client';
import { Constraint } from '../constraint';
import { Context } from '../context';
import { SegmentForEvaluation, Strategy } from './strategy';
export default class UnknownStrategy extends Strategy {
    constructor();
    isEnabled(): boolean;
    isEnabledWithConstraints(parameters: unknown, context: Context, constraints: Iterable<Constraint>, segments: SegmentForEvaluation[]): StrategyEvaluationResult;
}
