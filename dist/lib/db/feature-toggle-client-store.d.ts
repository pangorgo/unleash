/// <reference types="node" />
import { LogProvider } from '../logger';
import { IFeatureToggleClient, IFeatureToggleClientStore, IFeatureToggleQuery, IFlagResolver } from '../types';
import EventEmitter from 'events';
import { Db } from './db';
export interface IGetAllFeatures {
    featureQuery?: IFeatureToggleQuery;
    archived: boolean;
    requestType: 'client' | 'admin' | 'playground';
    userId?: number;
}
export interface IGetAdminFeatures {
    featureQuery?: IFeatureToggleQuery;
    archived?: boolean;
    userId?: number;
}
export default class FeatureToggleClientStore implements IFeatureToggleClientStore {
    private db;
    private logger;
    private timer;
    private flagResolver;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider, flagResolver: IFlagResolver);
    private getAll;
    private rowToStrategy;
    private static rowToTag;
    private isUnseenStrategyRow;
    private addTag;
    private isNewTag;
    private addSegmentToStrategy;
    private addSegmentIdsToStrategy;
    getClient(featureQuery?: IFeatureToggleQuery): Promise<IFeatureToggleClient[]>;
    getPlayground(featureQuery?: IFeatureToggleQuery): Promise<IFeatureToggleClient[]>;
    getAdmin({ featureQuery, userId, archived, }: IGetAdminFeatures): Promise<IFeatureToggleClient[]>;
}
