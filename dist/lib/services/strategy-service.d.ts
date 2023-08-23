import { IUnleashConfig } from '../types/option';
import { IUnleashStores } from '../types/stores';
import { IMinimalStrategy, IStrategy } from '../types/stores/strategy-store';
declare class StrategyService {
    private logger;
    private strategyStore;
    private eventStore;
    constructor({ strategyStore, eventStore, }: Pick<IUnleashStores, 'strategyStore' | 'eventStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    getStrategies(): Promise<IStrategy[]>;
    getStrategy(name: string): Promise<IStrategy>;
    removeStrategy(strategyName: string, userName: string): Promise<void>;
    deprecateStrategy(strategyName: string, userName: string): Promise<void>;
    reactivateStrategy(strategyName: string, userName: string): Promise<void>;
    createStrategy(value: IMinimalStrategy, userName: string): Promise<IStrategy>;
    updateStrategy(input: IMinimalStrategy, userName: string): Promise<void>;
    private _validateStrategyName;
    _validateEditable(strategy: IStrategy): void;
}
export default StrategyService;
