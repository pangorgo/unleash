"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKnexTransactionStarter = void 0;
const createKnexTransactionStarter = (knex) => {
    function transaction(scope) {
        return knex.transaction(scope);
    }
    return transaction;
};
exports.createKnexTransactionStarter = createKnexTransactionStarter;
//# sourceMappingURL=transaction.js.map