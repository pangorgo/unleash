export declare const readFile: (file: string) => Promise<string>;
export declare const parseFile: (file: string, data: string) => any;
export declare const filterExisting: (keepExisting: boolean, existingArray: any[]) => (item: any) => boolean;
export declare const filterEqual: (existingArray: any[]) => (item: any) => boolean;
