import { ILegalValue } from '../../types/stores/context-field-store';
export declare const validateNumber: (value: unknown) => Promise<void>;
export declare const validateString: (value: unknown) => Promise<void>;
export declare const validateSemver: (value: unknown) => void;
export declare const validateDate: (value: unknown) => Promise<void>;
export declare const validateLegalValues: (legalValues: Readonly<ILegalValue[]>, match: string[] | string) => void;
