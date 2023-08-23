import { CodedError } from '@slack/web-api';
import Addon from './addon';
import { IAddonConfig } from '../types/model';
import { IEvent } from '../types/events';
interface ISlackAppAddonParameters {
    accessToken: string;
    defaultChannels: string;
}
export default class SlackAppAddon extends Addon {
    private msgFormatter;
    private accessToken?;
    private slackClient?;
    constructor(args: IAddonConfig);
    handleEvent(event: IEvent, parameters: ISlackAppAddonParameters): Promise<void>;
    findTaggedChannels({ tags }: Pick<IEvent, 'tags'>): string[];
    getDefaultChannels(defaultChannels?: string): string[];
    logError(event: IEvent, error: Error | CodedError): void;
}
export {};
