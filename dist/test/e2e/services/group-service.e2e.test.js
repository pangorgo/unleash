"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_init_1 = __importDefault(require("../helpers/database-init"));
const no_logger_1 = __importDefault(require("../../fixtures/no-logger"));
const test_config_1 = require("../../config/test-config");
const group_service_1 = require("../../../lib/services/group-service");
let stores;
let db;
let groupService;
let groupStore;
let user;
beforeAll(async () => {
    db = await (0, database_init_1.default)('group_service_serial', no_logger_1.default);
    stores = db.stores;
    user = await stores.userStore.insert({
        name: 'Some Name',
        email: 'test@getunleash.io',
    });
    const config = (0, test_config_1.createTestConfig)({
        getLogger: no_logger_1.default,
    });
    groupService = new group_service_1.GroupService(stores, config);
    groupStore = stores.groupStore;
    await stores.groupStore.create({
        name: 'dev_group',
        description: 'dev_group',
        mappingsSSO: ['dev'],
    });
    await stores.groupStore.create({
        name: 'maintainer_group',
        description: 'maintainer_group',
        mappingsSSO: ['maintainer'],
    });
    await stores.groupStore.create({
        name: 'admin_group',
        description: 'admin_group',
        mappingsSSO: ['admin'],
    });
});
afterAll(async () => {
    await db.destroy();
});
afterEach(async () => { });
test('should have three group', async () => {
    const project = await groupService.getAll();
    expect(project.length).toBe(3);
});
test('should add person to 2 groups', async () => {
    await groupService.syncExternalGroups(user.id, ['dev', 'maintainer']);
    const groups = await groupService.getGroupsForUser(user.id);
    expect(groups.length).toBe(2);
});
test('should remove person from one group', async () => {
    await groupService.syncExternalGroups(user.id, ['maintainer']);
    const groups = await groupService.getGroupsForUser(user.id);
    expect(groups.length).toBe(1);
    expect(groups[0].name).toEqual('maintainer_group');
});
test('should add person to completely new group with new name', async () => {
    await groupService.syncExternalGroups(user.id, ['dev']);
    const groups = await groupService.getGroupsForUser(user.id);
    expect(groups.length).toBe(1);
    expect(groups[0].name).toEqual('dev_group');
});
test('should not update groups when not string array ', async () => {
    await groupService.syncExternalGroups(user.id, 'Everyone');
    const groups = await groupService.getGroupsForUser(user.id);
    expect(groups.length).toBe(1);
    expect(groups[0].name).toEqual('dev_group');
});
test('should clear groups when empty array ', async () => {
    await groupService.syncExternalGroups(user.id, []);
    const groups = await groupService.getGroupsForUser(user.id);
    expect(groups.length).toBe(0);
});
test('should not remove user from no SSO definition group', async () => {
    const group = await groupStore.create({
        name: 'no_mapping_group',
        description: 'no_mapping_group',
    });
    await groupStore.addUserToGroups(user.id, [group.id]);
    await groupService.syncExternalGroups(user.id, []);
    const groups = await groupService.getGroupsForUser(user.id);
    expect(groups.length).toBe(1);
    expect(groups[0].name).toEqual('no_mapping_group');
});
test('adding a root role to a group with a project role should fail', async () => {
    const group = await groupStore.create({
        name: 'root_group',
        description: 'root_group',
    });
    await stores.accessStore.addGroupToRole(group.id, 1, 'test', 'default');
    await expect(() => {
        return groupService.updateGroup({
            id: group.id,
            name: group.name,
            users: [],
            rootRole: 1,
            createdAt: new Date(),
            createdBy: 'test',
        }, 'test');
    }).rejects.toThrow('This group already has a project role and cannot also be given a root role');
    expect.assertions(1);
});
test('adding a nonexistent role to a group should fail', async () => {
    const group = await groupStore.create({
        name: 'root_group',
        description: 'root_group',
    });
    await expect(() => {
        return groupService.updateGroup({
            id: group.id,
            name: group.name,
            users: [],
            rootRole: 100,
            createdAt: new Date(),
            createdBy: 'test',
        }, 'test');
    }).rejects.toThrow('Request validation failed: your request body or params contain invalid data: Incorrect role id 100');
});
//# sourceMappingURL=group-service.e2e.test.js.map