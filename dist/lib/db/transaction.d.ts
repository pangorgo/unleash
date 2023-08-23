import { Knex } from 'knex';
export declare type KnexTransaction = Knex.Transaction;
export declare type MockTransaction = null;
export declare type UnleashTransaction = KnexTransaction | MockTransaction;
export declare type TransactionCreator<S> = <T>(scope: (trx: S) => void | Promise<T>) => Promise<T>;
export declare const createKnexTransactionStarter: (knex: Knex) => TransactionCreator<UnleashTransaction>;
