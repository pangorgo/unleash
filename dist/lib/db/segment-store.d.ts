/// <reference types="node" />
import { ISegmentStore } from '../types/stores/segment-store';
import { IClientSegment, IConstraint, IFeatureStrategySegment, ISegment } from '../types/model';
import { LogProvider } from '../logger';
import EventEmitter from 'events';
import { PartialSome } from '../types/partial';
import User from '../types/user';
import { Db } from './db';
import { IFlagResolver } from '../types';
interface ISegmentRow {
    id: number;
    name: string;
    description?: string;
    segment_project_id?: string;
    created_by?: string;
    created_at: Date;
    used_in_projects?: number;
    used_in_features?: number;
    constraints: IConstraint[];
}
export default class SegmentStore implements ISegmentStore {
    private logger;
    private eventBus;
    private db;
    private flagResolver;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider, flagResolver: IFlagResolver);
    count(): Promise<number>;
    create(segment: PartialSome<ISegment, 'id'>, user: Partial<Pick<User, 'username' | 'email'>>): Promise<ISegment>;
    update(id: number, segment: Omit<ISegment, 'id'>): Promise<ISegment>;
    delete(id: number): Promise<void>;
    getAll(): Promise<ISegment[]>;
    getActive(): Promise<ISegment[]>;
    getActiveForClient(): Promise<IClientSegment[]>;
    getByStrategy(strategyId: string): Promise<ISegment[]>;
    deleteAll(): Promise<void>;
    exists(id: number): Promise<boolean>;
    get(id: number): Promise<ISegment>;
    addToStrategy(id: number, strategyId: string): Promise<void>;
    removeFromStrategy(id: number, strategyId: string): Promise<void>;
    getAllFeatureStrategySegments(): Promise<IFeatureStrategySegment[]>;
    existsByName(name: string): Promise<boolean>;
    prefixColumns(): string[];
    mapRow(row?: ISegmentRow): ISegment;
    destroy(): void;
}
export {};
