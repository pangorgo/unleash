"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const test_config_1 = require("../../test/config/test-config");
const feature_toggle_service_1 = __importDefault(require("./feature-toggle-service"));
test('Should only store events for potentially stale on', async () => {
    expect.assertions(2);
    const featureUpdates = [
        { name: 'feature1', potentiallyStale: true, project: 'default' },
        { name: 'feature2', potentiallyStale: false, project: 'default' },
    ];
    const config = (0, test_config_1.createTestConfig)();
    const featureToggleService = new feature_toggle_service_1.default({
        featureToggleStore: {
            updatePotentiallyStaleFeatures: () => featureUpdates,
        },
        featureTagStore: {
            getAllTagsForFeature: () => [],
        },
        eventStore: {
            batchStore: (events) => {
                expect(events.length).toBe(1);
                const [event1] = events;
                expect(event1).toMatchObject({
                    featureName: 'feature1',
                    project: 'default',
                    type: types_1.FEATURE_POTENTIALLY_STALE_ON,
                });
            },
        },
    }, {
        ...config,
        flagResolver: { isEnabled: () => true },
        experimental: {
            ...(config.experimental ?? {}),
            emitPotentiallyStaleEvents: true,
        },
    }, {}, {}, {});
    await featureToggleService.updatePotentiallyStaleFeatures();
});
//# sourceMappingURL=feature-service-potentially-stale.test.js.map