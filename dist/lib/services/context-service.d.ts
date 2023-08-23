import { IContextField, IContextFieldDto } from '../types/stores/context-field-store';
import { IUnleashStores } from '../types/stores';
import { IUnleashConfig } from '../types/option';
import { ContextFieldStrategiesSchema } from '../openapi/spec/context-field-strategies-schema';
declare class ContextService {
    private projectStore;
    private eventStore;
    private contextFieldStore;
    private featureStrategiesStore;
    private logger;
    constructor({ projectStore, eventStore, contextFieldStore, featureStrategiesStore, }: Pick<IUnleashStores, 'projectStore' | 'eventStore' | 'contextFieldStore' | 'featureStrategiesStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    getAll(): Promise<IContextField[]>;
    getContextField(name: string): Promise<IContextField>;
    getStrategiesByContextField(name: string): Promise<ContextFieldStrategiesSchema>;
    createContextField(value: IContextFieldDto, userName: string): Promise<IContextField>;
    updateContextField(updatedContextField: IContextFieldDto, userName: string): Promise<void>;
    deleteContextField(name: string, userName: string): Promise<void>;
    validateUniqueName({ name, }: Pick<IContextFieldDto, 'name'>): Promise<void>;
    validateName(name: string): Promise<void>;
}
export default ContextService;
