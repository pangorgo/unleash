import { ErrorObject } from 'ajv';
import { ValidationError } from 'joi';
import { ApiErrorSchema, UnleashError } from './unleash-error';
declare type ValidationErrorDescription = {
    description: string;
    message: string;
    path?: string;
};
declare class BadDataError extends UnleashError {
    statusCode: number;
    details: ValidationErrorDescription[];
    constructor(message: string, errors?: [ValidationErrorDescription, ...ValidationErrorDescription[]]);
    toJSON(): ApiErrorSchema;
}
export default BadDataError;
export declare const fromOpenApiValidationError: (requestBody: object) => (validationError: ErrorObject) => ValidationErrorDescription;
export declare const fromOpenApiValidationErrors: (requestBody: object, validationErrors: [ErrorObject, ...ErrorObject[]]) => BadDataError;
export declare const fromJoiError: (err: ValidationError) => BadDataError;
