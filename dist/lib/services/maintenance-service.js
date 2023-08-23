"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maintenance_settings_1 = require("../types/settings/maintenance-settings");
class MaintenanceService {
    constructor({ patStore, eventStore, }, config, settingService, schedulerService) {
        this.config = config;
        this.logger = config.getLogger('services/pat-service.ts');
        this.patStore = patStore;
        this.eventStore = eventStore;
        this.settingService = settingService;
        this.schedulerService = schedulerService;
    }
    async isMaintenanceMode() {
        return (this.config.flagResolver.isEnabled('maintenanceMode') ||
            (await this.getMaintenanceSetting()).enabled);
    }
    async getMaintenanceSetting() {
        return ((await this.settingService.get(maintenance_settings_1.maintenanceSettingsKey)) || {
            enabled: false,
        });
    }
    async toggleMaintenanceMode(setting, user) {
        if (setting.enabled) {
            this.schedulerService.pause();
        }
        else if (!this.config.disableScheduler) {
            this.schedulerService.resume();
        }
        return this.settingService.insert(maintenance_settings_1.maintenanceSettingsKey, setting, user);
    }
}
exports.default = MaintenanceService;
module.exports = MaintenanceService;
//# sourceMappingURL=maintenance-service.js.map