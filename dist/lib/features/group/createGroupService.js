"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupService = void 0;
const services_1 = require("../../services");
const group_store_1 = __importDefault(require("../../db/group-store"));
const account_store_1 = require("../../db/account-store");
const event_store_1 = __importDefault(require("../../db/event-store"));
const createGroupService = (db, config) => {
    const { getLogger } = config;
    const groupStore = new group_store_1.default(db);
    const accountStore = new account_store_1.AccountStore(db, getLogger);
    const eventStore = new event_store_1.default(db, getLogger);
    const groupService = new services_1.GroupService({ groupStore, eventStore, accountStore }, { getLogger });
    return groupService;
};
exports.createGroupService = createGroupService;
//# sourceMappingURL=createGroupService.js.map