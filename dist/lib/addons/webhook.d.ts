import Addon from './addon';
import { LogProvider } from '../logger';
import { IEvent } from '../types/events';
interface IParameters {
    url: string;
    bodyTemplate?: string;
    contentType?: string;
    authorization?: string;
    customHeaders?: string;
}
export default class Webhook extends Addon {
    constructor(args: {
        getLogger: LogProvider;
    });
    handleEvent(event: IEvent, parameters: IParameters): Promise<void>;
}
export {};
