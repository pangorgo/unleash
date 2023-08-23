"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const events_1 = require("../../types/events");
const schema_2 = require("./schema");
const date_fns_1 = require("date-fns");
const schema_3 = require("./schema");
class ClientInstanceService {
    constructor({ clientMetricsStoreV2, strategyStore, featureToggleStore, clientInstanceStore, clientApplicationsStore, eventStore, }, { getLogger }, bulkInterval = (0, date_fns_1.secondsToMilliseconds)(5), announcementInterval = (0, date_fns_1.minutesToMilliseconds)(5)) {
        this.apps = {};
        this.logger = null;
        this.seenClients = {};
        this.timers = [];
        this.clientMetricsStoreV2 = clientMetricsStoreV2;
        this.strategyStore = strategyStore;
        this.featureToggleStore = featureToggleStore;
        this.clientApplicationsStore = clientApplicationsStore;
        this.clientInstanceStore = clientInstanceStore;
        this.eventStore = eventStore;
        this.logger = getLogger('/services/client-metrics/client-instance-service.ts');
        this.bulkInterval = bulkInterval;
        this.announcementInterval = announcementInterval;
        this.timers.push(setInterval(() => this.bulkAdd(), this.bulkInterval).unref());
        this.timers.push(setInterval(() => this.announceUnannounced(), this.announcementInterval).unref());
    }
    async registerInstance(data, clientIp) {
        const value = await schema_3.clientMetricsSchema.validateAsync(data);
        await this.clientInstanceStore.setLastSeen({
            appName: value.appName,
            instanceId: value.instanceId,
            environment: value.environment,
            clientIp: clientIp,
        });
    }
    async registerClient(data, clientIp) {
        const value = await schema_2.clientRegisterSchema.validateAsync(data);
        value.clientIp = clientIp;
        value.createdBy = clientIp;
        this.seenClients[this.clientKey(value)] = value;
        this.eventStore.emit(events_1.CLIENT_REGISTER, value);
    }
    async announceUnannounced() {
        if (this.clientApplicationsStore) {
            const appsToAnnounce = await this.clientApplicationsStore.setUnannouncedToAnnounced();
            if (appsToAnnounce.length > 0) {
                const events = appsToAnnounce.map((app) => ({
                    type: events_1.APPLICATION_CREATED,
                    createdBy: app.createdBy || 'unknown',
                    data: app,
                }));
                await this.eventStore.batchStore(events);
            }
        }
    }
    clientKey(client) {
        return `${client.appName}_${client.instanceId}`;
    }
    async bulkAdd() {
        if (this &&
            this.seenClients &&
            this.clientApplicationsStore &&
            this.clientInstanceStore) {
            const uniqueRegistrations = Object.values(this.seenClients);
            const uniqueApps = Object.values(uniqueRegistrations.reduce((soFar, reg) => {
                // eslint-disable-next-line no-param-reassign
                soFar[reg.appName] = reg;
                return soFar;
            }, {}));
            this.seenClients = {};
            try {
                if (uniqueRegistrations.length > 0) {
                    await this.clientApplicationsStore.bulkUpsert(uniqueApps);
                    await this.clientInstanceStore.bulkUpsert(uniqueRegistrations);
                }
            }
            catch (err) {
                this.logger.warn('Failed to register clients', err);
            }
        }
    }
    async getApplications(query) {
        return this.clientApplicationsStore.getAppsForStrategy(query);
    }
    async getApplication(appName) {
        const [seenToggles, application, instances, strategies, features] = await Promise.all([
            this.clientMetricsStoreV2.getSeenTogglesForApp(appName),
            this.clientApplicationsStore.get(appName),
            this.clientInstanceStore.getByAppName(appName),
            this.strategyStore.getAll(),
            this.featureToggleStore.getAll(),
        ]);
        return {
            appName: application.appName,
            createdAt: application.createdAt,
            description: application.description,
            url: application.url,
            color: application.color,
            icon: application.icon,
            strategies: application.strategies.map((name) => {
                const found = strategies.find((f) => f.name === name);
                return found || { name, notFound: true };
            }),
            instances,
            seenToggles: seenToggles.map((name) => {
                const found = features.find((f) => f.name === name);
                return found || { name, notFound: true };
            }),
            links: {
                self: `/api/applications/${application.appName}`,
            },
        };
    }
    async deleteApplication(appName) {
        await this.clientInstanceStore.deleteForApplication(appName);
        await this.clientApplicationsStore.delete(appName);
    }
    async createApplication(input) {
        const applicationData = await schema_1.applicationSchema.validateAsync(input);
        await this.clientApplicationsStore.upsert(applicationData);
    }
    async removeInstancesOlderThanTwoDays() {
        return this.clientInstanceStore.removeInstancesOlderThanTwoDays();
    }
    destroy() {
        this.timers.forEach(clearInterval);
    }
}
exports.default = ClientInstanceService;
//# sourceMappingURL=instance-service.js.map