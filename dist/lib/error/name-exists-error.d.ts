import { UnleashError } from './unleash-error';
declare class NameExistsError extends UnleashError {
    statusCode: number;
}
export default NameExistsError;
