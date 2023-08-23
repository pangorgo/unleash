import { ApiErrorSchema, UnleashError } from './unleash-error';
export default class ProjectWithoutOwnerError extends UnleashError {
    statusCode: number;
    constructor();
    toJSON(): ApiErrorSchema;
}
