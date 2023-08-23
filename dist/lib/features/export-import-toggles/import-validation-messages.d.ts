import { FeatureStrategySchema, ImportTogglesValidateItemSchema } from '../../openapi';
import { IContextFieldDto } from '../../types/stores/context-field-store';
export declare class ImportValidationMessages {
    static compilePermissionErrors(missingPermissions: string[]): ImportTogglesValidateItemSchema[];
    static compileErrors(projectName: string, strategies: FeatureStrategySchema[], contextFields: IContextFieldDto[], segments: string[], otherProjectFeatures: string[], changeRequestExists: boolean): ImportTogglesValidateItemSchema[];
    static compileWarnings(usedCustomStrategies: string[], archivedFeatures: string[]): ImportTogglesValidateItemSchema[];
}
