import { RequestHandler } from 'express';
import { IUnleashConfig, IUnleashServices } from '../types';
export declare const resolveOrigin: (allowedOrigins: string[]) => string | string[];
export declare const corsOriginMiddleware: ({ proxyService }: Pick<IUnleashServices, 'proxyService'>, config: IUnleashConfig) => RequestHandler;
