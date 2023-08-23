"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const time_utils_1 = require("./time-utils");
test('generateHourBuckets', () => {
    const result = (0, time_utils_1.generateHourBuckets)(24);
    expect(result).toHaveLength(24);
});
//# sourceMappingURL=time-utils.test.js.map