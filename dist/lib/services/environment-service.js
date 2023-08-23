"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error");
const name_exists_error_1 = __importDefault(require("../error/name-exists-error"));
const state_schema_1 = require("./state-schema");
const notfound_error_1 = __importDefault(require("../error/notfound-error"));
const minimum_one_environment_error_1 = __importDefault(require("../error/minimum-one-environment-error"));
class EnvironmentService {
    constructor({ environmentStore, featureStrategiesStore, featureEnvironmentStore, projectStore, }, { getLogger, flagResolver, }) {
        this.logger = getLogger('services/environment-service.ts');
        this.environmentStore = environmentStore;
        this.featureStrategiesStore = featureStrategiesStore;
        this.featureEnvironmentStore = featureEnvironmentStore;
        this.projectStore = projectStore;
        this.flagResolver = flagResolver;
    }
    async getAll() {
        return this.environmentStore.getAllWithCounts();
    }
    async get(name) {
        return this.environmentStore.get(name);
    }
    async getProjectEnvironments(projectId) {
        return this.environmentStore.getProjectEnvironments(projectId);
    }
    async updateSortOrder(sortOrder) {
        await state_schema_1.sortOrderSchema.validateAsync(sortOrder);
        await Promise.all(Object.keys(sortOrder).map((key) => {
            const value = sortOrder[key];
            return this.environmentStore.updateSortOrder(key, value);
        }));
    }
    async toggleEnvironment(name, value) {
        const exists = await this.environmentStore.exists(name);
        if (exists) {
            return this.environmentStore.updateProperty(name, 'enabled', value);
        }
        throw new notfound_error_1.default(`Could not find environment ${name}`);
    }
    async addEnvironmentToProject(environment, projectId) {
        try {
            await this.featureEnvironmentStore.connectProject(environment, projectId);
            await this.featureEnvironmentStore.connectFeatures(environment, projectId);
        }
        catch (e) {
            if (e.code === error_1.UNIQUE_CONSTRAINT_VIOLATION) {
                throw new name_exists_error_1.default(`${projectId} already has the environment ${environment} enabled`);
            }
            throw e;
        }
    }
    async addDefaultStrategy(environment, projectId, strategy) {
        if (strategy.name !== 'flexibleRollout') {
            throw new error_1.BadDataError('Only "flexibleRollout" strategy can be used as a default strategy for an environment');
        }
        return this.projectStore.updateDefaultStrategy(projectId, environment, strategy);
    }
    async overrideEnabledProjects(environmentNamesToEnable) {
        if (environmentNamesToEnable.length === 0) {
            return Promise.resolve();
        }
        const allEnvironments = await this.environmentStore.getAll();
        const existingEnvironmentsToEnable = allEnvironments.filter((env) => environmentNamesToEnable.includes(env.name));
        if (existingEnvironmentsToEnable.length !==
            environmentNamesToEnable.length) {
            this.logger.warn("Found environment enabled overrides but some of the specified environments don't exist, no overrides will be executed");
            return Promise.resolve();
        }
        const environmentsNotAlreadyEnabled = existingEnvironmentsToEnable.filter((env) => env.enabled == false);
        const environmentsToDisable = allEnvironments.filter((env) => {
            return (!environmentNamesToEnable.includes(env.name) &&
                env.enabled == true);
        });
        await this.environmentStore.disable(environmentsToDisable);
        await this.environmentStore.enable(environmentsNotAlreadyEnabled);
        await this.remapProjectsLinks(environmentsToDisable, environmentsNotAlreadyEnabled);
    }
    async remapProjectsLinks(toDisable, toEnable) {
        const projectLinks = await this.projectStore.getProjectLinksForEnvironments(toDisable.map((env) => env.name));
        const unlinkTasks = projectLinks.map((link) => {
            return this.forceRemoveEnvironmentFromProject(link.environmentName, link.projectId);
        });
        await Promise.all(unlinkTasks.flat());
        const uniqueProjects = [
            ...new Set(projectLinks.map((link) => link.projectId)),
        ];
        let linkTasks = uniqueProjects.map((project) => {
            return toEnable.map((enabledEnv) => {
                return this.addEnvironmentToProject(enabledEnv.name, project);
            });
        });
        await Promise.all(linkTasks.flat());
    }
    async forceRemoveEnvironmentFromProject(environment, projectId) {
        await this.featureEnvironmentStore.disconnectFeatures(environment, projectId);
        await this.featureEnvironmentStore.disconnectProject(environment, projectId);
    }
    async removeEnvironmentFromProject(environment, projectId) {
        const projectEnvs = await this.projectStore.getEnvironmentsForProject(projectId);
        if (projectEnvs.length > 1) {
            await this.forceRemoveEnvironmentFromProject(environment, projectId);
            return;
        }
        throw new minimum_one_environment_error_1.default('You must always have one active environment');
    }
}
exports.default = EnvironmentService;
//# sourceMappingURL=environment-service.js.map