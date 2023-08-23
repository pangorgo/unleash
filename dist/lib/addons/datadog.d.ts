import Addon from './addon';
import { IAddonConfig } from '../types/model';
import { IEvent } from '../types/events';
interface IDatadogParameters {
    url: string;
    apiKey: string;
    sourceTypeName?: string;
    customHeaders?: string;
}
export default class DatadogAddon extends Addon {
    private msgFormatter;
    constructor(config: IAddonConfig);
    handleEvent(event: IEvent, parameters: IDatadogParameters): Promise<void>;
}
export {};
