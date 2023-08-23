import { LogProvider } from '../../../lib/logger';
import { IUnleashStores } from '../../../lib/types';
import { IUnleashOptions, Knex } from 'lib/server-impl';
export interface ITestDb {
    stores: IUnleashStores;
    reset: () => Promise<void>;
    destroy: () => Promise<void>;
    rawDatabase: Knex;
}
export default function init(databaseSchema?: string, getLogger?: LogProvider, configOverride?: Partial<IUnleashOptions>): Promise<ITestDb>;
