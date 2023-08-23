import { IUnleashConfig } from '../types/option';
import { IUnleashStores } from '../types/stores';
import { Db } from './db';
export declare const createStores: (config: IUnleashConfig, db: Db) => IUnleashStores;
