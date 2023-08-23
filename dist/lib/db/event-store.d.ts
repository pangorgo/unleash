/// <reference types="node" />
import { IEvent, IBaseEvent } from '../types/events';
import { LogProvider } from '../logger';
import { IEventStore } from '../types/stores/event-store';
import { ITag } from '../types/model';
import { SearchEventsSchema } from '../openapi/spec/search-events-schema';
import { Db } from './db';
import { Knex } from 'knex';
import EventEmitter from 'events';
export declare type IQueryOperations = IWhereOperation | IBeforeDateOperation | IBetweenDatesOperation | IForFeaturesOperation;
interface IWhereOperation {
    op: 'where';
    parameters: {
        [key: string]: string;
    };
}
interface IBeforeDateOperation {
    op: 'beforeDate';
    parameters: {
        dateAccessor: string;
        date: string;
    };
}
interface IBetweenDatesOperation {
    op: 'betweenDate';
    parameters: {
        dateAccessor: string;
        range: string[];
    };
}
interface IForFeaturesOperation {
    op: 'forFeatures';
    parameters: IForFeaturesParams;
}
interface IForFeaturesParams {
    type: string;
    projectId: string;
    environments: string[];
    features: string[];
}
export interface IEventTable {
    id: number;
    type: string;
    created_by: string;
    created_at: Date;
    data?: any;
    pre_data?: any;
    feature_name?: string;
    project?: string;
    environment?: string;
    tags: ITag[];
}
declare class EventStore implements IEventStore {
    private db;
    private eventEmitter;
    private logger;
    constructor(db: Db, getLogger: LogProvider);
    store(event: IBaseEvent): Promise<void>;
    count(): Promise<number>;
    filteredCount(eventSearch: SearchEventsSchema): Promise<number>;
    batchStore(events: IBaseEvent[]): Promise<void>;
    getMaxRevisionId(largerThan?: number): Promise<number>;
    delete(key: number): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists(key: number): Promise<boolean>;
    query(operations: IQueryOperations[]): Promise<IEvent[]>;
    queryCount(operations: IQueryOperations[]): Promise<number>;
    where(query: Knex.QueryBuilder, parameters: {
        [key: string]: string;
    }): Knex.QueryBuilder;
    beforeDate(query: Knex.QueryBuilder, parameters: {
        dateAccessor: string;
        date: string;
    }): Knex.QueryBuilder;
    betweenDate(query: Knex.QueryBuilder, parameters: {
        dateAccessor: string;
        range: string[];
    }): Knex.QueryBuilder;
    select(): Knex.QueryBuilder;
    forFeatures(query: Knex.QueryBuilder, parameters: IForFeaturesParams): Knex.QueryBuilder;
    get(key: number): Promise<IEvent>;
    getAll(query?: Object): Promise<IEvent[]>;
    getEvents(query?: Object): Promise<IEvent[]>;
    searchEvents(search?: SearchEventsSchema): Promise<IEvent[]>;
    rowToEvent(row: IEventTable): IEvent;
    eventToDbRow(e: IBaseEvent): Omit<IEventTable, 'id' | 'created_at'>;
    setMaxListeners(number: number): EventEmitter;
    on(eventName: string | symbol, listener: (...args: any[]) => void): EventEmitter;
    emit(eventName: string | symbol, ...args: any[]): boolean;
    off(eventName: string | symbol, listener: (...args: any[]) => void): EventEmitter;
    private setUnannouncedToAnnounced;
    publishUnannouncedEvents(): Promise<void>;
}
export default EventStore;
