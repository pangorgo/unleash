import { ITagType, ITagTypeStore } from '../../lib/types/stores/tag-type-store';
export default class FakeTagTypeStore implements ITagTypeStore {
    tagTypes: ITagType[];
    bulkImport(tagTypes: ITagType[]): Promise<ITagType[]>;
    createTagType(newTagType: ITagType): Promise<void>;
    delete(key: string): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists(key: string): Promise<boolean>;
    get(key: string): Promise<ITagType>;
    getAll(): Promise<ITagType[]>;
    updateTagType(tagType: ITagType): Promise<void>;
}
