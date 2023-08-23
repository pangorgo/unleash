"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("./validate");
test('validateSchema', () => {
    expect(() => (0, validate_1.validateSchema)('unknownSchemaId', {})).toThrow('no schema with key or ref "unknownSchemaId"');
});
//# sourceMappingURL=validate.test.js.map