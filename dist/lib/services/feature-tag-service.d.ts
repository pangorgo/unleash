import { IUnleashConfig } from '../types/option';
import { IUnleashStores } from '../types/stores';
import { ITag } from '../types/model';
declare class FeatureTagService {
    private tagStore;
    private featureTagStore;
    private featureToggleStore;
    private eventStore;
    private logger;
    constructor({ tagStore, featureTagStore, eventStore, featureToggleStore, }: Pick<IUnleashStores, 'tagStore' | 'featureTagStore' | 'eventStore' | 'featureToggleStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    listTags(featureName: string): Promise<ITag[]>;
    listFeatures(tagValue: string): Promise<string[]>;
    addTag(featureName: string, tag: ITag, userName: string): Promise<ITag>;
    updateTags(featureNames: string[], addedTags: ITag[], removedTags: ITag[], userName: string): Promise<void>;
    createTagIfNeeded(tag: ITag, userName: string): Promise<void>;
    removeTag(featureName: string, tag: ITag, userName: string): Promise<void>;
}
export default FeatureTagService;
