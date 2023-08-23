import { FeatureToggle, IFeatureToggleClient, IFeatureToggleQuery } from '../../lib/types/model';
import { IFeatureToggleClientStore } from '../../lib/types/stores/feature-toggle-client-store';
import { IGetAdminFeatures } from '../../lib/db/feature-toggle-client-store';
export default class FakeFeatureToggleClientStore implements IFeatureToggleClientStore {
    featureToggles: FeatureToggle[];
    getFeatures(featureQuery?: IFeatureToggleQuery, archived?: boolean): Promise<IFeatureToggleClient[]>;
    getClient(query?: IFeatureToggleQuery): Promise<IFeatureToggleClient[]>;
    getPlayground(query?: IFeatureToggleQuery): Promise<IFeatureToggleClient[]>;
    getAdmin({ featureQuery: query, archived, }: IGetAdminFeatures): Promise<IFeatureToggleClient[]>;
    createFeature(feature: any): Promise<void>;
}
