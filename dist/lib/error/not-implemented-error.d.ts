import { UnleashError } from './unleash-error';
declare class NotImplementedError extends UnleashError {
    statusCode: number;
}
export default NotImplementedError;
