"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExportImportTogglesService = exports.createFakeExportImportTogglesService = void 0;
const export_import_service_1 = __importDefault(require("./export-import-service"));
const import_toggles_store_1 = require("./import-toggles-store");
const feature_toggle_store_1 = __importDefault(require("../../db/feature-toggle-store"));
const tag_store_1 = __importDefault(require("../../db/tag-store"));
const tag_type_store_1 = __importDefault(require("../../db/tag-type-store"));
const project_store_1 = __importDefault(require("../../db/project-store"));
const feature_tag_store_1 = __importDefault(require("../../db/feature-tag-store"));
const strategy_store_1 = __importDefault(require("../../db/strategy-store"));
const context_field_store_1 = __importDefault(require("../../db/context-field-store"));
const feature_strategy_store_1 = __importDefault(require("../../db/feature-strategy-store"));
const services_1 = require("../../services");
const createAccessService_1 = require("../access/createAccessService");
const createFeatureToggleService_1 = require("../feature-toggle/createFeatureToggleService");
const segment_store_1 = __importDefault(require("../../db/segment-store"));
const feature_environment_store_1 = require("../../db/feature-environment-store");
const fake_feature_toggle_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-toggle-store"));
const fake_tag_store_1 = __importDefault(require("../../../test/fixtures/fake-tag-store"));
const fake_tag_type_store_1 = __importDefault(require("../../../test/fixtures/fake-tag-type-store"));
const fake_segment_store_1 = __importDefault(require("../../../test/fixtures/fake-segment-store"));
const fake_project_store_1 = __importDefault(require("../../../test/fixtures/fake-project-store"));
const fake_feature_tag_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-tag-store"));
const fake_context_field_store_1 = __importDefault(require("../../../test/fixtures/fake-context-field-store"));
const fake_event_store_1 = __importDefault(require("../../../test/fixtures/fake-event-store"));
const fake_feature_strategies_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-strategies-store"));
const fake_feature_environment_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-environment-store"));
const fake_strategies_store_1 = __importDefault(require("../../../test/fixtures/fake-strategies-store"));
const event_store_1 = __importDefault(require("../../db/event-store"));
const createFakeExportImportTogglesService = (config) => {
    const { getLogger } = config;
    const importTogglesStore = {};
    const featureToggleStore = new fake_feature_toggle_store_1.default();
    const tagStore = new fake_tag_store_1.default();
    const tagTypeStore = new fake_tag_type_store_1.default();
    const segmentStore = new fake_segment_store_1.default();
    const projectStore = new fake_project_store_1.default();
    const featureTagStore = new fake_feature_tag_store_1.default();
    const strategyStore = new fake_strategies_store_1.default();
    const contextFieldStore = new fake_context_field_store_1.default();
    const eventStore = new fake_event_store_1.default();
    const featureStrategiesStore = new fake_feature_strategies_store_1.default();
    const featureEnvironmentStore = new fake_feature_environment_store_1.default();
    const accessService = (0, createAccessService_1.createFakeAccessService)(config);
    const featureToggleService = (0, createFeatureToggleService_1.createFakeFeatureToggleService)(config);
    const featureTagService = new services_1.FeatureTagService({
        tagStore,
        featureTagStore,
        eventStore,
        featureToggleStore,
    }, { getLogger });
    const contextService = new services_1.ContextService({
        projectStore,
        eventStore,
        contextFieldStore,
        featureStrategiesStore,
    }, { getLogger });
    const strategyService = new services_1.StrategyService({ strategyStore, eventStore }, { getLogger });
    const tagTypeService = new services_1.TagTypeService({ tagTypeStore, eventStore }, { getLogger });
    const exportImportService = new export_import_service_1.default({
        eventStore,
        importTogglesStore,
        featureStrategiesStore,
        contextFieldStore,
        featureToggleStore,
        featureTagStore,
        segmentStore,
        tagTypeStore,
        featureEnvironmentStore,
    }, config, {
        featureToggleService,
        featureTagService,
        accessService,
        contextService,
        strategyService,
        tagTypeService,
    });
    return exportImportService;
};
exports.createFakeExportImportTogglesService = createFakeExportImportTogglesService;
const createExportImportTogglesService = (db, config) => {
    const { eventBus, getLogger, flagResolver } = config;
    const importTogglesStore = new import_toggles_store_1.ImportTogglesStore(db);
    const featureToggleStore = new feature_toggle_store_1.default(db, eventBus, getLogger);
    const tagStore = new tag_store_1.default(db, eventBus, getLogger);
    const tagTypeStore = new tag_type_store_1.default(db, eventBus, getLogger);
    const segmentStore = new segment_store_1.default(db, eventBus, getLogger, flagResolver);
    const projectStore = new project_store_1.default(db, eventBus, getLogger, flagResolver);
    const featureTagStore = new feature_tag_store_1.default(db, eventBus, getLogger);
    const strategyStore = new strategy_store_1.default(db, getLogger);
    const contextFieldStore = new context_field_store_1.default(db, getLogger, flagResolver);
    const featureStrategiesStore = new feature_strategy_store_1.default(db, eventBus, getLogger, flagResolver);
    const featureEnvironmentStore = new feature_environment_store_1.FeatureEnvironmentStore(db, eventBus, getLogger);
    const eventStore = new event_store_1.default(db, getLogger);
    const accessService = (0, createAccessService_1.createAccessService)(db, config);
    const featureToggleService = (0, createFeatureToggleService_1.createFeatureToggleService)(db, config);
    const featureTagService = new services_1.FeatureTagService({
        tagStore,
        featureTagStore,
        eventStore,
        featureToggleStore,
    }, { getLogger });
    const contextService = new services_1.ContextService({
        projectStore,
        eventStore,
        contextFieldStore,
        featureStrategiesStore,
    }, { getLogger });
    const strategyService = new services_1.StrategyService({ strategyStore, eventStore }, { getLogger });
    const tagTypeService = new services_1.TagTypeService({ tagTypeStore, eventStore }, { getLogger });
    const exportImportService = new export_import_service_1.default({
        eventStore,
        importTogglesStore,
        featureStrategiesStore,
        contextFieldStore,
        featureToggleStore,
        featureTagStore,
        segmentStore,
        tagTypeStore,
        featureEnvironmentStore,
    }, config, {
        featureToggleService,
        featureTagService,
        accessService,
        contextService,
        strategyService,
        tagTypeService,
    });
    return exportImportService;
};
exports.createExportImportTogglesService = createExportImportTogglesService;
//# sourceMappingURL=createExportImportService.js.map