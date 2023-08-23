import { IPatStore } from '../../lib/types/stores/pat-store';
import { IPat } from '../../lib/types/models/pat';
export default class FakePatStore implements IPatStore {
    create(group: IPat): Promise<IPat>;
    delete(key: number): Promise<void>;
    deleteAll(): Promise<void>;
    destroy(): void;
    exists(key: number): Promise<boolean>;
    existsWithDescriptionByUser(description: string, userId: number): Promise<boolean>;
    countByUser(userId: number): Promise<number>;
    get(key: number): Promise<IPat>;
    getAll(query?: Object): Promise<IPat[]>;
    getAllByUser(userId: number): Promise<IPat[]>;
    deleteForUser(id: number, userId: number): Promise<void>;
}
