import { UnleashError } from './unleash-error';
declare class ForbiddenError extends UnleashError {
    statusCode: number;
}
export default ForbiddenError;
