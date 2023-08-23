import { IUnleashConfig } from './lib/types/option';
export declare function migrateDb({ db }: IUnleashConfig): Promise<void>;
export declare function resetDb({ db }: IUnleashConfig): Promise<void>;
