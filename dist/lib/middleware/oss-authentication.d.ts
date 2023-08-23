import { Application } from 'express';
import { LogProvider } from '../logger';
declare function ossAuthHook(app: Application, getLogger: LogProvider, baseUriPath: string): void;
export default ossAuthHook;
