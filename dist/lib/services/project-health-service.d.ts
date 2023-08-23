import { IUnleashStores } from '../types/stores';
import { IUnleashConfig } from '../types/option';
import type { IProject, IProjectHealthReport } from '../types/model';
import ProjectService from './project-service';
export default class ProjectHealthService {
    private logger;
    private projectStore;
    private featureTypeStore;
    private featureToggleStore;
    private featureTypes;
    private projectService;
    constructor({ projectStore, featureTypeStore, featureToggleStore, }: Pick<IUnleashStores, 'projectStore' | 'featureTypeStore' | 'featureToggleStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>, projectService: ProjectService);
    getProjectHealthReport(projectId: string): Promise<IProjectHealthReport>;
    calculateHealthRating(project: IProject): Promise<number>;
    setHealthRating(): Promise<void>;
}
