import { AdvancedPlaygroundRequestSchema, AdvancedPlaygroundResponseSchema, PlaygroundRequestSchema, PlaygroundResponseSchema } from 'lib/openapi';
import { AdvancedPlaygroundFeatureEvaluationResult, PlaygroundFeatureEvaluationResult } from './playground-service';
export declare const advancedPlaygroundViewModel: (input: AdvancedPlaygroundRequestSchema, playgroundResult: AdvancedPlaygroundFeatureEvaluationResult[]) => AdvancedPlaygroundResponseSchema;
export declare const playgroundViewModel: (input: PlaygroundRequestSchema, playgroundResult: PlaygroundFeatureEvaluationResult[]) => PlaygroundResponseSchema;
