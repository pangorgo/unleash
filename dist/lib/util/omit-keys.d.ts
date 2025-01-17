export interface OmitKeys {
    <T extends object, K extends [...(keyof T)[]]>(obj: T, ...keys: K): {
        [K2 in Exclude<keyof T, K[number]>]: T[K2];
    };
}
export declare const omitKeys: OmitKeys;
