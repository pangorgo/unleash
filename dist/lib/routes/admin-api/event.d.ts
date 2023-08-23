import { Request, Response } from 'express';
import { IUnleashConfig } from '../../types/option';
import { IUnleashServices } from '../../types/services';
import { IEvent } from '../../types/events';
import Controller from '../controller';
import { EventsSchema } from '../../../lib/openapi/spec/events-schema';
import { FeatureEventsSchema } from '../../../lib/openapi/spec/feature-events-schema';
import { SearchEventsSchema } from '../../openapi/spec/search-events-schema';
export default class EventController extends Controller {
    private eventService;
    private flagResolver;
    private openApiService;
    constructor(config: IUnleashConfig, { eventService, openApiService, }: Pick<IUnleashServices, 'eventService' | 'openApiService'>);
    maybeAnonymiseEvents(events: IEvent[]): IEvent[];
    getEvents(req: Request<any, any, any, {
        project?: string;
    }>, res: Response<EventsSchema>): Promise<void>;
    getEventsForToggle(req: Request<{
        featureName: string;
    }>, res: Response<FeatureEventsSchema>): Promise<void>;
    searchEvents(req: Request<unknown, unknown, SearchEventsSchema>, res: Response<EventsSchema>): Promise<void>;
}
