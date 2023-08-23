import Addon from './addon';
import { LogProvider } from '../logger';
import { IFlagResolver } from '../types';
export interface IAddonProviders {
    [key: string]: Addon;
}
export declare const getAddons: (args: {
    getLogger: LogProvider;
    unleashUrl: string;
    flagResolver: IFlagResolver;
}) => IAddonProviders;
