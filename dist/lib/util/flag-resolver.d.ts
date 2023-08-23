import { Variant } from 'unleash-client';
import { IExperimentalOptions, IFlagContext, IFlags, IFlagResolver, IFlagKey } from '../types/experimental';
export default class FlagResolver implements IFlagResolver {
    private experiments;
    private externalResolver;
    constructor(expOpt: IExperimentalOptions);
    getAll(context?: IFlagContext): IFlags;
    isEnabled(expName: IFlagKey, context?: IFlagContext): boolean;
    getVariant(expName: IFlagKey, context?: IFlagContext): Variant;
}
export declare const getVariantValue: <T = string>(variant: Variant | undefined) => T;
