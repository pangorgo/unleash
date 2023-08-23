"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nock_1 = __importDefault(require("nock"));
const store_1 = __importDefault(require("../../test/fixtures/store"));
const version_1 = __importDefault(require("../util/version"));
const no_logger_1 = __importDefault(require("../../test/fixtures/no-logger"));
const version_service_1 = __importDefault(require("./version-service"));
const uuid_1 = require("uuid");
const random_id_1 = require("../util/random-id");
beforeAll(() => {
    nock_1.default.disableNetConnect();
});
afterAll(() => {
    nock_1.default.enableNetConnect();
});
test('yields current versions', async () => {
    const url = `https://${(0, random_id_1.randomId)()}.example.com`;
    const stores = (0, store_1.default)();
    await stores.settingStore.insert('instanceInfo', { id: '1234abc' });
    const latest = {
        oss: '5.0.0',
        enterprise: '5.0.0',
    };
    const scope = (0, nock_1.default)(url)
        .post('/')
        .reply(() => [
        200,
        JSON.stringify({
            latest: false,
            versions: latest,
        }),
    ]);
    const service = new version_service_1.default(stores, {
        getLogger: no_logger_1.default,
        versionCheck: { url, enable: true },
        telemetry: true,
    });
    await service.checkLatestVersion();
    const versionInfo = service.getVersionInfo();
    expect(scope.isDone()).toEqual(true);
    expect(versionInfo.current.oss).toBe(version_1.default);
    expect(versionInfo.current.enterprise).toBeFalsy();
    expect(versionInfo.latest.oss).toBe(latest.oss);
    expect(versionInfo.latest.enterprise).toBe(latest.enterprise);
});
test('supports setting enterprise version as well', async () => {
    const url = `https://${(0, random_id_1.randomId)()}.example.com`;
    const stores = (0, store_1.default)();
    const enterpriseVersion = '3.7.0';
    await stores.settingStore.insert('instanceInfo', { id: '1234abc' });
    const latest = {
        oss: '4.0.0',
        enterprise: '4.0.0',
    };
    const scope = (0, nock_1.default)(url)
        .post('/')
        .reply(() => [
        200,
        JSON.stringify({
            latest: false,
            versions: latest,
        }),
    ]);
    const service = new version_service_1.default(stores, {
        getLogger: no_logger_1.default,
        versionCheck: { url, enable: true },
        enterpriseVersion,
        telemetry: true,
    });
    await service.checkLatestVersion();
    const versionInfo = service.getVersionInfo();
    expect(scope.isDone()).toEqual(true);
    expect(versionInfo.current.oss).toBe(version_1.default);
    expect(versionInfo.current.enterprise).toBe(enterpriseVersion);
    expect(versionInfo.latest.oss).toBe(latest.oss);
    expect(versionInfo.latest.enterprise).toBe(latest.enterprise);
});
test('if version check is not enabled should not make any calls', async () => {
    const url = `https://${(0, random_id_1.randomId)()}.example.com`;
    const stores = (0, store_1.default)();
    const enterpriseVersion = '3.7.0';
    await stores.settingStore.insert('instanceInfo', { id: '1234abc' });
    const latest = {
        oss: '4.0.0',
        enterprise: '4.0.0',
    };
    const scope = (0, nock_1.default)(url)
        .get('/')
        .reply(() => [
        200,
        JSON.stringify({
            latest: false,
            versions: latest,
        }),
    ]);
    const service = new version_service_1.default(stores, {
        getLogger: no_logger_1.default,
        versionCheck: { url, enable: false },
        enterpriseVersion,
        telemetry: true,
    });
    await service.checkLatestVersion();
    const versionInfo = service.getVersionInfo();
    expect(scope.isDone()).toEqual(false);
    expect(versionInfo.current.oss).toBe(version_1.default);
    expect(versionInfo.current.enterprise).toBe(enterpriseVersion);
    expect(versionInfo.latest.oss).toBeFalsy();
    expect(versionInfo.latest.enterprise).toBeFalsy();
    nock_1.default.cleanAll();
});
test('sets featureinfo', async () => {
    const url = `https://${(0, random_id_1.randomId)()}.example.com`;
    const stores = (0, store_1.default)();
    const enterpriseVersion = '4.0.0';
    await stores.settingStore.insert('instanceInfo', { id: '1234abc' });
    const latest = {
        oss: '4.0.0',
        enterprise: '4.0.0',
    };
    const scope = (0, nock_1.default)(url)
        .post('/', (body) => body.featureInfo &&
        body.featureInfo.featureToggles === 0 &&
        body.featureInfo.environments === 0)
        .reply(() => [
        200,
        JSON.stringify({
            latest: true,
            versions: latest,
        }),
    ]);
    const service = new version_service_1.default(stores, {
        getLogger: no_logger_1.default,
        versionCheck: { url, enable: true },
        enterpriseVersion,
        telemetry: true,
    });
    await service.checkLatestVersion();
    expect(scope.isDone()).toEqual(true);
    nock_1.default.cleanAll();
});
test('counts toggles', async () => {
    const url = `https://${(0, random_id_1.randomId)()}.example.com`;
    const stores = (0, store_1.default)();
    const enterpriseVersion = '4.0.0';
    await stores.settingStore.insert('instanceInfo', { id: '1234abc' });
    await stores.settingStore.insert('unleash.enterprise.auth.oidc', {
        enabled: true,
    });
    await stores.featureToggleStore.create('project', { name: (0, uuid_1.v4)() });
    await stores.strategyStore.createStrategy({
        name: (0, uuid_1.v4)(),
        editable: true,
    });
    const latest = {
        oss: '4.0.0',
        enterprise: '4.0.0',
    };
    const scope = (0, nock_1.default)(url)
        .post('/', (body) => body.featureInfo &&
        body.featureInfo.featureToggles === 1 &&
        body.featureInfo.environments === 0 &&
        body.featureInfo.customStrategies === 1 &&
        body.featureInfo.customStrategiesInUse === 3 &&
        body.featureInfo.OIDCenabled)
        .reply(() => [
        200,
        JSON.stringify({
            latest: true,
            versions: latest,
        }),
    ]);
    const service = new version_service_1.default(stores, {
        getLogger: no_logger_1.default,
        versionCheck: { url, enable: true },
        enterpriseVersion,
        telemetry: true,
    });
    await service.checkLatestVersion();
    expect(scope.isDone()).toEqual(true);
    nock_1.default.cleanAll();
});
test('counts custom strategies', async () => {
    const url = `https://${(0, random_id_1.randomId)()}.example.com`;
    const stores = (0, store_1.default)();
    const enterpriseVersion = '4.0.0';
    const strategyName = (0, uuid_1.v4)();
    const toggleName = (0, uuid_1.v4)();
    await stores.settingStore.insert('instanceInfo', { id: '1234abc' });
    await stores.settingStore.insert('unleash.enterprise.auth.oidc', {
        enabled: true,
    });
    await stores.featureToggleStore.create('project', { name: toggleName });
    await stores.strategyStore.createStrategy({
        name: strategyName,
        editable: true,
    });
    await stores.strategyStore.createStrategy({
        name: (0, uuid_1.v4)(),
        editable: true,
    });
    await stores.featureStrategiesStore.createStrategyFeatureEnv({
        featureName: toggleName,
        projectId: 'project',
        environment: 'default',
        strategyName: strategyName,
        parameters: {},
        constraints: [],
    });
    const latest = {
        oss: '4.0.0',
        enterprise: '4.0.0',
    };
    const scope = (0, nock_1.default)(url)
        .post('/', (body) => body.featureInfo &&
        body.featureInfo.featureToggles === 1 &&
        body.featureInfo.environments === 0 &&
        body.featureInfo.customStrategies === 2 &&
        body.featureInfo.customStrategiesInUse === 3 &&
        body.featureInfo.OIDCenabled)
        .reply(() => [
        200,
        JSON.stringify({
            latest: true,
            versions: latest,
        }),
    ]);
    const service = new version_service_1.default(stores, {
        getLogger: no_logger_1.default,
        versionCheck: { url, enable: true },
        enterpriseVersion,
        telemetry: true,
    });
    await service.checkLatestVersion();
    expect(scope.isDone()).toEqual(true);
    nock_1.default.cleanAll();
});
//# sourceMappingURL=version-service.test.js.map