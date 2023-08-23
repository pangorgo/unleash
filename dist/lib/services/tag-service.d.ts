import { IUnleashStores } from '../types/stores';
import { IUnleashConfig } from '../types/option';
import { ITag } from '../types/model';
export default class TagService {
    private tagStore;
    private eventStore;
    private logger;
    constructor({ tagStore, eventStore, }: Pick<IUnleashStores, 'tagStore' | 'eventStore'>, { getLogger }: Pick<IUnleashConfig, 'getLogger'>);
    getTags(): Promise<ITag[]>;
    getTagsByType(type: string): Promise<ITag[]>;
    getTag({ type, value }: ITag): Promise<ITag>;
    validateUnique(tag: ITag): Promise<void>;
    validate(tag: ITag): Promise<ITag>;
    createTag(tag: ITag, userName: string): Promise<ITag>;
    deleteTag(tag: ITag, userName: string): Promise<void>;
}
