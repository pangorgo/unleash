import { RequestHandler } from 'express';
import { IUnleashConfig } from '../types';
declare const secureHeaders: (config: IUnleashConfig) => RequestHandler;
export default secureHeaders;
