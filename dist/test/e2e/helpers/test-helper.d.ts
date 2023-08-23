import supertest from 'supertest';
import { IUnleashConfig } from '../../../lib/types/option';
import { IUnleashStores } from '../../../lib/types';
import { IUnleashServices } from '../../../lib/types/services';
import { Db } from '../../../lib/db/db';
import { IContextFieldDto } from 'lib/types/stores/context-field-store';
import { CreateFeatureSchema, ImportTogglesSchema } from '../../../lib/openapi';
export interface IUnleashTest extends IUnleashHttpAPI {
    request: supertest.SuperAgentTest;
    destroy: () => Promise<void>;
    services: IUnleashServices;
    config: IUnleashConfig;
}
/**
 * This is a collection of API helpers. The response code is optional, and should default to the success code for the request.
 *
 * All functions return a supertest.Test object, which can be used to compose more assertions on the response.
 */
export interface IUnleashHttpAPI {
    createFeature(feature: string | CreateFeatureSchema, project?: string, expectedResponseCode?: number): supertest.Test;
    getFeatures(name?: string, expectedResponseCode?: number): supertest.Test;
    getProjectFeatures(project: string, name?: string, expectedResponseCode?: number): supertest.Test;
    archiveFeature(name: string, project?: string, expectedResponseCode?: number): supertest.Test;
    createContextField(contextField: IContextFieldDto, expectedResponseCode?: number): supertest.Test;
    linkProjectToEnvironment(project: string, environment: string, expectedResponseCode?: number): supertest.Test;
    importToggles(importPayload: ImportTogglesSchema, expectedResponseCode?: number): supertest.Test;
}
export declare function setupApp(stores: IUnleashStores): Promise<IUnleashTest>;
export declare function setupAppWithCustomConfig(stores: IUnleashStores, customOptions: any, db?: Db): Promise<IUnleashTest>;
export declare function setupAppWithAuth(stores: IUnleashStores, customOptions?: any, db?: Db): Promise<IUnleashTest>;
export declare function setupAppWithCustomAuth(stores: IUnleashStores, preHook: Function, customOptions?: any): Promise<IUnleashTest>;
export declare function setupAppWithBaseUrl(stores: IUnleashStores): Promise<IUnleashTest>;
