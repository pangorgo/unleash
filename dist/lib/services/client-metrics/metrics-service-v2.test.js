"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const metrics_service_v2_1 = __importDefault(require("./metrics-service-v2"));
const no_logger_1 = __importDefault(require("../../../test/fixtures/no-logger"));
const store_1 = __importDefault(require("../../../test/fixtures/store"));
const events_1 = __importDefault(require("events"));
const last_seen_service_1 = require("./last-seen-service");
function initClientMetrics(flagEnabled = true) {
    const stores = (0, store_1.default)();
    const eventBus = new events_1.default();
    eventBus.emit = jest.fn();
    const config = {
        eventBus,
        getLogger: no_logger_1.default,
        flagResolver: {
            isEnabled: () => {
                return flagEnabled;
            },
        },
    };
    const lastSeenService = new last_seen_service_1.LastSeenService(stores, config);
    lastSeenService.updateLastSeen = jest.fn();
    const service = new metrics_service_v2_1.default(stores, config, lastSeenService);
    return { clientMetricsService: service, eventBus, lastSeenService };
}
test('process metrics properly', async () => {
    const { clientMetricsService, eventBus, lastSeenService } = initClientMetrics();
    await clientMetricsService.registerClientMetrics({
        appName: 'test',
        bucket: {
            start: '1982-07-25T12:00:00.000Z',
            stop: '2023-07-25T12:00:00.000Z',
            toggles: {
                myCoolToggle: {
                    yes: 25,
                    no: 42,
                    variants: {
                        blue: 6,
                        green: 15,
                        red: 46,
                    },
                },
                myOtherToggle: {
                    yes: 0,
                    no: 100,
                },
            },
        },
        environment: 'test',
    }, '127.0.0.1');
    expect(eventBus.emit).toHaveBeenCalledTimes(1);
    expect(lastSeenService.updateLastSeen).toHaveBeenCalledTimes(1);
});
test('process metrics properly even when some names are not url friendly, filtering out invalid names when flag is on', async () => {
    const { clientMetricsService, eventBus, lastSeenService } = initClientMetrics();
    await clientMetricsService.registerClientMetrics({
        appName: 'test',
        bucket: {
            start: '1982-07-25T12:00:00.000Z',
            stop: '2023-07-25T12:00:00.000Z',
            toggles: {
                'not url friendly ☹': {
                    yes: 0,
                    no: 100,
                },
            },
        },
        environment: 'test',
    }, '127.0.0.1');
    // only toggle with a bad name gets filtered out
    expect(eventBus.emit).not.toHaveBeenCalled();
    expect(lastSeenService.updateLastSeen).not.toHaveBeenCalled();
});
test('process metrics properly even when some names are not url friendly, with default behavior when flag is off', async () => {
    const { clientMetricsService, eventBus, lastSeenService } = initClientMetrics(false);
    await clientMetricsService.registerClientMetrics({
        appName: 'test',
        bucket: {
            start: '1982-07-25T12:00:00.000Z',
            stop: '2023-07-25T12:00:00.000Z',
            toggles: {
                'not url friendly ☹': {
                    yes: 0,
                    no: 100,
                },
            },
        },
        environment: 'test',
    }, '127.0.0.1');
    expect(eventBus.emit).toHaveBeenCalledTimes(1);
    expect(lastSeenService.updateLastSeen).toHaveBeenCalledTimes(1);
});
//# sourceMappingURL=metrics-service-v2.test.js.map