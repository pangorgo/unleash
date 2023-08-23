import { ITag } from '../../lib/types/model';
import { IFeatureAndTag, IFeatureTag, IFeatureTagStore } from '../../lib/types/stores/feature-tag-store';
export default class FakeFeatureTagStore implements IFeatureTagStore {
    private featureTags;
    getAllTagsForFeature(featureName: string): Promise<ITag[]>;
    getAllFeaturesForTag(tagValue: string): Promise<string[]>;
    delete(key: IFeatureTag): Promise<void>;
    destroy(): void;
    exists(key: IFeatureTag): Promise<boolean>;
    get(key: IFeatureTag): Promise<IFeatureTag>;
    getAll(): Promise<IFeatureTag[]>;
    tagFeature(featureName: string, tag: ITag): Promise<ITag>;
    getAllFeatureTags(): Promise<IFeatureTag[]>;
    deleteAll(): Promise<void>;
    tagFeatures(featureTags: IFeatureTag[]): Promise<IFeatureAndTag[]>;
    untagFeature(featureName: string, tag: ITag): Promise<void>;
    getAllByFeatures(features: string[]): Promise<IFeatureTag[]>;
    untagFeatures(featureTags: IFeatureTag[]): Promise<void>;
}
