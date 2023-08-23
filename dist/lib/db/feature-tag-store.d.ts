/// <reference types="node" />
import { LogProvider } from '../logger';
import { ITag } from '../types';
import EventEmitter from 'events';
import { IFeatureAndTag, IFeatureTag, IFeatureTagStore } from '../types/stores/feature-tag-store';
import { Db } from './db';
interface FeatureTagTable {
    feature_name: string;
    tag_type: string;
    tag_value: string;
}
declare class FeatureTagStore implements IFeatureTagStore {
    private db;
    private logger;
    private readonly timer;
    constructor(db: Db, eventBus: EventEmitter, getLogger: LogProvider);
    delete({ featureName, tagType, tagValue, }: IFeatureTag): Promise<void>;
    destroy(): void;
    exists({ featureName, tagType, tagValue, }: IFeatureTag): Promise<boolean>;
    get({ featureName, tagType, tagValue, }: IFeatureTag): Promise<IFeatureTag>;
    getAll(): Promise<IFeatureTag[]>;
    getAllTagsForFeature(featureName: string): Promise<ITag[]>;
    getAllFeaturesForTag(tagValue: string): Promise<string[]>;
    featureExists(featureName: string): Promise<boolean>;
    getAllByFeatures(features: string[]): Promise<IFeatureTag[]>;
    tagFeature(featureName: string, tag: ITag): Promise<ITag>;
    untagFeatures(featureTags: IFeatureTag[]): Promise<void>;
    /**
     * Only gets tags for active feature toggles.
     */
    getAllFeatureTags(): Promise<IFeatureTag[]>;
    deleteAll(): Promise<void>;
    tagFeatures(featureTags: IFeatureTag[]): Promise<IFeatureAndTag[]>;
    untagFeature(featureName: string, tag: ITag): Promise<void>;
    featureTagRowToTag(row: FeatureTagTable): ITag;
    rowToFeatureAndTag(row: FeatureTagTable): IFeatureAndTag;
    featureTagToRow({ featureName, tagType, tagValue, }: IFeatureTag): FeatureTagTable;
    featureTagArray({ featureName, tagType, tagValue }: IFeatureTag): string[];
    featureAndTagToRow(featureName: string, { type, value }: ITag): FeatureTagTable;
}
export default FeatureTagStore;
