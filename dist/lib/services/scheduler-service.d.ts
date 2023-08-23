import { LogProvider } from '../logger';
export declare type SchedulerMode = 'active' | 'paused';
export declare class SchedulerService {
    private intervalIds;
    private mode;
    private logger;
    constructor(getLogger: LogProvider);
    schedule(scheduledFunction: () => void, timeMs: number): Promise<void>;
    stop(): void;
    pause(): void;
    resume(): void;
    getMode(): SchedulerMode;
}
