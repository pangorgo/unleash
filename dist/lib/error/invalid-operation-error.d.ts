import { UnleashError } from './unleash-error';
declare class InvalidOperationError extends UnleashError {
    statusCode: number;
}
export default InvalidOperationError;
