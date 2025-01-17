import { StorageProvider } from './storage-provider';
export default class InMemStorageProvider<T> implements StorageProvider<T> {
    private store;
    set(key: string, data: T): Promise<void>;
    get(key: string): Promise<T | undefined>;
}
