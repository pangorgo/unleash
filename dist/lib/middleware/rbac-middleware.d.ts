import { IUnleashConfig } from '../types/option';
import { IUnleashStores } from '../types/stores';
import User from '../types/user';
interface PermissionChecker {
    hasPermission(user: User, permissions: string[], projectId?: string, environment?: string): Promise<boolean>;
}
declare const rbacMiddleware: (config: Pick<IUnleashConfig, 'getLogger'>, { featureToggleStore }: Pick<IUnleashStores, 'featureToggleStore'>, accessService: PermissionChecker) => any;
export default rbacMiddleware;
