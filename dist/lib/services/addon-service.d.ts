import memoizee from 'memoizee';
import { IAddonProviders } from '../addons';
import { IEventStore } from '../types/stores/event-store';
import { IFeatureToggleStore } from '../types/stores/feature-toggle-store';
import { Logger } from '../logger';
import TagTypeService from './tag-type-service';
import { IAddon, IAddonDto, IAddonStore } from '../types/stores/addon-store';
import { IUnleashStores, IUnleashConfig } from '../types';
import { IAddonDefinition } from '../types/model';
interface ISensitiveParams {
    [key: string]: string[];
}
export default class AddonService {
    eventStore: IEventStore;
    addonStore: IAddonStore;
    featureToggleStore: IFeatureToggleStore;
    logger: Logger;
    tagTypeService: TagTypeService;
    addonProviders: IAddonProviders;
    sensitiveParams: ISensitiveParams;
    fetchAddonConfigs: (() => Promise<IAddon[]>) & memoizee.Memoized<() => Promise<IAddon[]>>;
    constructor({ addonStore, eventStore, featureToggleStore, }: Pick<IUnleashStores, 'addonStore' | 'eventStore' | 'featureToggleStore'>, { getLogger, server, flagResolver, }: Pick<IUnleashConfig, 'getLogger' | 'server' | 'flagResolver'>, tagTypeService: TagTypeService, addons?: IAddonProviders);
    loadSensitiveParams(addonProviders: IAddonProviders): ISensitiveParams;
    registerEventHandler(): void;
    handleEvent(eventName: string): (IEvent: any) => void;
    getAddons(): Promise<IAddon[]>;
    filterSensitiveFields(addonConfig: IAddon): IAddon;
    getAddon(id: number): Promise<IAddon>;
    getProviderDefinitions(): IAddonDefinition[];
    addTagTypes(providerName: string): Promise<void>;
    createAddon(data: IAddonDto, userName: string): Promise<IAddon>;
    updateAddon(id: number, data: IAddonDto, userName: string): Promise<IAddon>;
    removeAddon(id: number, userName: string): Promise<void>;
    validateKnownProvider(config: Partial<IAddonDto>): Promise<boolean>;
    validateRequiredParameters({ provider, parameters, }: {
        provider: any;
        parameters: any;
    }): Promise<boolean>;
    destroy(): void;
}
export {};
