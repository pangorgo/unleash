/// <reference types="node" />
import EventEmitter from 'events';
import { IFlagResolver } from '../types/experimental';
import { InstanceStatsService } from 'lib/services';
export declare function responseTimeMetrics(eventBus: EventEmitter, flagResolver: IFlagResolver, instanceStatsService: Pick<InstanceStatsService, 'getAppCountSnapshot'>): any;
