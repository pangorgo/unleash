import { UnleashError } from './unleash-error';
declare class DisabledError extends UnleashError {
    statusCode: number;
}
export default DisabledError;
