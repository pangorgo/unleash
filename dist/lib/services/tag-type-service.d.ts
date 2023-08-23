import { IUnleashStores } from '../types/stores';
import { ITagType } from '../types/stores/tag-type-store';
import { IUnleashConfig } from '../types/option';
export default class TagTypeService {
    private tagTypeStore;
    private eventStore;
    private logger;
    constructor({ tagTypeStore, eventStore, }: Pick<IUnleashStores, 'tagTypeStore' | 'eventStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    getAll(): Promise<ITagType[]>;
    getTagType(name: string): Promise<ITagType>;
    createTagType(newTagType: ITagType, userName: string): Promise<ITagType>;
    validateUnique(name: string): Promise<boolean>;
    validate(tagType: Partial<ITagType> | undefined): Promise<void>;
    deleteTagType(name: string, userName: string): Promise<void>;
    updateTagType(updatedTagType: ITagType, userName: string): Promise<ITagType>;
}
