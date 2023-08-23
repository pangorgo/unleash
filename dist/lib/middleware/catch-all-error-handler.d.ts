import { ErrorRequestHandler } from 'express';
import { LogProvider } from '../logger';
export declare const catchAllErrorHandler: (logProvider: LogProvider) => ErrorRequestHandler;
