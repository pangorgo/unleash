import Addon from './addon';
import { IAddonConfig } from '../types/model';
import { IEvent } from '../types/events';
interface ITeamsParameters {
    url: string;
    customHeaders?: string;
}
export default class TeamsAddon extends Addon {
    private msgFormatter;
    constructor(args: IAddonConfig);
    handleEvent(event: IEvent, parameters: ITeamsParameters): Promise<void>;
}
export {};
