"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const make_fetch_happen_1 = __importDefault(require("make-fetch-happen"));
const version_1 = __importDefault(require("../util/version"));
const date_fns_1 = require("date-fns");
const types_1 = require("../types");
const util_1 = require("../util");
class VersionService {
    constructor({ settingStore, strategyStore, userStore, featureToggleStore, projectStore, environmentStore, contextFieldStore, groupStore, roleStore, segmentStore, eventStore, featureStrategiesStore, }, { getLogger, versionCheck, enterpriseVersion, telemetry, }) {
        this.logger = getLogger('lib/services/version-service.js');
        this.settingStore = settingStore;
        this.strategyStore = strategyStore;
        this.userStore = userStore;
        this.featureToggleStore = featureToggleStore;
        this.projectStore = projectStore;
        this.environmentStore = environmentStore;
        this.contextFieldStore = contextFieldStore;
        this.groupStore = groupStore;
        this.roleStore = roleStore;
        this.segmentStore = segmentStore;
        this.eventStore = eventStore;
        this.featureStrategiesStore = featureStrategiesStore;
        this.current = {
            oss: version_1.default,
            enterprise: enterpriseVersion || '',
        };
        this.enabled = versionCheck.enable;
        this.telemetryEnabled = telemetry;
        this.versionCheckUrl = versionCheck.url;
        this.isLatest = true;
        process.nextTick(() => this.setup());
    }
    async setup() {
        await this.setInstanceId();
        await this.checkLatestVersion();
        this.timer = setInterval(async () => this.checkLatestVersion(), (0, date_fns_1.hoursToMilliseconds)(48));
        this.timer.unref();
    }
    async setInstanceId() {
        try {
            const { id } = await this.settingStore.get('instanceInfo');
            this.instanceId = id;
        }
        catch (err) {
            this.logger.warn('Could not find instanceInfo');
        }
    }
    async checkLatestVersion() {
        if (this.enabled) {
            try {
                const versionPayload = {
                    versions: this.current,
                    instanceId: this.instanceId,
                };
                if (this.telemetryEnabled) {
                    const featureInfo = await this.getFeatureUsageInfo();
                    versionPayload.featureInfo = featureInfo;
                }
                const res = await (0, make_fetch_happen_1.default)(this.versionCheckUrl, {
                    method: 'POST',
                    body: JSON.stringify(versionPayload),
                    headers: { 'Content-Type': 'application/json' },
                });
                if (res.ok) {
                    const data = (await res.json());
                    this.latest = {
                        oss: data.versions.oss,
                        enterprise: data.versions.enterprise,
                    };
                    this.isLatest = data.latest;
                }
                else {
                    this.logger.info(`Could not check newest version. Status: ${res.status}`);
                }
            }
            catch (err) {
                this.logger.info('Could not check newest version', err);
            }
        }
    }
    async getFeatureUsageInfo() {
        const [featureToggles, users, projects, contextFields, groups, roles, customRootRoles, customRootRolesInUse, environments, segments, strategies, SAMLenabled, OIDCenabled, featureExports, featureImports,] = await Promise.all([
            this.featureToggleStore.count({
                archived: false,
            }),
            this.userStore.count(),
            this.projectStore.count(),
            this.contextFieldStore.count(),
            this.groupStore.count(),
            this.roleStore.count(),
            this.roleStore.filteredCount({
                type: util_1.CUSTOM_ROOT_ROLE_TYPE,
            }),
            this.roleStore.filteredCountInUse({ type: util_1.CUSTOM_ROOT_ROLE_TYPE }),
            this.environmentStore.count(),
            this.segmentStore.count(),
            this.strategyStore.count(),
            this.hasSAML(),
            this.hasOIDC(),
            this.eventStore.filteredCount({ type: types_1.FEATURES_EXPORTED }),
            this.eventStore.filteredCount({ type: types_1.FEATURES_IMPORTED }),
        ]);
        const versionInfo = this.getVersionInfo();
        const customStrategies = await this.strategyStore.getEditableStrategies();
        const customStrategiesInUse = await this.featureStrategiesStore.getCustomStrategiesInUseCount();
        const featureInfo = {
            featureToggles,
            users,
            projects,
            contextFields,
            groups,
            roles,
            customRootRoles,
            customRootRolesInUse,
            environments,
            segments,
            strategies,
            SAMLenabled,
            OIDCenabled,
            featureExports,
            featureImports,
            customStrategies: customStrategies.length,
            customStrategiesInUse: customStrategiesInUse,
            instanceId: versionInfo.instanceId,
            versionOSS: versionInfo.current.oss,
            versionEnterprise: versionInfo.current.enterprise,
        };
        return featureInfo;
    }
    async hasOIDC() {
        const settings = await this.settingStore.get('unleash.enterprise.auth.oidc');
        return settings?.enabled || false;
    }
    async hasSAML() {
        const settings = await this.settingStore.get('unleash.enterprise.auth.saml');
        return settings?.enabled || false;
    }
    getVersionInfo() {
        return {
            current: this.current,
            latest: this.latest || {},
            isLatest: this.isLatest,
            instanceId: this.instanceId,
        };
    }
    destroy() {
        clearInterval(this.timer);
        this.timer = null;
    }
}
exports.default = VersionService;
module.exports = VersionService;
//# sourceMappingURL=version-service.js.map