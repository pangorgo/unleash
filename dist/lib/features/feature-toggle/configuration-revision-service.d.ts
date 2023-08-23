/// <reference types="node" />
import { EventEmitter } from 'stream';
import { IUnleashConfig, IUnleashStores } from '../../types';
export declare const UPDATE_REVISION = "UPDATE_REVISION";
export default class ConfigurationRevisionService extends EventEmitter {
    private logger;
    private eventStore;
    private revisionId;
    constructor({ eventStore }: Pick<IUnleashStores, 'eventStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    getMaxRevisionId(): Promise<number>;
    updateMaxRevisionId(): Promise<number>;
}
