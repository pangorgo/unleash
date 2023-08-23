import { Application, RequestHandler } from 'express';
import { IUnleashServices } from './types/services';
import { IUnleashConfig } from './types/option';
import { IUnleashStores } from './types/stores';
import { Knex } from 'knex';
export default function getApp(config: IUnleashConfig, stores: IUnleashStores, services: IUnleashServices, unleashSession?: RequestHandler, db?: Knex): Promise<Application>;
