import Controller from '../controller';
import { IFlagResolver, IUnleashConfig, IUnleashServices } from '../../types';
declare type Services = Pick<IUnleashServices, 'settingService' | 'proxyService' | 'openApiService'>;
export default class ProxyController extends Controller {
    private readonly logger;
    private services;
    private flagResolver;
    constructor(config: IUnleashConfig, services: Services, flagResolver: IFlagResolver);
    private static endpointNotImplemented;
    private getProxyFeatures;
    private registerProxyMetrics;
    private registerProxyClient;
    private static createContext;
}
export {};
