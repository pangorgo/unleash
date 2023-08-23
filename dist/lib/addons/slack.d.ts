import Addon from './addon';
import { IAddonConfig } from '../types/model';
import { IEvent } from '../types/events';
interface ISlackAddonParameters {
    url: string;
    username?: string;
    defaultChannel: string;
    emojiIcon?: string;
    customHeaders?: string;
}
export default class SlackAddon extends Addon {
    private msgFormatter;
    constructor(args: IAddonConfig);
    handleEvent(event: IEvent, parameters: ISlackAddonParameters): Promise<void>;
    findSlackChannels({ tags }: Pick<IEvent, 'tags'>): string[];
}
export {};
