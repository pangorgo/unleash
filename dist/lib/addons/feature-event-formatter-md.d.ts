import { IEvent } from '../types';
export interface FeatureEventFormatter {
    format: (event: IEvent) => string;
    featureLink: (event: IEvent) => string;
}
export declare enum LinkStyle {
    SLACK = 0,
    MD = 1
}
export declare class FeatureEventFormatterMd implements FeatureEventFormatter {
    private readonly unleashUrl;
    private readonly linkStyle;
    constructor(unleashUrl: string, linkStyle?: LinkStyle);
    generateArchivedText(event: IEvent): string;
    generateFeatureLink(event: IEvent): string;
    generateStaleText(event: IEvent): string;
    generateEnvironmentToggleText(event: IEvent): string;
    generateStrategyChangeText(event: IEvent): string;
    private applicationHostnameStrategyChangeText;
    private remoteAddressStrategyChangeText;
    private userWithIdStrategyChangeText;
    private listOfValuesStrategyChangeText;
    private flexibleRolloutStrategyChangeText;
    private defaultStrategyChangeText;
    private constraintChangeText;
    generateStrategyRemoveText(event: IEvent): string;
    generateStrategyAddText(event: IEvent): string;
    generateMetadataText(event: IEvent): string;
    generateProjectChangeText(event: IEvent): string;
    generateFeaturePotentiallyStaleOnText(event: IEvent): string;
    featureLink(event: IEvent): string;
    getAction(type: string): string;
    defaultText(event: IEvent): string;
    format(event: IEvent): string;
}
