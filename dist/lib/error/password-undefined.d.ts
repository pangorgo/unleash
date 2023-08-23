import { ApiErrorSchema, UnleashError } from './unleash-error';
export default class PasswordUndefinedError extends UnleashError {
    statusCode: number;
    constructor();
    toJSON(): ApiErrorSchema;
}
