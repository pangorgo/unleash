import { Db, IUnleashConfig } from 'lib/server-impl';
import { AccessService } from '../../services';
export declare const createAccessService: (db: Db, config: IUnleashConfig) => AccessService;
export declare const createFakeAccessService: (config: IUnleashConfig) => AccessService;
