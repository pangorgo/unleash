import { ISegmentStore } from '../../lib/types/stores/segment-store';
import { IClientSegment, IFeatureStrategySegment, ISegment } from '../../lib/types/model';
export default class FakeSegmentStore implements ISegmentStore {
    count(): Promise<number>;
    create(): Promise<ISegment>;
    delete(): Promise<void>;
    deleteAll(): Promise<void>;
    exists(): Promise<boolean>;
    get(): Promise<ISegment>;
    getAll(): Promise<ISegment[]>;
    getActive(): Promise<ISegment[]>;
    getActiveForClient(): Promise<IClientSegment[]>;
    getByStrategy(): Promise<ISegment[]>;
    update(): Promise<ISegment>;
    addToStrategy(): Promise<void>;
    removeFromStrategy(): Promise<void>;
    getAllFeatureStrategySegments(): Promise<IFeatureStrategySegment[]>;
    existsByName(): Promise<boolean>;
    destroy(): void;
}
