import { Response } from 'express';
import Controller from '../../routes/controller';
import { TransactionCreator, UnleashTransaction } from '../../db/transaction';
import { IUnleashConfig, IUnleashServices } from '../../types';
import { ExportQuerySchema, ImportTogglesSchema } from '../../openapi';
import { IAuthRequest } from '../../routes/unleash-types';
declare class ExportImportController extends Controller {
    private logger;
    private exportImportService;
    private transactionalExportImportService;
    private openApiService;
    private readonly startTransaction;
    constructor(config: IUnleashConfig, { exportImportService, transactionalExportImportService, openApiService, }: Pick<IUnleashServices, 'exportImportService' | 'openApiService' | 'transactionalExportImportService'>, startTransaction: TransactionCreator<UnleashTransaction>);
    export(req: IAuthRequest<unknown, unknown, ExportQuerySchema, unknown>, res: Response): Promise<void>;
    validateImport(req: IAuthRequest<unknown, unknown, ImportTogglesSchema, unknown>, res: Response): Promise<void>;
    importData(req: IAuthRequest<unknown, unknown, ImportTogglesSchema, unknown>, res: Response): Promise<void>;
    private verifyExportImportEnabled;
}
export default ExportImportController;
