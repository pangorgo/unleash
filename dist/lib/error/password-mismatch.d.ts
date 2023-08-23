import { UnleashError } from './unleash-error';
declare class PasswordMismatch extends UnleashError {
    statusCode: number;
    constructor(message?: string);
}
export default PasswordMismatch;
