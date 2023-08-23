import { Strategy } from './strategy';
import { Context } from '../context';
export default class UserWithIdStrategy extends Strategy {
    constructor();
    isEnabled(parameters: {
        userIds?: string;
    }, context: Context): boolean;
}
