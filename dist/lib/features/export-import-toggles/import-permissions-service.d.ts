import { IImportTogglesStore } from './import-toggles-store-type';
import { AccessService, ContextService, TagTypeService } from '../../services';
import { ImportTogglesSchema } from '../../openapi';
import User from '../../types/user';
declare type Mode = 'regular' | 'change_request';
export declare class ImportPermissionsService {
    private importTogglesStore;
    private accessService;
    private tagTypeService;
    private contextService;
    private getNewTagTypes;
    private getNewContextFields;
    constructor(importTogglesStore: IImportTogglesStore, accessService: AccessService, tagTypeService: TagTypeService, contextService: ContextService);
    getMissingPermissions(dto: ImportTogglesSchema, user: User, mode: Mode): Promise<string[]>;
    verifyPermissions(dto: ImportTogglesSchema, user: User, mode: Mode): Promise<void>;
}
export {};
