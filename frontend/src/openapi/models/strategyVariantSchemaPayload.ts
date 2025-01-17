/**
 * Generated by Orval
 * Do not edit manually.
 * See `gen:api` script in package.json
 */
import type { StrategyVariantSchemaPayloadType } from './strategyVariantSchemaPayloadType';

/**
 * Extra data configured for this variant
 */
export type StrategyVariantSchemaPayload = {
    /** The type of the value. Commonly used types are string, json and csv. */
    type: StrategyVariantSchemaPayloadType;
    /** The actual value of payload */
    value: string;
};
