import { IUnleashConfig } from '../../types';
import { GroupService } from '../../services';
import { Db } from '../../db/db';
export declare const createGroupService: (db: Db, config: IUnleashConfig) => GroupService;
