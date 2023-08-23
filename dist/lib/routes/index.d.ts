import { IUnleashConfig, IUnleashServices } from '../types';
declare const Controller: any;
import { Db } from '../db/db';
declare class IndexRouter extends Controller {
    constructor(config: IUnleashConfig, services: IUnleashServices, db: Db);
}
export default IndexRouter;
