"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = require("joi");
const no_logger_1 = __importDefault(require("../../test/fixtures/no-logger"));
const tag_type_service_1 = __importDefault(require("./tag-type-service"));
const events_1 = require("../types/events");
const store_1 = __importDefault(require("../../test/fixtures/store"));
const addon_service_1 = __importDefault(require("./addon-service"));
const addon_service_test_simple_addon_1 = __importDefault(require("./addon-service-test-simple-addon"));
const MASKED_VALUE = '*****';
let addonProvider;
function getSetup() {
    const stores = (0, store_1.default)();
    const tagTypeService = new tag_type_service_1.default(stores, { getLogger: no_logger_1.default });
    addonProvider = { simple: new addon_service_test_simple_addon_1.default() };
    return {
        addonService: new addon_service_1.default(stores, {
            getLogger: no_logger_1.default,
            // @ts-ignore
            server: { unleashUrl: 'http://test' },
        }, tagTypeService, addonProvider),
        stores,
        tagTypeService,
    };
}
test('should load addon configurations', async () => {
    const { addonService } = getSetup();
    const configs = await addonService.getAddons();
    expect(configs.length).toBe(0);
});
test('should load provider definitions', async () => {
    const { addonService } = getSetup();
    const providerDefinitions = addonService.getProviderDefinitions();
    const simple = providerDefinitions.find((p) => p.name === 'simple');
    expect(providerDefinitions.length).toBe(1);
    expect(simple.name).toBe('simple');
});
test('should not allow addon-config for unknown provider', async () => {
    const { addonService } = getSetup();
    await expect(async () => {
        await addonService.createAddon({
            provider: 'unknown',
            enabled: true,
            parameters: {},
            events: [],
            description: '',
        }, 'test');
    }).rejects.toThrow(joi_1.ValidationError);
});
test('should trigger simple-addon eventHandler', async () => {
    const { addonService, stores } = getSetup();
    const config = {
        provider: 'simple',
        enabled: true,
        parameters: {
            url: 'http://localhost/wh',
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
        description: '',
    };
    await addonService.createAddon(config, 'me@mail.com');
    // Feature toggle was created
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        data: {
            name: 'some-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    const simpleProvider = addonService.addonProviders.simple;
    // @ts-ignore
    const events = simpleProvider.getEvents();
    expect(events.length).toBe(1);
    expect(events[0].event.type).toBe(events_1.FEATURE_CREATED);
    expect(events[0].event.data.name).toBe('some-toggle');
});
test('should not trigger event handler if project of event is different from addon', async () => {
    const { addonService, stores } = getSetup();
    const config = {
        provider: 'simple',
        enabled: true,
        events: [events_1.FEATURE_CREATED],
        projects: ['someproject'],
        description: '',
        parameters: {
            url: 'http://localhost:wh',
        },
    };
    await addonService.createAddon(config, 'me@mail.com');
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: 'someotherproject',
        data: {
            name: 'some-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    const simpleProvider = addonService.addonProviders.simple;
    // @ts-expect-error
    const events = simpleProvider.getEvents();
    expect(events.length).toBe(0);
});
test('should trigger event handler if project for event is one of the desired projects for addon', async () => {
    const { addonService, stores } = getSetup();
    const desiredProject = 'desired';
    const otherProject = 'other';
    const config = {
        provider: 'simple',
        enabled: true,
        events: [events_1.FEATURE_CREATED],
        projects: [desiredProject],
        description: '',
        parameters: {
            url: 'http://localhost:wh',
        },
    };
    await addonService.createAddon(config, 'me@mail.com');
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: desiredProject,
        data: {
            name: 'some-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: otherProject,
        data: {
            name: 'other-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    const simpleProvider = addonService.addonProviders.simple;
    // @ts-expect-error
    const events = simpleProvider.getEvents();
    expect(events.length).toBe(1);
    expect(events[0].event.type).toBe(events_1.FEATURE_CREATED);
    expect(events[0].event.data.name).toBe('some-toggle');
});
test('should trigger events for multiple projects if addon is setup to filter multiple projects', async () => {
    const { addonService, stores } = getSetup();
    const desiredProjects = ['desired', 'desired2'];
    const otherProject = 'other';
    const config = {
        provider: 'simple',
        enabled: true,
        events: [events_1.FEATURE_CREATED],
        projects: desiredProjects,
        description: '',
        parameters: {
            url: 'http://localhost:wh',
        },
    };
    await addonService.createAddon(config, 'me@mail.com');
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: desiredProjects[0],
        data: {
            name: 'some-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: otherProject,
        data: {
            name: 'other-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: desiredProjects[1],
        data: {
            name: 'third-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    const simpleProvider = addonService.addonProviders.simple;
    // @ts-expect-error
    const events = simpleProvider.getEvents();
    expect(events.length).toBe(2);
    expect(events[0].event.type).toBe(events_1.FEATURE_CREATED);
    expect(events[0].event.data.name).toBe('some-toggle');
    expect(events[1].event.type).toBe(events_1.FEATURE_CREATED);
    expect(events[1].event.data.name).toBe('third-toggle');
});
test('should filter events on environment if addon is setup to filter for it', async () => {
    const { addonService, stores } = getSetup();
    const desiredEnvironment = 'desired';
    const otherEnvironment = 'other';
    const config = {
        provider: 'simple',
        enabled: true,
        events: [events_1.FEATURE_CREATED],
        projects: [],
        environments: [desiredEnvironment],
        description: '',
        parameters: {
            url: 'http://localhost:wh',
        },
    };
    await addonService.createAddon(config, 'me@mail.com');
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: desiredEnvironment,
        environment: desiredEnvironment,
        data: {
            name: 'some-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        environment: otherEnvironment,
        data: {
            name: 'other-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    const simpleProvider = addonService.addonProviders.simple;
    // @ts-expect-error
    const events = simpleProvider.getEvents();
    expect(events.length).toBe(1);
    expect(events[0].event.type).toBe(events_1.FEATURE_CREATED);
    expect(events[0].event.data.name).toBe('some-toggle');
});
test('should support wildcard option for filtering addons', async () => {
    const { addonService, stores } = getSetup();
    const desiredProjects = ['desired', 'desired2'];
    const otherProject = 'other';
    const config = {
        provider: 'simple',
        enabled: true,
        events: [events_1.FEATURE_CREATED],
        projects: ['*'],
        description: '',
        parameters: {
            url: 'http://localhost:wh',
        },
    };
    await addonService.createAddon(config, 'me@mail.com');
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: desiredProjects[0],
        data: {
            name: 'some-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: otherProject,
        data: {
            name: 'other-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: desiredProjects[1],
        data: {
            name: 'third-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    const simpleProvider = addonService.addonProviders.simple;
    // @ts-expect-error
    const events = simpleProvider.getEvents();
    expect(events).toHaveLength(3);
    expect(events[0].event.type).toBe(events_1.FEATURE_CREATED);
    expect(events[0].event.data.name).toBe('some-toggle');
    expect(events[1].event.type).toBe(events_1.FEATURE_CREATED);
    expect(events[1].event.data.name).toBe('other-toggle');
    expect(events[2].event.type).toBe(events_1.FEATURE_CREATED);
    expect(events[2].event.data.name).toBe('third-toggle');
});
test('Should support filtering by both project and environment', async () => {
    const { addonService, stores } = getSetup();
    const desiredProjects = ['desired1', 'desired2', 'desired3'];
    const desiredEnvironments = ['env1', 'env2', 'env3'];
    const config = {
        provider: 'simple',
        enabled: true,
        events: [events_1.FEATURE_CREATED],
        projects: desiredProjects,
        environments: desiredEnvironments,
        description: '',
        parameters: {
            url: 'http://localhost:wh',
        },
    };
    const expectedFeatureNames = [
        'desired-toggle1',
        'desired-toggle2',
        'desired-toggle3',
    ];
    await addonService.createAddon(config, 'me@mail.com');
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: desiredProjects[0],
        environment: desiredEnvironments[0],
        data: {
            name: expectedFeatureNames[0],
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: desiredProjects[0],
        environment: 'wrongenvironment',
        data: {
            name: 'other-toggle',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: desiredProjects[2],
        environment: desiredEnvironments[1],
        data: {
            name: expectedFeatureNames[1],
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: desiredProjects[2],
        environment: desiredEnvironments[2],
        data: {
            name: expectedFeatureNames[2],
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    await stores.eventStore.store({
        type: events_1.FEATURE_CREATED,
        createdBy: 'some@user.com',
        project: 'wrongproject',
        environment: desiredEnvironments[0],
        data: {
            name: 'not-expected',
            enabled: false,
            strategies: [{ name: 'default' }],
        },
    });
    const simpleProvider = addonService.addonProviders.simple;
    // @ts-expect-error
    const events = simpleProvider.getEvents();
    expect(events.length).toBe(3);
    expect(events[0].event.type).toBe(events_1.FEATURE_CREATED);
    expect(events[0].event.data.name).toBe(expectedFeatureNames[0]);
    expect(events[1].event.type).toBe(events_1.FEATURE_CREATED);
    expect(events[1].event.data.name).toBe(expectedFeatureNames[1]);
    expect(events[2].event.type).toBe(events_1.FEATURE_CREATED);
    expect(events[2].event.data.name).toBe(expectedFeatureNames[2]);
});
test('should create simple-addon config', async () => {
    const { addonService } = getSetup();
    const config = {
        provider: 'simple',
        enabled: true,
        parameters: {
            url: 'http://localhost/wh',
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
        description: '',
    };
    await addonService.createAddon(config, 'me@mail.com');
    const addons = await addonService.getAddons();
    expect(addons.length).toBe(1);
    expect(addons[0].provider).toBe('simple');
});
test('should create tag type for simple-addon', async () => {
    const { addonService, tagTypeService } = getSetup();
    const config = {
        provider: 'simple',
        enabled: true,
        parameters: {
            url: 'http://localhost/wh',
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
        description: '',
    };
    await addonService.createAddon(config, 'me@mail.com');
    const tagType = await tagTypeService.getTagType('me');
    expect(tagType.name).toBe('me');
});
test('should store ADDON_CONFIG_CREATE event', async () => {
    const { addonService, stores } = getSetup();
    const config = {
        provider: 'simple',
        enabled: true,
        parameters: {
            url: 'http://localhost/wh',
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
        description: '',
    };
    await addonService.createAddon(config, 'me@mail.com');
    const events = await stores.eventStore.getEvents();
    expect(events.length).toBe(2); // Also tag-types where created
    expect(events[1].type).toBe(events_1.ADDON_CONFIG_CREATED);
    expect(events[1].data.provider).toBe('simple');
});
test('should store ADDON_CONFIG_UPDATE event', async () => {
    const { addonService, stores } = getSetup();
    const config = {
        description: '',
        provider: 'simple',
        enabled: true,
        parameters: {
            url: 'http://localhost/wh',
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
    };
    const addonConfig = await addonService.createAddon(config, 'me@mail.com');
    const updated = { ...addonConfig, description: 'test' };
    await addonService.updateAddon(addonConfig.id, updated, 'me@mail.com');
    const events = await stores.eventStore.getEvents();
    expect(events.length).toBe(3);
    expect(events[2].type).toBe(events_1.ADDON_CONFIG_UPDATED);
    expect(events[2].data.provider).toBe('simple');
});
test('should store ADDON_CONFIG_REMOVE event', async () => {
    const { addonService, stores } = getSetup();
    const config = {
        provider: 'simple',
        description: '',
        enabled: true,
        parameters: {
            url: 'http://localhost/wh',
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
    };
    const addonConfig = await addonService.createAddon(config, 'me@mail.com');
    await addonService.removeAddon(addonConfig.id, 'me@mail.com');
    const events = await stores.eventStore.getEvents();
    expect(events.length).toBe(3);
    expect(events[2].type).toBe(events_1.ADDON_CONFIG_DELETED);
    expect(events[2].data.id).toBe(addonConfig.id);
});
test('should hide sensitive fields when fetching', async () => {
    const { addonService } = getSetup();
    const config = {
        provider: 'simple',
        enabled: true,
        description: '',
        parameters: {
            url: 'http://localhost/wh',
            var: 'some-value',
            sensitiveParam: 'should be hidden when fetching',
        },
        events: [events_1.FEATURE_CREATED],
    };
    const createdConfig = await addonService.createAddon(config, 'me@mail.com');
    const addons = await addonService.getAddons();
    const addonRetrieved = await addonService.getAddon(createdConfig.id);
    expect(addons.length).toBe(1);
    // @ts-ignore
    expect(addons[0].parameters.sensitiveParam).toBe(MASKED_VALUE);
    // @ts-ignore
    expect(addonRetrieved.parameters.sensitiveParam).toBe(MASKED_VALUE);
});
test('should not overwrite masked values when updating', async () => {
    const { addonService, stores } = getSetup();
    const config = {
        provider: 'simple',
        enabled: true,
        parameters: {
            url: 'http://localhost/wh',
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
        description: '',
    };
    const addonConfig = await addonService.createAddon(config, 'me@mail.com');
    const updated = {
        ...addonConfig,
        parameters: { url: MASKED_VALUE, var: 'some-new-value' },
        description: 'test',
    };
    await addonService.updateAddon(addonConfig.id, updated, 'me@mail.com');
    const updatedConfig = await stores.addonStore.get(addonConfig.id);
    // @ts-ignore
    expect(updatedConfig.parameters.url).toBe('http://localhost/wh');
    // @ts-ignore
    expect(updatedConfig.parameters.var).toBe('some-new-value');
});
test('should reject addon config with missing required parameter when creating', async () => {
    const { addonService } = getSetup();
    const config = {
        provider: 'simple',
        enabled: true,
        parameters: {
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
        description: '',
    };
    await expect(async () => addonService.createAddon(config, 'me@mail.com')).rejects.toThrow(joi_1.ValidationError);
});
test('should reject updating addon config with missing required parameter', async () => {
    const { addonService } = getSetup();
    const addonConfig = {
        provider: 'simple',
        enabled: true,
        parameters: {
            url: 'https://some.site/api',
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
        description: '',
    };
    const config = await addonService.createAddon(addonConfig, 'me@mail.com');
    const updated = {
        ...config,
        parameters: { var: 'some-new-value' },
        description: 'test',
    };
    await expect(async () => addonService.updateAddon(config.id, updated, 'me@mail.com')).rejects.toThrow(joi_1.ValidationError);
});
test('Should reject addon config if a required parameter is just the empty string', async () => {
    const { addonService } = getSetup();
    const config = {
        provider: 'simple',
        enabled: true,
        parameters: {
            url: '',
            var: 'some-value',
        },
        events: [events_1.FEATURE_CREATED],
        description: '',
    };
    await expect(async () => addonService.createAddon(config, 'me@mail.com')).rejects.toThrow(joi_1.ValidationError);
});
//# sourceMappingURL=addon-service.test.js.map