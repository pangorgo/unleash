import { IImportTogglesStore } from './import-toggles-store-type';
import { Db } from '../../db/db';
export declare class ImportTogglesStore implements IImportTogglesStore {
    private db;
    constructor(db: Db);
    getDisplayPermissions(names: string[]): Promise<{
        name: string;
        displayName: string;
    }[]>;
    deleteStrategiesForFeatures(featureNames: string[], environment: string): Promise<void>;
    strategiesExistForFeatures(featureNames: string[], environment: string): Promise<boolean>;
    getArchivedFeatures(featureNames: string[]): Promise<string[]>;
    getExistingFeatures(featureNames: string[]): Promise<string[]>;
    getFeaturesInOtherProjects(featureNames: string[], project: string): Promise<{
        name: string;
        project: string;
    }[]>;
    deleteTagsForFeatures(features: string[]): Promise<void>;
}
