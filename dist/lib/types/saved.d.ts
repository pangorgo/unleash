export declare type Saved<T extends {}, Id extends string | number = string> = T & {
    id: Id;
};
export declare type Unsaved<T extends {}> = Omit<T, 'id'>;
