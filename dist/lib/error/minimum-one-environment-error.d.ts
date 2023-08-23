import { UnleashError } from './unleash-error';
declare class MinimumOneEnvironmentError extends UnleashError {
    statusCode: number;
}
export default MinimumOneEnvironmentError;
