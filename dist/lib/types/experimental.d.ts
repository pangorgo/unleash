import { Variant } from 'unleash-client';
export declare type IFlagKey = 'anonymiseEventLog' | 'embedProxy' | 'embedProxyFrontend' | 'responseTimeWithAppNameKillSwitch' | 'maintenanceMode' | 'messageBanner' | 'featuresExportImport' | 'caseInsensitiveInOperators' | 'strictSchemaValidation' | 'proPlanAutoCharge' | 'personalAccessTokensKillSwitch' | 'migrationLock' | 'demo' | 'googleAuthEnabled' | 'disableBulkToggle' | 'disableNotifications' | 'advancedPlayground' | 'strategyVariant' | 'newProjectLayout' | 'slackAppAddon' | 'emitPotentiallyStaleEvents' | 'configurableFeatureTypeLifetimes' | 'filterInvalidClientMetrics' | 'frontendNavigationUpdate' | 'lastSeenByEnvironment' | 'segmentChangeRequests' | 'changeRequestReject' | 'customRootRolesKillSwitch' | 'newApplicationList';
export declare type IFlags = Partial<{
    [key in IFlagKey]: boolean | Variant;
}>;
export declare const defaultExperimentalOptions: IExperimentalOptions;
export interface IExperimentalOptions {
    flags: IFlags;
    externalResolver: IExternalFlagResolver;
}
export interface IFlagContext {
    [key: string]: string;
}
export interface IFlagResolver {
    getAll: (context?: IFlagContext) => IFlags;
    isEnabled: (expName: IFlagKey, context?: IFlagContext) => boolean;
    getVariant: (expName: IFlagKey, context?: IFlagContext) => Variant;
}
export interface IExternalFlagResolver {
    isEnabled: (flagName: IFlagKey, context?: IFlagContext) => boolean;
    getVariant: (flagName: IFlagKey, context?: IFlagContext) => Variant;
}
