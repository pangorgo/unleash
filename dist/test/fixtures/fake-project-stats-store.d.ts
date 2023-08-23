import { IProjectStats } from 'lib/services/project-service';
import { ICreateEnabledDates, IProjectStatsStore } from 'lib/types/stores/project-stats-store-type';
export default class FakeProjectStatsStore implements IProjectStatsStore {
    updateProjectStats(projectId: string, status: IProjectStats): Promise<void>;
    getProjectStats(projectId: string): Promise<IProjectStats>;
    getTimeToProdDates(): Promise<ICreateEnabledDates[]>;
}
