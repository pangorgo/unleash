"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_config_1 = require("../../test/config/test-config");
const instance_stats_service_1 = require("./instance-stats-service");
const store_1 = __importDefault(require("../../test/fixtures/store"));
const version_service_1 = __importDefault(require("./version-service"));
let instanceStatsService;
let versionService;
beforeEach(() => {
    const config = (0, test_config_1.createTestConfig)();
    const stores = (0, store_1.default)();
    versionService = new version_service_1.default(stores, config);
    instanceStatsService = new instance_stats_service_1.InstanceStatsService(stores, config, versionService);
    jest.spyOn(instanceStatsService, 'refreshStatsSnapshot');
    jest.spyOn(instanceStatsService, 'getStats');
    // validate initial state without calls to these methods
    expect(instanceStatsService.refreshStatsSnapshot).toBeCalledTimes(0);
    expect(instanceStatsService.getStats).toBeCalledTimes(0);
});
test('get snapshot should not call getStats', async () => {
    await instanceStatsService.refreshStatsSnapshot();
    expect(instanceStatsService.getStats).toBeCalledTimes(1);
    // subsequent calls to getStatsSnapshot don't call getStats
    for (let i = 0; i < 3; i++) {
        const stats = instanceStatsService.getStatsSnapshot();
        expect(stats.clientApps).toStrictEqual([
            { range: 'allTime', count: 0 },
            { range: '30d', count: 0 },
            { range: '7d', count: 0 },
        ]);
    }
    // after querying the stats snapshot no call to getStats should be issued
    expect(instanceStatsService.getStats).toBeCalledTimes(1);
});
test('before the snapshot is refreshed we can still get the appCount', async () => {
    expect(instanceStatsService.refreshStatsSnapshot).toBeCalledTimes(0);
    expect(instanceStatsService.getAppCountSnapshot('7d')).toBeUndefined();
});
//# sourceMappingURL=instance-stats-service.test.js.map