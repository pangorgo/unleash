import { OpenAPIV3 } from 'openapi-types';
import { IServerOption } from '../types';
export declare type SchemaId = typeof schemas[keyof typeof schemas]['$id'];
export declare type SchemaRef = typeof schemas[keyof typeof schemas]['components'];
export interface JsonSchemaProps {
    $id: string;
    components: object;
}
declare type SchemaWithMandatoryFields = Partial<Omit<OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject, '$id' | 'components'>> & JsonSchemaProps;
interface UnleashSchemas {
    [name: string]: SchemaWithMandatoryFields;
}
interface OpenAPIV3DocumentWithServers extends OpenAPIV3.Document {
    servers: OpenAPIV3.ServerObject[];
}
export declare const schemas: UnleashSchemas;
export declare const removeJsonSchemaProps: <T extends JsonSchemaProps>(schema: T) => OpenAPIV3.SchemaObject;
export declare const createOpenApiSchema: ({ unleashUrl, baseUriPath, }: Pick<IServerOption, 'unleashUrl' | 'baseUriPath'>) => Omit<OpenAPIV3DocumentWithServers, 'paths'>;
export * from './util';
export * from './spec';
