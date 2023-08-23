import { UnleashError } from './unleash-error';
declare class InvalidTokenError extends UnleashError {
    statusCode: number;
    constructor();
}
export default InvalidTokenError;
