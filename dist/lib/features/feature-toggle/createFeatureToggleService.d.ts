import { FeatureToggleService } from '../../services';
import { Db } from '../../db/db';
import { IUnleashConfig } from '../../types';
export declare const createFeatureToggleService: (db: Db, config: IUnleashConfig) => FeatureToggleService;
export declare const createFakeFeatureToggleService: (config: IUnleashConfig) => FeatureToggleService;
