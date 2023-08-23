import { ApiErrorSchema, UnleashError } from './unleash-error';
export default class IncompatibleProjectError extends UnleashError {
    statusCode: number;
    constructor(targetProject: string);
    toJSON(): ApiErrorSchema;
}
