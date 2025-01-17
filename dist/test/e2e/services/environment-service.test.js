"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_service_1 = __importDefault(require("../../../lib/services/environment-service"));
const test_config_1 = require("../../config/test-config");
const database_init_1 = __importDefault(require("../helpers/database-init"));
const notfound_error_1 = __importDefault(require("../../../lib/error/notfound-error"));
const name_exists_error_1 = __importDefault(require("../../../lib/error/name-exists-error"));
let stores;
let db;
let service;
beforeAll(async () => {
    const config = (0, test_config_1.createTestConfig)();
    db = await (0, database_init_1.default)('environment_service_serial', config.getLogger);
    stores = db.stores;
    service = new environment_service_1.default(stores, config);
});
afterAll(async () => {
    await db.destroy();
});
test('Can get environment', async () => {
    const created = await db.stores.environmentStore.create({
        name: 'testenv',
        type: 'production',
    });
    const retrieved = await service.get('testenv');
    expect(retrieved).toEqual(created);
});
test('Can get all', async () => {
    await db.stores.environmentStore.create({
        name: 'testenv2',
        type: 'production',
    });
    const environments = await service.getAll();
    expect(environments).toHaveLength(3); // the one we created plus 'default'
});
test('Can connect environment to project', async () => {
    await db.stores.environmentStore.create({
        name: 'test-connection',
        type: 'production',
    });
    await stores.featureToggleStore.create('default', {
        name: 'test-connection',
        type: 'release',
        description: '',
        stale: false,
    });
    await service.addEnvironmentToProject('test-connection', 'default');
    const overview = await stores.featureStrategiesStore.getFeatureOverview({
        projectId: 'default',
    });
    overview.forEach((f) => {
        expect(f.environments).toEqual([
            {
                name: 'test-connection',
                enabled: false,
                sortOrder: 9999,
                type: 'production',
                variantCount: 0,
                lastSeenAt: null,
            },
        ]);
    });
});
test('Can remove environment from project', async () => {
    await db.stores.environmentStore.create({
        name: 'removal-test',
        type: 'production',
    });
    await stores.featureToggleStore.create('default', {
        name: 'removal-test',
    });
    await service.removeEnvironmentFromProject('test-connection', 'default');
    await service.addEnvironmentToProject('removal-test', 'default');
    let overview = await stores.featureStrategiesStore.getFeatureOverview({
        projectId: 'default',
    });
    expect(overview.length).toBeGreaterThan(0);
    overview.forEach((f) => {
        expect(f.environments).toEqual([
            {
                name: 'removal-test',
                enabled: false,
                sortOrder: 9999,
                type: 'production',
                variantCount: 0,
                lastSeenAt: null,
            },
        ]);
    });
    await service.removeEnvironmentFromProject('removal-test', 'default');
    overview = await stores.featureStrategiesStore.getFeatureOverview({
        projectId: 'default',
    });
    expect(overview.length).toBeGreaterThan(0);
    overview.forEach((o) => {
        expect(o.environments).toEqual([]);
    });
});
test('Adding same environment twice should throw a NameExistsError', async () => {
    await db.stores.environmentStore.create({
        name: 'uniqueness-test',
        type: 'production',
    });
    await service.addEnvironmentToProject('uniqueness-test', 'default');
    await service.removeEnvironmentFromProject('test-connection', 'default');
    await service.removeEnvironmentFromProject('removal-test', 'default');
    return expect(async () => service.addEnvironmentToProject('uniqueness-test', 'default')).rejects.toThrow(new name_exists_error_1.default('default already has the environment uniqueness-test enabled'));
});
test('Removing environment not connected to project should be a noop', async () => expect(async () => service.removeEnvironmentFromProject('some-non-existing-environment', 'default')).resolves);
test('Trying to get an environment that does not exist throws NotFoundError', async () => {
    const envName = 'this-should-not-exist';
    await expect(async () => service.get(envName)).rejects.toThrow(new notfound_error_1.default(`Could not find environment with name: ${envName}`));
});
test('Setting an override disables all other envs', async () => {
    const enabledEnvName = 'should-get-enabled';
    const disabledEnvName = 'should-get-disabled';
    await db.stores.environmentStore.create({
        name: disabledEnvName,
        type: 'production',
    });
    await db.stores.environmentStore.create({
        name: enabledEnvName,
        type: 'production',
    });
    //Set these to the wrong state so we can assert that overriding them flips their state
    await service.toggleEnvironment(disabledEnvName, true);
    await service.toggleEnvironment(enabledEnvName, false);
    await service.overrideEnabledProjects([enabledEnvName]);
    const environments = await service.getAll();
    const targetedEnvironment = environments.find((env) => env.name == enabledEnvName);
    const allOtherEnvironments = environments
        .filter((x) => x.name != enabledEnvName)
        .map((env) => env.enabled);
    expect(targetedEnvironment?.enabled).toBe(true);
    expect(allOtherEnvironments.every((x) => !x)).toBe(true);
});
test('Passing an empty override does nothing', async () => {
    const enabledEnvName = 'should-be-enabled';
    await db.stores.environmentStore.create({
        name: enabledEnvName,
        type: 'production',
    });
    await service.toggleEnvironment(enabledEnvName, true);
    await service.overrideEnabledProjects([]);
    const environments = await service.getAll();
    const targetedEnvironment = environments.find((env) => env.name == enabledEnvName);
    expect(targetedEnvironment?.enabled).toBe(true);
});
test('When given overrides should remap projects to override environments', async () => {
    const enabledEnvName = 'enabled';
    const ignoredEnvName = 'ignored';
    const disabledEnvName = 'disabled';
    const toggleName = 'test-toggle';
    await db.stores.environmentStore.create({
        name: enabledEnvName,
        type: 'production',
    });
    await db.stores.environmentStore.create({
        name: ignoredEnvName,
        type: 'production',
    });
    await db.stores.environmentStore.create({
        name: disabledEnvName,
        type: 'production',
    });
    await service.toggleEnvironment(disabledEnvName, true);
    await service.toggleEnvironment(ignoredEnvName, true);
    await service.toggleEnvironment(enabledEnvName, false);
    await stores.featureToggleStore.create('default', {
        name: toggleName,
        type: 'release',
        description: '',
        stale: false,
    });
    await service.addEnvironmentToProject(disabledEnvName, 'default');
    await service.overrideEnabledProjects([enabledEnvName]);
    const projects = (await stores.projectStore.getEnvironmentsForProject('default')).map((e) => e.environment);
    expect(projects).toContain('enabled');
    expect(projects).not.toContain('default');
});
test('Override works correctly when enabling default and disabling prod and dev', async () => {
    const defaultEnvironment = 'default';
    const prodEnvironment = 'production';
    const devEnvironment = 'development';
    await db.stores.environmentStore.create({
        name: prodEnvironment,
        type: 'production',
    });
    await db.stores.environmentStore.create({
        name: devEnvironment,
        type: 'development',
    });
    await service.toggleEnvironment(prodEnvironment, true);
    await service.toggleEnvironment(devEnvironment, true);
    await service.overrideEnabledProjects([defaultEnvironment]);
    const environments = await service.getAll();
    const targetedEnvironment = environments.find((env) => env.name == defaultEnvironment);
    const allOtherEnvironments = environments
        .filter((x) => x.name != defaultEnvironment)
        .map((env) => env.enabled);
    const envNames = environments.map((x) => x.name);
    expect(envNames).toContain('production');
    expect(envNames).toContain('development');
    expect(targetedEnvironment?.enabled).toBe(true);
    expect(allOtherEnvironments.every((x) => !x)).toBe(true);
});
//# sourceMappingURL=environment-service.test.js.map