import { UnleashError } from './unleash-error';
declare class UsedTokenError extends UnleashError {
    statusCode: number;
    constructor(usedAt: Date);
}
export default UsedTokenError;
