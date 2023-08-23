import { IUnleashConfig } from '../types/option';
import { IUnleashStores } from '../types/stores';
export default class EventAnnouncer {
    private logger;
    private eventStore;
    constructor({ eventStore }: Pick<IUnleashStores, 'eventStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    publishUnannouncedEvents(): Promise<void>;
}
