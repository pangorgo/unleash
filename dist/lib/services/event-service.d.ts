import { IUnleashConfig } from '../types/option';
import { IUnleashStores } from '../types/stores';
import { IEventList } from '../types/events';
import { SearchEventsSchema } from '../openapi/spec/search-events-schema';
export default class EventService {
    private logger;
    private eventStore;
    constructor({ eventStore }: Pick<IUnleashStores, 'eventStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    getEvents(): Promise<IEventList>;
    searchEvents(search: SearchEventsSchema): Promise<IEventList>;
}
