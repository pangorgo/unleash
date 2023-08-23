export declare type PartialDeep<T> = T extends object ? {
    [P in keyof T]?: PartialDeep<T[P]>;
} : T;
export declare type PartialSome<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export declare type WithRequired<T, K extends keyof T> = T & {
    [P in K]-?: T[P];
};
