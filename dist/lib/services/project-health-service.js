"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_health_1 = require("../domain/project-health/project-health");
class ProjectHealthService {
    constructor({ projectStore, featureTypeStore, featureToggleStore, }, { getLogger }, projectService) {
        this.logger = getLogger('services/project-health-service.ts');
        this.projectStore = projectStore;
        this.featureTypeStore = featureTypeStore;
        this.featureToggleStore = featureToggleStore;
        this.featureTypes = [];
        this.projectService = projectService;
    }
    async getProjectHealthReport(projectId) {
        if (this.featureTypes.length === 0) {
            this.featureTypes = await this.featureTypeStore.getAll();
        }
        const overview = await this.projectService.getProjectOverview(projectId, false, undefined);
        const healthRating = (0, project_health_1.calculateProjectHealth)(overview.features, this.featureTypes);
        return {
            ...overview,
            ...healthRating,
        };
    }
    async calculateHealthRating(project) {
        if (this.featureTypes.length === 0) {
            this.featureTypes = await this.featureTypeStore.getAll();
        }
        const toggles = await this.featureToggleStore.getAll({
            project: project.id,
            archived: false,
        });
        return (0, project_health_1.calculateHealthRating)(toggles, this.featureTypes);
    }
    async setHealthRating() {
        const projects = await this.projectStore.getAll();
        await Promise.all(projects.map(async (project) => {
            const newHealth = await this.calculateHealthRating(project);
            await this.projectStore.updateHealth({
                id: project.id,
                health: newHealth,
            });
        }));
    }
}
exports.default = ProjectHealthService;
//# sourceMappingURL=project-health-service.js.map