import type { IProjectHealthReport } from 'lib/types';
import type { IFeatureType } from 'lib/types/stores/feature-type-store';
declare type IPartialFeatures = Array<{
    stale?: boolean;
    createdAt?: Date;
    type?: string;
}>;
export declare const calculateProjectHealth: (features: IPartialFeatures, featureTypes: IFeatureType[]) => Pick<IProjectHealthReport, 'staleCount' | 'potentiallyStaleCount' | 'activeCount'>;
export declare const calculateHealthRating: (features: IPartialFeatures, featureTypes: IFeatureType[]) => number;
export {};
