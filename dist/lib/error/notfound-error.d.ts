import { UnleashError } from './unleash-error';
declare class NotFoundError extends UnleashError {
    statusCode: number;
    constructor(message?: string);
}
export default NotFoundError;
