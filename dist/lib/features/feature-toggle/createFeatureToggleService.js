"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeFeatureToggleService = exports.createFeatureToggleService = void 0;
const services_1 = require("../../services");
const feature_strategy_store_1 = __importDefault(require("../../db/feature-strategy-store"));
const feature_toggle_store_1 = __importDefault(require("../../db/feature-toggle-store"));
const feature_toggle_client_store_1 = __importDefault(require("../../db/feature-toggle-client-store"));
const project_store_1 = __importDefault(require("../../db/project-store"));
const feature_tag_store_1 = __importDefault(require("../../db/feature-tag-store"));
const feature_environment_store_1 = require("../../db/feature-environment-store");
const context_field_store_1 = __importDefault(require("../../db/context-field-store"));
const group_store_1 = __importDefault(require("../../db/group-store"));
const account_store_1 = require("../../db/account-store");
const access_store_1 = require("../../db/access-store");
const role_store_1 = __importDefault(require("../../db/role-store"));
const environment_store_1 = __importDefault(require("../../db/environment-store"));
const fake_event_store_1 = __importDefault(require("../../../test/fixtures/fake-event-store"));
const fake_feature_strategies_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-strategies-store"));
const fake_feature_toggle_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-toggle-store"));
const fake_feature_toggle_client_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-toggle-client-store"));
const fake_project_store_1 = __importDefault(require("../../../test/fixtures/fake-project-store"));
const fake_feature_tag_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-tag-store"));
const fake_feature_environment_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-environment-store"));
const fake_context_field_store_1 = __importDefault(require("../../../test/fixtures/fake-context-field-store"));
const fake_group_store_1 = __importDefault(require("../../../test/fixtures/fake-group-store"));
const fake_account_store_1 = require("../../../test/fixtures/fake-account-store");
const fake_access_store_1 = __importDefault(require("../../../test/fixtures/fake-access-store"));
const fake_role_store_1 = __importDefault(require("../../../test/fixtures/fake-role-store"));
const fake_environment_store_1 = __importDefault(require("../../../test/fixtures/fake-environment-store"));
const event_store_1 = __importDefault(require("../../db/event-store"));
const createChangeRequestAccessReadModel_1 = require("../change-request-access-service/createChangeRequestAccessReadModel");
const createSegmentService_1 = require("../segment/createSegmentService");
const createFeatureToggleService = (db, config) => {
    const { getLogger, eventBus, flagResolver } = config;
    const featureStrategiesStore = new feature_strategy_store_1.default(db, eventBus, getLogger, flagResolver);
    const featureToggleStore = new feature_toggle_store_1.default(db, eventBus, getLogger);
    const featureToggleClientStore = new feature_toggle_client_store_1.default(db, eventBus, getLogger, flagResolver);
    const projectStore = new project_store_1.default(db, eventBus, getLogger, flagResolver);
    const featureTagStore = new feature_tag_store_1.default(db, eventBus, getLogger);
    const featureEnvironmentStore = new feature_environment_store_1.FeatureEnvironmentStore(db, eventBus, getLogger);
    const contextFieldStore = new context_field_store_1.default(db, getLogger, flagResolver);
    const groupStore = new group_store_1.default(db);
    const accountStore = new account_store_1.AccountStore(db, getLogger);
    const accessStore = new access_store_1.AccessStore(db, eventBus, getLogger);
    const roleStore = new role_store_1.default(db, eventBus, getLogger);
    const environmentStore = new environment_store_1.default(db, eventBus, getLogger);
    const eventStore = new event_store_1.default(db, getLogger);
    const groupService = new services_1.GroupService({ groupStore, eventStore, accountStore }, { getLogger });
    const accessService = new services_1.AccessService({ accessStore, accountStore, roleStore, environmentStore, groupStore }, { getLogger, flagResolver }, groupService);
    const segmentService = (0, createSegmentService_1.createSegmentService)(db, config);
    const changeRequestAccessReadModel = (0, createChangeRequestAccessReadModel_1.createChangeRequestAccessReadModel)(db, config);
    const featureToggleService = new services_1.FeatureToggleService({
        featureStrategiesStore,
        featureToggleStore,
        featureToggleClientStore,
        projectStore,
        eventStore,
        featureTagStore,
        featureEnvironmentStore,
        contextFieldStore,
    }, { getLogger, flagResolver }, segmentService, accessService, changeRequestAccessReadModel);
    return featureToggleService;
};
exports.createFeatureToggleService = createFeatureToggleService;
const createFakeFeatureToggleService = (config) => {
    const { getLogger, flagResolver } = config;
    const eventStore = new fake_event_store_1.default();
    const featureStrategiesStore = new fake_feature_strategies_store_1.default();
    const featureToggleStore = new fake_feature_toggle_store_1.default();
    const featureToggleClientStore = new fake_feature_toggle_client_store_1.default();
    const projectStore = new fake_project_store_1.default();
    const featureTagStore = new fake_feature_tag_store_1.default();
    const featureEnvironmentStore = new fake_feature_environment_store_1.default();
    const contextFieldStore = new fake_context_field_store_1.default();
    const groupStore = new fake_group_store_1.default();
    const accountStore = new fake_account_store_1.FakeAccountStore();
    const accessStore = new fake_access_store_1.default();
    const roleStore = new fake_role_store_1.default();
    const environmentStore = new fake_environment_store_1.default();
    const groupService = new services_1.GroupService({ groupStore, eventStore, accountStore }, { getLogger });
    const accessService = new services_1.AccessService({ accessStore, accountStore, roleStore, environmentStore, groupStore }, { getLogger, flagResolver }, groupService);
    const segmentService = (0, createSegmentService_1.createFakeSegmentService)(config);
    const changeRequestAccessReadModel = (0, createChangeRequestAccessReadModel_1.createFakeChangeRequestAccessService)();
    const featureToggleService = new services_1.FeatureToggleService({
        featureStrategiesStore,
        featureToggleStore,
        featureToggleClientStore,
        projectStore,
        eventStore,
        featureTagStore,
        featureEnvironmentStore,
        contextFieldStore,
    }, { getLogger, flagResolver }, segmentService, accessService, changeRequestAccessReadModel);
    return featureToggleService;
};
exports.createFakeFeatureToggleService = createFakeFeatureToggleService;
//# sourceMappingURL=createFeatureToggleService.js.map