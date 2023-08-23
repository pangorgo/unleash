"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastSeenService = void 0;
const date_fns_1 = require("date-fns");
class LastSeenService {
    constructor({ featureToggleStore }, config, lastSeenInterval = (0, date_fns_1.secondsToMilliseconds)(30)) {
        this.timers = [];
        this.lastSeenToggles = new Set();
        this.featureToggleStore = featureToggleStore;
        this.logger = config.getLogger('/services/client-metrics/last-seen-service.ts');
        this.timers.push(setInterval(() => this.store(), lastSeenInterval).unref());
    }
    async store() {
        const count = this.lastSeenToggles.size;
        if (count > 0) {
            const lastSeenToggles = [...this.lastSeenToggles];
            this.lastSeenToggles = new Set();
            this.logger.debug(`Updating last seen for ${lastSeenToggles.length} toggles`);
            await this.featureToggleStore.setLastSeen(lastSeenToggles);
        }
        return count;
    }
    updateLastSeen(clientMetrics) {
        clientMetrics
            .filter((clientMetric) => clientMetric.yes > 0 || clientMetric.no > 0)
            .forEach((clientMetric) => this.lastSeenToggles.add({
            featureName: clientMetric.featureName,
            environment: clientMetric.environment,
        }));
    }
    destroy() {
        this.timers.forEach(clearInterval);
    }
}
exports.LastSeenService = LastSeenService;
//# sourceMappingURL=last-seen-service.js.map