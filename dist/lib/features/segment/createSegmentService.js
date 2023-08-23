"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeSegmentService = exports.createSegmentService = void 0;
const event_store_1 = __importDefault(require("../../db/event-store"));
const services_1 = require("../../services");
const fake_event_store_1 = __importDefault(require("../../../test/fixtures/fake-event-store"));
const feature_strategy_store_1 = __importDefault(require("../../db/feature-strategy-store"));
const segment_store_1 = __importDefault(require("../../db/segment-store"));
const fake_segment_store_1 = __importDefault(require("../../../test/fixtures/fake-segment-store"));
const fake_feature_strategies_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-strategies-store"));
const createChangeRequestAccessReadModel_1 = require("../change-request-access-service/createChangeRequestAccessReadModel");
const createSegmentService = (db, config) => {
    const { eventBus, getLogger, flagResolver } = config;
    const eventStore = new event_store_1.default(db, getLogger);
    const segmentStore = new segment_store_1.default(db, eventBus, getLogger, flagResolver);
    const featureStrategiesStore = new feature_strategy_store_1.default(db, eventBus, getLogger, flagResolver);
    const changeRequestAccessReadModel = (0, createChangeRequestAccessReadModel_1.createChangeRequestAccessReadModel)(db, config);
    return new services_1.SegmentService({ segmentStore, featureStrategiesStore, eventStore }, changeRequestAccessReadModel, config);
};
exports.createSegmentService = createSegmentService;
const createFakeSegmentService = (config) => {
    const eventStore = new fake_event_store_1.default();
    const segmentStore = new fake_segment_store_1.default();
    const featureStrategiesStore = new fake_feature_strategies_store_1.default();
    const changeRequestAccessReadModel = (0, createChangeRequestAccessReadModel_1.createFakeChangeRequestAccessService)();
    return new services_1.SegmentService({ segmentStore, featureStrategiesStore, eventStore }, changeRequestAccessReadModel, config);
};
exports.createFakeSegmentService = createFakeSegmentService;
//# sourceMappingURL=createSegmentService.js.map