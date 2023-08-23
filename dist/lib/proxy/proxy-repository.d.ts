/// <reference types="node" />
import EventEmitter from 'events';
import { RepositoryInterface } from 'unleash-client/lib/repository';
import { Segment } from 'unleash-client/lib/strategy/strategy';
import { FeatureInterface } from 'unleash-client/lib/feature';
import ApiUser from '../types/api-user';
import { IUnleashConfig, IUnleashServices, IUnleashStores } from '../types';
declare type Config = Pick<IUnleashConfig, 'getLogger' | 'frontendApi'>;
declare type Stores = Pick<IUnleashStores, 'projectStore' | 'eventStore'>;
declare type Services = Pick<IUnleashServices, 'featureToggleServiceV2' | 'segmentService' | 'configurationRevisionService'>;
export declare class ProxyRepository extends EventEmitter implements RepositoryInterface {
    private readonly config;
    private readonly logger;
    private readonly stores;
    private readonly services;
    private readonly configurationRevisionService;
    private readonly token;
    private features;
    private segments;
    private interval;
    private timer;
    private running;
    constructor(config: Config, stores: Stores, services: Services, token: ApiUser);
    getSegment(id: number): Segment | undefined;
    getToggle(name: string): FeatureInterface;
    getToggles(): FeatureInterface[];
    start(): Promise<void>;
    stop(): void;
    private dataPolling;
    private loadDataForToken;
    private randomizeDelay;
    private onAnyEvent;
    private featuresForToken;
    private segmentsForToken;
    private projectIdsForToken;
    private environmentNameForToken;
}
export {};
