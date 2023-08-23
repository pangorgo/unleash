import { Db, IUnleashConfig } from 'lib/server-impl';
import { ProjectService } from '../../services';
export declare const createProjectService: (db: Db, config: IUnleashConfig) => ProjectService;
export declare const createFakeProjectService: (config: IUnleashConfig) => ProjectService;
