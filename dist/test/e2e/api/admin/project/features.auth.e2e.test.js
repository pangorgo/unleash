"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../../../helpers/database-init"));
const test_helper_1 = require("../../../helpers/test-helper");
const no_logger_1 = __importDefault(require("../../../../fixtures/no-logger"));
const util_1 = require("../../../../../lib/util");
const types_1 = require("../../../../../lib/types");
let app;
let db;
beforeAll(async () => {
    db = await (0, database_init_1.default)('feature_strategy_auth_api_serial', no_logger_1.default);
    app = await (0, test_helper_1.setupAppWithAuth)(db.stores);
});
afterEach(async () => {
    const all = await db.stores.projectStore.getEnvironmentsForProject('default');
    await Promise.all(all
        .filter((env) => env.environment !== util_1.DEFAULT_ENV)
        .map(async (env) => db.stores.projectStore.deleteEnvironmentForProject('default', env.environment)));
});
afterAll(async () => {
    await app.destroy();
    await db.destroy();
});
test('Should not be possible to update feature toggle without permission', async () => {
    const email = 'user@mail.com';
    const url = '/api/admin/projects/default/features';
    const name = 'auth.toggle.update';
    await db.stores.featureToggleStore.create('default', { name });
    await app.services.userService.createUser({
        email,
        rootRole: types_1.RoleName.VIEWER,
    });
    await app.request.post('/auth/demo/login').send({
        email,
    });
    await app.request
        .put(`${url}/${name}`)
        .send({ name, description: 'updated', type: 'kill-switch' })
        .expect(403);
});
test('Should be possible to update feature toggle with permission', async () => {
    const email = 'user2@mail.com';
    const url = '/api/admin/projects/default/features';
    const name = 'auth.toggle.update2';
    await db.stores.featureToggleStore.create('default', { name });
    await app.services.userService.createUser({
        email,
        rootRole: types_1.RoleName.EDITOR,
    });
    await app.request.post('/auth/demo/login').send({
        email,
    });
    await app.request
        .put(`${url}/${name}`)
        .send({ name, description: 'updated', type: 'kill-switch' })
        .expect(200);
});
test('Should not be possible auto-enable feature toggle without CREATE_FEATURE_STRATEGY permission', async () => {
    const email = 'user33@mail.com';
    const url = '/api/admin/projects/default/features';
    const name = 'auth.toggle.enable';
    await app.services.featureToggleServiceV2.createFeatureToggle('default', { name }, 'me', true);
    await app.services.userService.createUser({
        email,
        rootRole: types_1.RoleName.EDITOR,
    });
    await app.request.post('/auth/demo/login').send({
        email,
    });
    const role = await db.stores.roleStore.getRoleByName(types_1.RoleName.EDITOR);
    await db.stores.accessStore.removePermissionFromRole(role.id, types_1.CREATE_FEATURE_STRATEGY, 'default');
    await app.request
        .post(`${url}/${name}/environments/default/on`)
        .expect(403);
});
//# sourceMappingURL=features.auth.e2e.test.js.map