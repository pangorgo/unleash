import { RequestHandler } from 'express';
import { IUnleashConfig } from '../types/option';
declare const requestLogger: (config: IUnleashConfig) => RequestHandler;
export default requestLogger;
