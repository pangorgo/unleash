"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyService = void 0;
const unleash_client_1 = require("unleash-client");
const proxy_1 = require("../proxy");
const api_token_1 = require("../types/models/api-token");
const frontend_settings_1 = require("../types/settings/frontend-settings");
const util_1 = require("../util");
const error_1 = require("../error");
const date_fns_1 = require("date-fns");
class ProxyService {
    constructor(config, stores, services) {
        /**
         * This is intentionally a Promise becasue we want to be able to await
         * until the client (which might be being created by a different request) is ready
         * Check this test that fails if we don't use a Promise: src/test/e2e/api/proxy/proxy.concurrency.e2e.test.ts
         */
        this.clients = new Map();
        this.config = config;
        this.logger = config.getLogger('services/proxy-service.ts');
        this.stores = stores;
        this.services = services;
        this.timer = setInterval(() => this.fetchFrontendSettings(), (0, date_fns_1.minutesToMilliseconds)(2)).unref();
    }
    async getProxyFeatures(token, context) {
        const client = await this.clientForProxyToken(token);
        const definitions = client.getFeatureToggleDefinitions() || [];
        return definitions
            .filter((feature) => client.isEnabled(feature.name, context))
            .map((feature) => ({
            name: feature.name,
            enabled: Boolean(feature.enabled),
            variant: client.forceGetVariant(feature.name, context),
            impressionData: Boolean(feature.impressionData),
        }));
    }
    async registerProxyMetrics(token, metrics, ip) {
        ProxyService.assertExpectedTokenType(token);
        const environment = this.services.clientMetricsServiceV2.resolveMetricsEnvironment(token, metrics);
        await this.services.clientMetricsServiceV2.registerClientMetrics({ ...metrics, environment }, ip);
    }
    async clientForProxyToken(token) {
        ProxyService.assertExpectedTokenType(token);
        let client = this.clients.get(token.secret);
        if (!client) {
            client = this.createClientForProxyToken(token);
            this.clients.set(token.secret, client);
        }
        return client;
    }
    async createClientForProxyToken(token) {
        const repository = new proxy_1.ProxyRepository(this.config, this.stores, this.services, token);
        const client = new unleash_client_1.Unleash({
            appName: 'proxy',
            url: 'unused',
            storageProvider: new unleash_client_1.InMemStorageProvider(),
            disableMetrics: true,
            repository,
        });
        client.on(unleash_client_1.UnleashEvents.Error, (error) => {
            this.logger.error(error);
        });
        await client.start();
        return client;
    }
    async deleteClientForProxyToken(secret) {
        let clientPromise = this.clients.get(secret);
        if (clientPromise) {
            const client = await clientPromise;
            client.destroy();
            this.clients.delete(secret);
        }
    }
    stopAll() {
        this.clients.forEach((promise) => promise.then((c) => c.destroy()));
    }
    static assertExpectedTokenType({ type }) {
        if (!(type === api_token_1.ApiTokenType.FRONTEND || type === api_token_1.ApiTokenType.ADMIN)) {
            throw new error_1.InvalidTokenError();
        }
    }
    async setFrontendSettings(value, createdBy) {
        const error = (0, util_1.validateOrigins)(value.frontendApiOrigins);
        if (error) {
            throw new error_1.BadDataError(error);
        }
        await this.services.settingService.insert(frontend_settings_1.frontendSettingsKey, value, createdBy);
    }
    async fetchFrontendSettings() {
        try {
            this.cachedFrontendSettings =
                await this.services.settingService.get(frontend_settings_1.frontendSettingsKey, {
                    frontendApiOrigins: this.config.frontendApiOrigins,
                });
        }
        catch (error) {
            this.logger.debug('Unable to fetch frontend settings');
        }
        return this.cachedFrontendSettings;
    }
    async getFrontendSettings(useCache = true) {
        if (useCache && this.cachedFrontendSettings) {
            return this.cachedFrontendSettings;
        }
        return this.fetchFrontendSettings();
    }
    destroy() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}
exports.ProxyService = ProxyService;
//# sourceMappingURL=proxy-service.js.map