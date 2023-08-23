import { UnleashError } from './unleash-error';
declare class RoleInUseError extends UnleashError {
    statusCode: number;
}
export default RoleInUseError;
