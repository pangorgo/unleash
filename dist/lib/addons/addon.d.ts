import { IUnleashConfig } from '../types/option';
import { Logger } from '../logger';
import { IAddonDefinition } from '../types/model';
import { IEvent } from '../types/events';
export default abstract class Addon {
    logger: Logger;
    _name: string;
    _definition: IAddonDefinition;
    constructor(definition: IAddonDefinition, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    get name(): string;
    get definition(): IAddonDefinition;
    fetchRetry(url: string, options?: any, retries?: number): Promise<Response>;
    abstract handleEvent(event: IEvent, parameters: any): Promise<void>;
    destroy?(): void;
}
