"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyRepository = void 0;
const events_1 = __importDefault(require("events"));
const offline_unleash_client_1 = require("../features/playground/offline-unleash-client");
const constants_1 = require("../util/constants");
const unleash_client_1 = require("unleash-client");
const configuration_revision_service_1 = require("../features/feature-toggle/configuration-revision-service");
class ProxyRepository extends events_1.default {
    constructor(config, stores, services, token) {
        super();
        this.config = config;
        this.logger = config.getLogger('proxy-repository.ts');
        this.stores = stores;
        this.services = services;
        this.configurationRevisionService =
            services.configurationRevisionService;
        this.token = token;
        this.onAnyEvent = this.onAnyEvent.bind(this);
        this.interval = config.frontendApi.refreshIntervalInMs;
    }
    getSegment(id) {
        return this.segments.find((segment) => segment.id === id);
    }
    getToggle(name) {
        //@ts-ignore (we must update the node SDK to allow undefined)
        return this.features.find((feature) => feature.name === name);
    }
    getToggles() {
        return this.features;
    }
    async start() {
        this.running = true;
        await this.dataPolling();
        // Reload cached token data whenever something relevant has changed.
        // For now, simply reload all the data on any EventStore event.
        this.configurationRevisionService.on(configuration_revision_service_1.UPDATE_REVISION, this.onAnyEvent);
        this.emit(unleash_client_1.UnleashEvents.Ready);
        this.emit(unleash_client_1.UnleashEvents.Changed);
    }
    stop() {
        this.configurationRevisionService.off(configuration_revision_service_1.UPDATE_REVISION, this.onAnyEvent);
        this.running = false;
    }
    async dataPolling() {
        this.timer = setTimeout(async () => {
            if (!this.running) {
                clearTimeout(this.timer);
                this.timer = null;
                this.logger.debug('Shutting down data polling for proxy repository');
                return;
            }
            await this.dataPolling();
        }, this.randomizeDelay(this.interval, this.interval * 2)).unref();
        await this.loadDataForToken();
    }
    async loadDataForToken() {
        try {
            this.features = await this.featuresForToken();
            this.segments = await this.segmentsForToken();
        }
        catch (e) {
            this.logger.error(e);
        }
    }
    randomizeDelay(floor, ceiling) {
        return Math.floor(Math.random() * (ceiling - floor) + floor);
    }
    async onAnyEvent() {
        try {
            await this.loadDataForToken();
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    async featuresForToken() {
        return (0, offline_unleash_client_1.mapFeaturesForClient)(await this.services.featureToggleServiceV2.getClientFeatures({
            project: await this.projectIdsForToken(),
            environment: this.environmentNameForToken(),
        }));
    }
    async segmentsForToken() {
        return (0, offline_unleash_client_1.mapSegmentsForClient)(await this.services.segmentService.getAll());
    }
    async projectIdsForToken() {
        if (this.token.projects.includes(constants_1.ALL_PROJECTS)) {
            const allProjects = await this.stores.projectStore.getAll();
            return allProjects.map((project) => project.id);
        }
        return this.token.projects;
    }
    environmentNameForToken() {
        if (this.token.environment === constants_1.ALL_ENVS) {
            return 'default';
        }
        return this.token.environment;
    }
}
exports.ProxyRepository = ProxyRepository;
//# sourceMappingURL=proxy-repository.js.map