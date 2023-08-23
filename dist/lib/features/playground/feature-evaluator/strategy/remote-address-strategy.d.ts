import { Strategy } from './strategy';
import { Context } from '../context';
export default class RemoteAddressStrategy extends Strategy {
    constructor();
    isEnabled(parameters: {
        IPs?: string;
    }, context: Context): boolean;
}
