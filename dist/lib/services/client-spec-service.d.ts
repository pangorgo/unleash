import { IUnleashConfig } from '../types/option';
import { Request } from 'express';
export declare type ClientSpecFeature = 'segments';
export declare class ClientSpecService {
    private readonly logger;
    private readonly clientSpecHeader;
    private readonly clientSpecFeatures;
    constructor(config: Pick<IUnleashConfig, 'getLogger'>);
    requestSupportsSpec(request: Request, feature: ClientSpecFeature): boolean;
    versionSupportsSpec(feature: ClientSpecFeature, version: string | undefined): boolean;
}
