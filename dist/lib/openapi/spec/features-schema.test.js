"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
test('featuresSchema', () => {
    const data = {
        version: 1,
        features: [],
    };
    expect((0, validate_1.validateSchema)('#/components/schemas/featuresSchema', data)).toBeUndefined();
});
//# sourceMappingURL=features-schema.test.js.map