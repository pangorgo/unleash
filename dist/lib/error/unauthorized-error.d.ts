import { UnleashError } from './unleash-error';
declare class UnauthorizedError extends UnleashError {
    statusCode: number;
}
export default UnauthorizedError;
