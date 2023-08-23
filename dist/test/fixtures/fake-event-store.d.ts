/// <reference types="node" />
import { IEventStore } from '../../lib/types/stores/event-store';
import { IEvent } from '../../lib/types/events';
import { IQueryOperations } from 'lib/db/event-store';
import { SearchEventsSchema } from '../../lib/openapi';
import EventEmitter from 'events';
declare class FakeEventStore implements IEventStore {
    events: IEvent[];
    private eventEmitter;
    constructor();
    getMaxRevisionId(): Promise<number>;
    store(event: IEvent): Promise<void>;
    batchStore(events: IEvent[]): Promise<void>;
    getEvents(): Promise<IEvent[]>;
    delete(key: number): Promise<void>;
    deleteAll(): Promise<void>;
    count(): Promise<number>;
    filteredCount(search: SearchEventsSchema): Promise<number>;
    destroy(): void;
    exists(key: number): Promise<boolean>;
    get(key: number): Promise<IEvent>;
    getAll(): Promise<IEvent[]>;
    searchEvents(): Promise<IEvent[]>;
    getForFeatures(features: string[], environments: string[], query: {
        type: string;
        projectId: string;
    }): Promise<IEvent[]>;
    query(operations: IQueryOperations[]): Promise<IEvent[]>;
    queryCount(operations: IQueryOperations[]): Promise<number>;
    setMaxListeners(number: number): EventEmitter;
    on(eventName: string | symbol, listener: (...args: any[]) => void): EventEmitter;
    emit(eventName: string | symbol, ...args: any[]): boolean;
    off(eventName: string | symbol, listener: (...args: any[]) => void): EventEmitter;
    publishUnannouncedEvents(): Promise<void>;
}
export default FakeEventStore;
