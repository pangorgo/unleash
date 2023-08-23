/// <reference types="node" />
import { IApiTokenStore } from '../../lib/types/stores/api-token-store';
import { IApiToken, IApiTokenCreate } from '../../lib/types/models/api-token';
import EventEmitter from 'events';
export default class FakeApiTokenStore extends EventEmitter implements IApiTokenStore {
    tokens: IApiToken[];
    delete(key: string): Promise<void>;
    count(): Promise<number>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists(key: string): Promise<boolean>;
    get(key: string): Promise<IApiToken>;
    getAll(): Promise<IApiToken[]>;
    getAllActive(): Promise<IApiToken[]>;
    insert(newToken: IApiTokenCreate): Promise<IApiToken>;
    markSeenAt(secrets: string[]): Promise<void>;
    setExpiry(secret: string, expiresAt: Date): Promise<IApiToken>;
}
