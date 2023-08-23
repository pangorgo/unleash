import { Db, IUnleashConfig } from 'lib/server-impl';
import { IChangeRequestAccessReadModel } from './change-request-access-read-model';
export declare const createChangeRequestAccessReadModel: (db: Db, config: IUnleashConfig) => IChangeRequestAccessReadModel;
export declare const createFakeChangeRequestAccessService: () => IChangeRequestAccessReadModel;
