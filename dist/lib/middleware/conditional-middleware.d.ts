import { RequestHandler } from 'express';
export declare const conditionalMiddleware: (condition: () => boolean, middleware: RequestHandler) => RequestHandler;
