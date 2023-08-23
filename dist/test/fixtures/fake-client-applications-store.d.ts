import { IClientApplication, IClientApplicationsStore } from '../../lib/types/stores/client-applications-store';
import { IApplicationQuery } from '../../lib/types/query';
export default class FakeClientApplicationsStore implements IClientApplicationsStore {
    apps: IClientApplication[];
    bulkUpsert(details: Partial<IClientApplication>[]): Promise<void>;
    delete(key: string): Promise<void>;
    deleteAll(): Promise<void>;
    deleteApplication(appName: string): Promise<void>;
    destroy(): void;
    exists(key: string): Promise<boolean>;
    get(key: string): Promise<IClientApplication>;
    getAll(): Promise<IClientApplication[]>;
    getApplication(appName: string): Promise<IClientApplication>;
    getAppsForStrategy(query: IApplicationQuery): Promise<IClientApplication[]>;
    getUnannounced(): Promise<IClientApplication[]>;
    setUnannouncedToAnnounced(): Promise<IClientApplication[]>;
    upsert(details: Partial<IClientApplication>): Promise<void>;
}
