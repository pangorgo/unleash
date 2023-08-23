import { IUnleashStores } from '../types/stores';
import { IUnleashConfig } from '../types/option';
declare class HealthService {
    private featureTypeStore;
    private logger;
    constructor({ featureTypeStore }: Pick<IUnleashStores, 'featureTypeStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    dbIsUp(): Promise<boolean>;
}
export default HealthService;
