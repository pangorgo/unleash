/// <reference types="node" />
/// <reference types="node" />
import EventEmitter from 'events';
import { Knex } from 'knex';
import { IUnleashConfig } from './types/option';
import { IUnleashStores } from './types/stores';
import Timer = NodeJS.Timer;
import { InstanceStatsService } from './services/instance-stats-service';
export default class MetricsMonitor {
    timer?: Timer;
    poolMetricsTimer?: Timer;
    constructor();
    startMonitoring(config: IUnleashConfig, stores: IUnleashStores, version: string, eventBus: EventEmitter, instanceStatsService: InstanceStatsService, db: Knex): Promise<void>;
    stopMonitoring(): void;
    configureDbMetrics(db: Knex, eventBus: EventEmitter): void;
    registerPoolMetrics(pool: any, eventBus: EventEmitter): void;
}
export declare function createMetricsMonitor(): MetricsMonitor;
