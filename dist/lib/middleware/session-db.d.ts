import { Knex } from 'knex';
import { RequestHandler } from 'express';
import { IUnleashConfig } from '../types/option';
declare function sessionDb(config: Pick<IUnleashConfig, 'session' | 'server' | 'secureHeaders'>, knex: Knex): RequestHandler;
export default sessionDb;
