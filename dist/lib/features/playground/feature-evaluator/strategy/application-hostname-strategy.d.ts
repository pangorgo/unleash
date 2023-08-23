import { Strategy } from './strategy';
export default class ApplicationHostnameStrategy extends Strategy {
    private hostname;
    constructor();
    isEnabled(parameters: {
        hostNames: string;
    }): boolean;
}
