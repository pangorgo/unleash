import { IUnleashConfig } from '../types';
declare const patMiddleware: ({ getLogger }: Pick<IUnleashConfig, 'getLogger'>, { accountService }: any) => any;
export default patMiddleware;
