"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeProjectService = exports.createProjectService = void 0;
const event_store_1 = __importDefault(require("../../db/event-store"));
const group_store_1 = __importDefault(require("../../db/group-store"));
const account_store_1 = require("../../db/account-store");
const environment_store_1 = __importDefault(require("../../db/environment-store"));
const services_1 = require("../../services");
const fake_group_store_1 = __importDefault(require("../../../test/fixtures/fake-group-store"));
const fake_event_store_1 = __importDefault(require("../../../test/fixtures/fake-event-store"));
const project_store_1 = __importDefault(require("../../db/project-store"));
const feature_toggle_store_1 = __importDefault(require("../../db/feature-toggle-store"));
const feature_type_store_1 = __importDefault(require("../../db/feature-type-store"));
const feature_environment_store_1 = require("../../db/feature-environment-store");
const feature_tag_store_1 = __importDefault(require("../../db/feature-tag-store"));
const project_stats_store_1 = __importDefault(require("../../db/project-stats-store"));
const createAccessService_1 = require("../access/createAccessService");
const createFeatureToggleService_1 = require("../feature-toggle/createFeatureToggleService");
const favorite_features_store_1 = require("../../db/favorite-features-store");
const favorite_projects_store_1 = require("../../db/favorite-projects-store");
const fake_project_store_1 = __importDefault(require("../../../test/fixtures/fake-project-store"));
const fake_feature_toggle_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-toggle-store"));
const fake_feature_type_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-type-store"));
const fake_environment_store_1 = __importDefault(require("../../../test/fixtures/fake-environment-store"));
const fake_feature_environment_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-environment-store"));
const fake_feature_tag_store_1 = __importDefault(require("../../../test/fixtures/fake-feature-tag-store"));
const fake_project_stats_store_1 = __importDefault(require("../../../test/fixtures/fake-project-stats-store"));
const fake_favorite_features_store_1 = __importDefault(require("../../../test/fixtures/fake-favorite-features-store"));
const fake_favorite_projects_store_1 = __importDefault(require("../../../test/fixtures/fake-favorite-projects-store"));
const fake_account_store_1 = require("../../../test/fixtures/fake-account-store");
const createProjectService = (db, config) => {
    const { eventBus, getLogger, flagResolver } = config;
    const eventStore = new event_store_1.default(db, getLogger);
    const projectStore = new project_store_1.default(db, eventBus, getLogger, flagResolver);
    const groupStore = new group_store_1.default(db);
    const featureToggleStore = new feature_toggle_store_1.default(db, eventBus, getLogger);
    const featureTypeStore = new feature_type_store_1.default(db, getLogger);
    const accountStore = new account_store_1.AccountStore(db, getLogger);
    const environmentStore = new environment_store_1.default(db, eventBus, getLogger);
    const featureEnvironmentStore = new feature_environment_store_1.FeatureEnvironmentStore(db, eventBus, getLogger);
    const featureTagStore = new feature_tag_store_1.default(db, eventBus, getLogger);
    const projectStatsStore = new project_stats_store_1.default(db, eventBus, getLogger);
    const accessService = (0, createAccessService_1.createAccessService)(db, config);
    const featureToggleService = (0, createFeatureToggleService_1.createFeatureToggleService)(db, config);
    const favoriteFeaturesStore = new favorite_features_store_1.FavoriteFeaturesStore(db, eventBus, getLogger);
    const favoriteProjectsStore = new favorite_projects_store_1.FavoriteProjectsStore(db, eventBus, getLogger);
    const favoriteService = new services_1.FavoritesService({
        favoriteFeaturesStore,
        favoriteProjectsStore,
        eventStore,
    }, config);
    const groupService = new services_1.GroupService({ groupStore, eventStore, accountStore }, { getLogger });
    return new services_1.ProjectService({
        projectStore,
        eventStore,
        featureToggleStore,
        featureTypeStore,
        environmentStore,
        featureEnvironmentStore,
        featureTagStore,
        accountStore,
        projectStatsStore,
    }, config, accessService, featureToggleService, groupService, favoriteService);
};
exports.createProjectService = createProjectService;
const createFakeProjectService = (config) => {
    const { getLogger } = config;
    const eventStore = new fake_event_store_1.default();
    const projectStore = new fake_project_store_1.default();
    const groupStore = new fake_group_store_1.default();
    const featureToggleStore = new fake_feature_toggle_store_1.default();
    const featureTypeStore = new fake_feature_type_store_1.default();
    const accountStore = new fake_account_store_1.FakeAccountStore();
    const environmentStore = new fake_environment_store_1.default();
    const featureEnvironmentStore = new fake_feature_environment_store_1.default();
    const featureTagStore = new fake_feature_tag_store_1.default();
    const projectStatsStore = new fake_project_stats_store_1.default();
    const accessService = (0, createAccessService_1.createFakeAccessService)(config);
    const featureToggleService = (0, createFeatureToggleService_1.createFakeFeatureToggleService)(config);
    const favoriteFeaturesStore = new fake_favorite_features_store_1.default();
    const favoriteProjectsStore = new fake_favorite_projects_store_1.default();
    const favoriteService = new services_1.FavoritesService({
        favoriteFeaturesStore,
        favoriteProjectsStore,
        eventStore,
    }, config);
    const groupService = new services_1.GroupService({ groupStore, eventStore, accountStore }, { getLogger });
    return new services_1.ProjectService({
        projectStore,
        eventStore,
        featureToggleStore,
        featureTypeStore,
        environmentStore,
        featureEnvironmentStore,
        featureTagStore,
        accountStore,
        projectStatsStore,
    }, config, accessService, featureToggleService, groupService, favoriteService);
};
exports.createFakeProjectService = createFakeProjectService;
//# sourceMappingURL=createProjectService.js.map