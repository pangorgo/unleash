"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scheduler_service_1 = require("./scheduler-service");
const maintenance_service_1 = __importDefault(require("./maintenance-service"));
const test_config_1 = require("../../test/config/test-config");
test('Maintenance on should pause scheduler', async () => {
    const config = (0, test_config_1.createTestConfig)();
    const schedulerService = new scheduler_service_1.SchedulerService(config.getLogger);
    const maintenanceService = new maintenance_service_1.default({}, config, { insert() { } }, schedulerService);
    await maintenanceService.toggleMaintenanceMode({ enabled: true }, 'irrelevant user');
    expect(schedulerService.getMode()).toBe('paused');
    schedulerService.stop();
});
test('Maintenance off should resume scheduler', async () => {
    const config = (0, test_config_1.createTestConfig)({ disableScheduler: false });
    const schedulerService = new scheduler_service_1.SchedulerService(config.getLogger);
    schedulerService.pause();
    const maintenanceService = new maintenance_service_1.default({}, config, { insert() { } }, schedulerService);
    await maintenanceService.toggleMaintenanceMode({ enabled: false }, 'irrelevant user');
    expect(schedulerService.getMode()).toBe('active');
    schedulerService.stop();
});
//# sourceMappingURL=maintenance-service.test.js.map