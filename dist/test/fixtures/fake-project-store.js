"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notfound_error_1 = __importDefault(require("../../lib/error/notfound-error"));
class FakeProjectStore {
    constructor() {
        this.projects = [];
        this.projectEnvironment = new Map();
    }
    getEnvironmentsForProject() {
        throw new Error('Method not implemented.');
    }
    getProjectLinksForEnvironments(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    environments) {
        throw new Error('Method not implemented.');
    }
    async addEnvironmentToProject(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    environment) {
        const environments = this.projectEnvironment.get(id) || new Set();
        environments.add(environment);
        this.projectEnvironment.set(id, environments);
    }
    async getProjectsWithCounts() {
        return this.projects.map((project) => {
            return { ...project, memberCount: 0, featureCount: 0 };
        });
    }
    createInternal(project) {
        const newProj = {
            ...project,
            health: 100,
            createdAt: new Date(),
            mode: 'open',
            defaultStickiness: 'default',
        };
        this.projects.push(newProj);
        return newProj;
    }
    async create(project) {
        return this.createInternal(project);
    }
    async delete(key) {
        this.projects.splice(this.projects.findIndex((project) => project.id === key), 1);
    }
    async deleteAll() {
        this.projects = [];
    }
    async deleteEnvironmentForProject(id, environment) {
        const environments = this.projectEnvironment.get(id);
        if (environments) {
            environments.delete(environment);
            this.projectEnvironment.set(id, environments);
        }
    }
    destroy() { }
    async count() {
        return this.projects.length;
    }
    async exists(key) {
        return this.projects.some((project) => project.id === key);
    }
    async get(key) {
        const project = this.projects.find((p) => p.id === key);
        if (project) {
            return project;
        }
        throw new notfound_error_1.default(`Could not find project with id: ${key}`);
    }
    async getAll() {
        return this.projects;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getMembersCountByProject(projectId) {
        return Promise.resolve(0);
    }
    async hasProject(id) {
        return this.exists(id);
    }
    async importProjects(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    projects, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    environments) {
        return projects.map((project) => this.createInternal(project));
    }
    async update(update) {
        await this.delete(update.id);
        this.createInternal(update);
    }
    async updateHealth(healthUpdate) {
        this.projects.find((project) => project.id === healthUpdate.id).health = healthUpdate.health;
    }
    getMembersCount() {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getProjectsByUser(userId) {
        throw new Error('Method not implemented.');
    }
    addEnvironmentToProjects(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    environment, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    projects) {
        throw new Error('Method not implemented.');
    }
    getMembersCountByProjectAfterDate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    projectId, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    date) {
        throw new Error('Method not implemented');
    }
    updateDefaultStrategy(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    projectId, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    environment, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    strategy) {
        throw new Error('Method not implemented.');
    }
    getDefaultStrategy(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    projectId, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    environment) {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFeatureLimitReached(id) {
        return Promise.resolve(false);
    }
}
exports.default = FakeProjectStore;
//# sourceMappingURL=fake-project-store.js.map