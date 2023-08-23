"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = void 0;
class SchedulerService {
    constructor(getLogger) {
        this.intervalIds = [];
        this.logger = getLogger('/services/scheduler-service.ts');
        this.mode = 'active';
    }
    async schedule(scheduledFunction, timeMs) {
        this.intervalIds.push(setInterval(async () => {
            try {
                if (this.mode === 'active') {
                    await scheduledFunction();
                }
            }
            catch (e) {
                this.logger.error('scheduled job failed', e);
            }
        }, timeMs).unref());
        try {
            if (this.mode === 'active') {
                await scheduledFunction();
            }
        }
        catch (e) {
            this.logger.error('scheduled job failed', e);
        }
    }
    stop() {
        this.intervalIds.forEach(clearInterval);
    }
    pause() {
        this.mode = 'paused';
    }
    resume() {
        this.mode = 'active';
    }
    getMode() {
        return this.mode;
    }
}
exports.SchedulerService = SchedulerService;
//# sourceMappingURL=scheduler-service.js.map