import { Db } from '../../db/db';
import { IUnleashConfig } from '../../types';
import ExportImportService from './export-import-service';
export declare const createFakeExportImportTogglesService: (config: IUnleashConfig) => ExportImportService;
export declare const createExportImportTogglesService: (db: Db, config: IUnleashConfig) => ExportImportService;
