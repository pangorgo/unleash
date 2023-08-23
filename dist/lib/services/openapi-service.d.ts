import { Express, RequestHandler, Response } from 'express';
import { IUnleashConfig } from '../types/option';
import { JsonSchemaProps, SchemaId } from '../openapi';
import { ApiOperation } from '../openapi/util/api-operation';
export declare class OpenApiService {
    private readonly config;
    private readonly logger;
    private readonly api;
    private flagResolver;
    constructor(config: IUnleashConfig);
    validPath(op: ApiOperation): RequestHandler;
    useDocs(app: Express): void;
    docsPath(): string;
    registerCustomSchemas<T extends JsonSchemaProps>(schemas: Record<string, T>): void;
    useErrorHandler(app: Express): void;
    respondWithValidation<T, S = SchemaId>(status: number, res: Response<T>, schema: S, data: T, headers?: {
        [header: string]: string;
    }): void;
}
