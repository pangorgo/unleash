import { Strategy } from './strategy';
import { Context } from '../context';
export default class GradualRolloutUserIdStrategy extends Strategy {
    constructor();
    isEnabled(parameters: {
        percentage: number | string;
        groupId?: string;
    }, context: Context): boolean;
}
