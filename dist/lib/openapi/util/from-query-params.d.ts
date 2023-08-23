import { FromSchema, JSONSchema } from 'json-schema-to-ts';
import { O, L, A } from 'ts-toolbelt';
declare type OpenApiParam = {
    readonly name: string;
    readonly schema: JSONSchema;
    readonly in: 'query' | 'path' | 'header' | 'cookie';
};
declare type RecurseOnParams<P extends readonly OpenApiParam[], R extends O.Object = {}> = {
    continue: RecurseOnParams<L.Tail<P>, L.Head<P>['in'] extends 'query' ? R & {
        [key in L.Head<P>['name']]: FromSchema<L.Head<P>['schema']>;
    } : R>;
    stop: A.Compute<R>;
}[P extends readonly [OpenApiParam, ...OpenApiParam[]] ? 'continue' : 'stop'];
export declare type FromQueryParams<P extends readonly OpenApiParam[]> = RecurseOnParams<P>;
export {};
