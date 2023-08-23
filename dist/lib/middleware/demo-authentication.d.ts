import { Application } from 'express';
import { IUnleashServices } from '../types/services';
import { IUnleashConfig } from '../types/option';
declare function demoAuthentication(app: Application, basePath: string, // eslint-disable-line
{ userService }: Pick<IUnleashServices, 'userService'>, { authentication }: Pick<IUnleashConfig, 'authentication'>): void;
export default demoAuthentication;
