import { ErrorObject } from 'ajv';
import { SchemaId } from './index';
export interface ISchemaValidationErrors<S = SchemaId> {
    schema: S;
    errors: ErrorObject[];
}
export declare const addAjvSchema: (schemaObjects: any[]) => any;
export declare const validateSchema: <S = string>(schema: S, data: unknown) => ISchemaValidationErrors<S>;
