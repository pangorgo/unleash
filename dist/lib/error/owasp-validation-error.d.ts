import { TestResult } from 'owasp-password-strength-test';
import { ApiErrorSchema, UnleashError } from './unleash-error';
declare class OwaspValidationError extends UnleashError {
    statusCode: number;
    private details;
    constructor(testResult: TestResult);
    toJSON(): ApiErrorSchema;
}
export default OwaspValidationError;
