import { IUnleashStores } from '../types/stores';
import { IUnleashConfig } from '../types/option';
import { IFeatureType } from '../types/stores/feature-type-store';
export default class FeatureTypeService {
    private featureTypeStore;
    private logger;
    constructor({ featureTypeStore }: Pick<IUnleashStores, 'featureTypeStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    getAll(): Promise<IFeatureType[]>;
    updateLifetime(id: string, newLifetimeDays: number | null): Promise<IFeatureType>;
}
