import { UnleashError } from './unleash-error';
declare class FeatureHasTagError extends UnleashError {
    statusCode: number;
}
export default FeatureHasTagError;
