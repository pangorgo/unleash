export declare type DeepMutable<T> = {
    -readonly [P in keyof T]: DeepMutable<T[P]>;
};
export declare type DeepImmutable<T> = {
    readonly [P in keyof T]: DeepImmutable<T[P]>;
};
