"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../fixtures/no-logger"));
const feature_toggle_service_1 = __importDefault(require("../../../lib/services/feature-toggle-service"));
const access_service_1 = require("../../../lib/services/access-service");
const project_service_1 = __importDefault(require("../../../lib/services/project-service"));
const project_health_service_1 = __importDefault(require("../../../lib/services/project-health-service"));
const test_config_1 = require("../../config/test-config");
const segment_service_1 = require("../../../lib/services/segment-service");
const group_service_1 = require("../../../lib/services/group-service");
const services_1 = require("../../../lib/services");
const sql_change_request_access_read_model_1 = require("../../../lib/features/change-request-access-service/sql-change-request-access-read-model");
let stores;
let db;
let projectService;
let groupService;
let accessService;
let projectHealthService;
let featureToggleService;
let favoritesService;
let user;
beforeAll(async () => {
    const config = (0, test_config_1.createTestConfig)();
    db = await (0, database_init_1.default)('project_health_service_serial', no_logger_1.default);
    stores = db.stores;
    user = await stores.userStore.insert({
        name: 'Some Name',
        email: 'test@getunleash.io',
    });
    groupService = new group_service_1.GroupService(stores, config);
    accessService = new access_service_1.AccessService(stores, config, groupService);
    const changeRequestAccessReadModel = new sql_change_request_access_read_model_1.ChangeRequestAccessReadModel(db.rawDatabase, accessService);
    featureToggleService = new feature_toggle_service_1.default(stores, config, new segment_service_1.SegmentService(stores, changeRequestAccessReadModel, config), accessService, changeRequestAccessReadModel);
    favoritesService = new services_1.FavoritesService(stores, config);
    projectService = new project_service_1.default(stores, config, accessService, featureToggleService, groupService, favoritesService);
    projectHealthService = new project_health_service_1.default(stores, config, projectService);
});
afterAll(async () => {
    await db.destroy();
});
test('Project with no stale toggles should have 100% health rating', async () => {
    const project = {
        id: 'health-rating',
        name: 'Health rating',
        description: 'Fancy',
    };
    const savedProject = await projectService.createProject(project, user);
    await stores.featureToggleStore.create('health-rating', {
        name: 'health-rating-not-stale',
        description: 'new',
        stale: false,
    });
    await stores.featureToggleStore.create('health-rating', {
        name: 'health-rating-not-stale-2',
        description: 'new too',
        stale: false,
    });
    const rating = await projectHealthService.calculateHealthRating(savedProject);
    expect(rating).toBe(100);
});
test('Project with two stale toggles and two non stale should have 50% health rating', async () => {
    const project = {
        id: 'health-rating-2',
        name: 'Health rating',
        description: 'Fancy',
    };
    const savedProject = await projectService.createProject(project, user);
    await stores.featureToggleStore.create('health-rating-2', {
        name: 'health-rating-2-not-stale',
        description: 'new',
        stale: false,
    });
    await stores.featureToggleStore.create('health-rating-2', {
        name: 'health-rating-2-not-stale-2',
        description: 'new too',
        stale: false,
    });
    await stores.featureToggleStore.create('health-rating-2', {
        name: 'health-rating-2-stale-1',
        description: 'stale',
        stale: true,
    });
    await stores.featureToggleStore.create('health-rating-2', {
        name: 'health-rating-2-stale-2',
        description: 'stale too',
        stale: true,
    });
    const rating = await projectHealthService.calculateHealthRating(savedProject);
    expect(rating).toBe(50);
});
test('Project with one non-stale, one potentially stale and one stale should have 33% health rating', async () => {
    const project = {
        id: 'health-rating-3',
        name: 'Health rating',
        description: 'Fancy',
    };
    const savedProject = await projectService.createProject(project, user);
    await stores.featureToggleStore.create('health-rating-3', {
        name: 'health-rating-3-not-stale',
        description: 'new',
        stale: false,
    });
    await stores.featureToggleStore.create('health-rating-3', {
        name: 'health-rating-3-potentially-stale',
        description: 'new too',
        type: 'release',
        stale: false,
        createdAt: new Date(Date.UTC(2020, 1, 1)),
    });
    await stores.featureToggleStore.create('health-rating-3', {
        name: 'health-rating-3-stale',
        description: 'stale',
        stale: true,
    });
    const rating = await projectHealthService.calculateHealthRating(savedProject);
    expect(rating).toBe(33);
});
//# sourceMappingURL=project-health-service.e2e.test.js.map