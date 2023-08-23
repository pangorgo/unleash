"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHourBuckets = void 0;
const date_fns_1 = require("date-fns");
function generateHourBuckets(hours) {
    const start = (0, date_fns_1.startOfHour)(new Date());
    const result = [];
    for (let i = 0; i < hours; i++) {
        result.push({ timestamp: (0, date_fns_1.subHours)(start, i) });
    }
    return result;
}
exports.generateHourBuckets = generateHourBuckets;
//# sourceMappingURL=time-utils.js.map