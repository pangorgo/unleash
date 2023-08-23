"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceStatsService = void 0;
const js_sha256_1 = require("js-sha256");
const types_1 = require("../types");
const util_1 = require("../util");
class InstanceStatsService {
    constructor({ featureToggleStore, userStore, projectStore, environmentStore, strategyStore, contextFieldStore, groupStore, segmentStore, roleStore, settingStore, clientInstanceStore, eventStore, }, { getLogger }, versionService) {
        this.strategyStore = strategyStore;
        this.userStore = userStore;
        this.featureToggleStore = featureToggleStore;
        this.environmentStore = environmentStore;
        this.projectStore = projectStore;
        this.groupStore = groupStore;
        this.contextFieldStore = contextFieldStore;
        this.segmentStore = segmentStore;
        this.roleStore = roleStore;
        this.versionService = versionService;
        this.settingStore = settingStore;
        this.eventStore = eventStore;
        this.clientInstanceStore = clientInstanceStore;
        this.logger = getLogger('services/stats-service.js');
    }
    async refreshStatsSnapshot() {
        try {
            this.snapshot = await this.getStats();
            const appCountReplacement = {};
            this.snapshot.clientApps?.forEach((appCount) => {
                appCountReplacement[appCount.range] = appCount.count;
            });
            this.appCount = appCountReplacement;
        }
        catch (error) {
            this.logger.warn('Unable to retrieve statistics. This will be retried', error);
        }
    }
    getToggleCount() {
        return this.featureToggleStore.count({
            archived: false,
        });
    }
    async hasOIDC() {
        const settings = await this.settingStore.get('unleash.enterprise.auth.oidc');
        return settings?.enabled || false;
    }
    async hasSAML() {
        const settings = await this.settingStore.get('unleash.enterprise.auth.saml');
        return settings?.enabled || false;
    }
    /**
     * use getStatsSnapshot for low latency, sacrificing data-freshness
     */
    async getStats() {
        const versionInfo = this.versionService.getVersionInfo();
        const [featureToggles, users, projects, contextFields, groups, roles, customRootRoles, customRootRolesInUse, environments, segments, strategies, SAMLenabled, OIDCenabled, clientApps, featureExports, featureImports,] = await Promise.all([
            this.getToggleCount(),
            this.userStore.count(),
            this.projectStore.count(),
            this.contextFieldStore.count(),
            this.groupStore.count(),
            this.roleStore.count(),
            this.roleStore.filteredCount({ type: util_1.CUSTOM_ROOT_ROLE_TYPE }),
            this.roleStore.filteredCountInUse({ type: util_1.CUSTOM_ROOT_ROLE_TYPE }),
            this.environmentStore.count(),
            this.segmentStore.count(),
            this.strategyStore.count(),
            this.hasSAML(),
            this.hasOIDC(),
            this.getLabeledAppCounts(),
            this.eventStore.filteredCount({ type: types_1.FEATURES_EXPORTED }),
            this.eventStore.filteredCount({ type: types_1.FEATURES_IMPORTED }),
        ]);
        return {
            timestamp: new Date(),
            instanceId: versionInfo.instanceId,
            versionOSS: versionInfo.current.oss,
            versionEnterprise: versionInfo.current.enterprise,
            users,
            featureToggles,
            projects,
            contextFields,
            roles,
            customRootRoles,
            customRootRolesInUse,
            groups,
            environments,
            segments,
            strategies,
            SAMLenabled,
            OIDCenabled,
            clientApps,
            featureExports,
            featureImports,
        };
    }
    getStatsSnapshot() {
        return this.snapshot;
    }
    async getLabeledAppCounts() {
        return [
            {
                range: 'allTime',
                count: await this.clientInstanceStore.getDistinctApplicationsCount(),
            },
            {
                range: '30d',
                count: await this.clientInstanceStore.getDistinctApplicationsCount(30),
            },
            {
                range: '7d',
                count: await this.clientInstanceStore.getDistinctApplicationsCount(7),
            },
        ];
    }
    getAppCountSnapshot(range) {
        return this.appCount?.[range];
    }
    async getSignedStats() {
        const instanceStats = await this.getStats();
        const sum = (0, js_sha256_1.sha256)(`${instanceStats.instanceId}${instanceStats.users}${instanceStats.featureToggles}${instanceStats.projects}${instanceStats.roles}${instanceStats.groups}${instanceStats.environments}${instanceStats.segments}`);
        return { ...instanceStats, sum };
    }
}
exports.InstanceStatsService = InstanceStatsService;
//# sourceMappingURL=instance-stats-service.js.map