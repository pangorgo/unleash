"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const owasp_password_strength_test_1 = __importDefault(require("owasp-password-strength-test"));
const authentication_required_1 = __importDefault(require("../types/authentication-required"));
const bad_data_error_1 = __importStar(require("./bad-data-error"));
const permission_error_1 = __importDefault(require("./permission-error"));
const owasp_validation_error_1 = __importDefault(require("./owasp-validation-error"));
const incompatible_project_error_1 = __importDefault(require("./incompatible-project-error"));
const password_undefined_1 = __importDefault(require("./password-undefined"));
const project_without_owner_error_1 = __importDefault(require("./project-without-owner-error"));
const notfound_error_1 = __importDefault(require("./notfound-error"));
const constraint_types_1 = require("../util/validators/constraint-types");
const from_legacy_error_1 = require("./from-legacy-error");
describe('v5 deprecation: backwards compatibility', () => {
    it(`Adds details to error types that don't specify it`, () => {
        const message = `Error!`;
        const error = new notfound_error_1.default(message).toJSON();
        expect(error).toMatchObject({
            message,
            details: [
                {
                    message,
                    description: message,
                },
            ],
        });
    });
});
describe('Standard/legacy error conversion', () => {
    it('Moves message to the details list for baddataerror', () => {
        const message = `: message!`;
        const result = (0, from_legacy_error_1.fromLegacyError)(new bad_data_error_1.default(message)).toJSON();
        expect(result.details).toStrictEqual([
            {
                message,
                description: message,
            },
        ]);
    });
});
describe('OpenAPI error conversion', () => {
    it('Gives useful error messages for missing properties', () => {
        const error = {
            keyword: 'required',
            instancePath: '',
            dataPath: '.body',
            schemaPath: '#/components/schemas/addonCreateUpdateSchema/required',
            params: {
                missingProperty: 'enabled',
            },
            message: "should have required property 'enabled'",
        };
        const result = (0, bad_data_error_1.fromOpenApiValidationError)({})(error);
        expect(result).toMatchObject({
            description: 
            // it tells the user that the property is required
            expect.stringContaining('required'),
            path: 'enabled',
        });
        // it tells the user the name of the missing property
        expect(result.description).toContain(error.params.missingProperty);
    });
    it('Gives useful error messages for type errors', () => {
        const error = {
            keyword: 'type',
            instancePath: '',
            dataPath: '.body.parameters',
            schemaPath: '#/components/schemas/addonCreateUpdateSchema/properties/parameters/type',
            params: {
                type: 'object',
            },
            message: 'should be object',
        };
        const parameterValue = [];
        const result = (0, bad_data_error_1.fromOpenApiValidationError)({
            parameters: parameterValue,
        })(error);
        expect(result).toMatchObject({
            description: 
            // it provides the message
            expect.stringContaining(error.message),
            path: 'parameters',
        });
        // it tells the user what they provided
        expect(result.description).toContain(JSON.stringify(parameterValue));
    });
    it.each(['.body', '.body.subObject'])('Gives useful error messages for oneOf errors in %s', (dataPath) => {
        const error = {
            keyword: 'oneOf',
            instancePath: '',
            dataPath,
            schemaPath: '#/components/schemas/createApiTokenSchema/oneOf',
            params: {
                passingSchemas: null,
            },
            message: 'should match exactly one schema in oneOf',
        };
        const result = (0, bad_data_error_1.fromOpenApiValidationError)({
            secret: 'blah',
            username: 'string2',
            type: 'admin',
        })(error);
        expect(result).toMatchObject({
            description: 
            // it provides the message
            expect.stringContaining(error.message),
            path: dataPath.substring('.body.'.length),
        });
        // it tells the user what happened
        expect(result.description).toContain('matches more than one option');
        // it tells the user what part of the request body this pertains to
        expect(result.description).toContain(dataPath === '.body'
            ? 'root object'
            : `${dataPath.substring('.body.'.length)} property`);
    });
    it('Gives useful pattern error messages', () => {
        const error = {
            instancePath: '',
            keyword: 'pattern',
            dataPath: '.body.description',
            schemaPath: '#/components/schemas/addonCreateUpdateSchema/properties/description/pattern',
            params: {
                pattern: '^this is',
            },
            message: 'should match pattern "^this is"',
        };
        const requestDescription = 'A pattern that does not match.';
        const result = (0, bad_data_error_1.fromOpenApiValidationError)({
            description: requestDescription,
        })(error);
        expect(result).toMatchObject({
            description: expect.stringContaining(error.params.pattern),
            path: 'description',
        });
        expect(result.description).toContain('description');
        expect(result.description).toContain(requestDescription);
    });
    it('Gives useful min/maxlength error messages', () => {
        const error = {
            instancePath: '',
            keyword: 'maxLength',
            dataPath: '.body.description',
            schemaPath: '#/components/schemas/addonCreateUpdateSchema/properties/description/maxLength',
            params: {
                limit: 5,
            },
            message: 'should NOT be longer than 5 characters',
        };
        const requestDescription = 'Longer than the max length';
        const result = (0, bad_data_error_1.fromOpenApiValidationError)({
            description: requestDescription,
        })(error);
        expect(result).toMatchObject({
            description: 
            // it tells the user what the limit is
            expect.stringContaining(error.params.limit.toString()),
        });
        // it tells the user which property it pertains to
        expect(result.description).toContain('description');
        // it tells the user what they provided
        expect(result.description).toContain(requestDescription);
    });
    it('Handles numerical min/max errors', () => {
        const error = {
            keyword: 'maximum',
            instancePath: '',
            dataPath: '.body.newprop',
            schemaPath: '#/components/schemas/addonCreateUpdateSchema/properties/newprop/maximum',
            params: {
                comparison: '<=',
                limit: 5,
                exclusive: false,
            },
            message: 'should be <= 5',
        };
        const propertyValue = 6;
        const result = (0, bad_data_error_1.fromOpenApiValidationError)({
            newprop: propertyValue,
        })(error);
        expect(result).toMatchObject({
            description: 
            // it tells the user what the limit is
            expect.stringContaining(error.params.limit.toString()),
        });
        // it tells the user what kind of comparison it performed
        expect(result.description).toContain(error.params.comparison);
        // it tells the user which property it pertains to
        expect(result.description).toContain('newprop');
        // it tells the user what they provided
        expect(result.description).toContain(propertyValue.toString());
    });
    it('Handles multiple errors', () => {
        const errors = [
            {
                keyword: 'maximum',
                instancePath: '',
                // @ts-expect-error
                dataPath: '.body.newprop',
                schemaPath: '#/components/schemas/addonCreateUpdateSchema/properties/newprop/maximum',
                params: {
                    comparison: '<=',
                    limit: 5,
                    exclusive: false,
                },
                message: 'should be <= 5',
            },
            {
                keyword: 'required',
                instancePath: '',
                dataPath: '.body',
                schemaPath: '#/components/schemas/addonCreateUpdateSchema/required',
                params: {
                    missingProperty: 'enabled',
                },
                message: "should have required property 'enabled'",
            },
        ];
        // create an error and serialize it as it would be shown to the end user.
        const serializedUnleashError = (0, bad_data_error_1.fromOpenApiValidationErrors)({ newprop: 7 }, errors).toJSON();
        expect(serializedUnleashError).toMatchObject({
            name: 'BadDataError',
            message: expect.stringContaining('`details`'),
            details: [
                {
                    description: expect.stringContaining('newprop'),
                },
                {
                    description: expect.stringContaining('enabled'),
                },
            ],
        });
    });
    describe('Disallowed additional properties', () => {
        it('gives useful messages for base-level properties', () => {
            const openApiError = {
                keyword: 'additionalProperties',
                instancePath: '',
                dataPath: '.body',
                schemaPath: '#/components/schemas/addonCreateUpdateSchema/additionalProperties',
                params: { additionalProperty: 'bogus' },
                message: 'should NOT have additional properties',
            };
            const error = (0, bad_data_error_1.fromOpenApiValidationError)({ bogus: 5 })(openApiError);
            expect(error).toMatchObject({
                description: expect.stringContaining(openApiError.params.additionalProperty),
                path: 'bogus',
            });
            expect(error.description).toMatch(/\broot\b/i);
            expect(error.description).toMatch(/\badditional properties\b/i);
        });
        it('gives useful messages for nested properties', () => {
            const request2 = {
                nestedObject: {
                    nested2: { extraPropertyName: 'illegal property' },
                },
            };
            const openApiError = {
                keyword: 'additionalProperties',
                instancePath: '',
                dataPath: '.body.nestedObject.nested2',
                schemaPath: '#/components/schemas/addonCreateUpdateSchema/properties/nestedObject/properties/nested2/additionalProperties',
                params: { additionalProperty: 'extraPropertyName' },
                message: 'should NOT have additional properties',
            };
            const error = (0, bad_data_error_1.fromOpenApiValidationError)(request2)(openApiError);
            expect(error).toMatchObject({
                description: expect.stringContaining('nestedObject.nested2'),
                path: 'nestedObject.nested2.extraPropertyName',
            });
            expect(error.description).toContain(openApiError.params.additionalProperty);
            expect(error.description).toMatch(/\badditional properties\b/i);
        });
    });
    it('Handles deeply nested properties gracefully', () => {
        const error = {
            keyword: 'type',
            dataPath: '.body.nestedObject.a.b',
            schemaPath: '#/components/schemas/addonCreateUpdateSchema/properties/nestedObject/properties/a/properties/b/type',
            params: { type: 'string' },
            message: 'should be string',
            instancePath: '',
        };
        const result = (0, bad_data_error_1.fromOpenApiValidationError)({
            nestedObject: { a: { b: [] } },
        })(error);
        expect(result).toMatchObject({
            description: expect.stringMatching(/\bnestedObject.a.b\b/),
            path: 'nestedObject.a.b',
        });
        expect(result.description).toContain('[]');
    });
    it('Handles deeply nested properties on referenced schemas', () => {
        const error = {
            keyword: 'type',
            dataPath: '.body.nestedObject.a.b',
            schemaPath: '#/components/schemas/parametersSchema/type',
            params: { type: 'object' },
            message: 'should be object',
            instancePath: '',
        };
        const illegalValue = 'illegal string';
        const result = (0, bad_data_error_1.fromOpenApiValidationError)({
            nestedObject: { a: { b: illegalValue } },
        })(error);
        expect(result).toMatchObject({
            description: expect.stringContaining(illegalValue),
            path: 'nestedObject.a.b',
        });
        expect(result.description).toMatch(/\bnestedObject.a.b\b/);
    });
});
describe('Error serialization special cases', () => {
    it('OwaspValidationErrors: adds `validationErrors` to `details`', () => {
        const results = owasp_password_strength_test_1.default.test('123');
        const error = new owasp_validation_error_1.default(results);
        const json = (0, from_legacy_error_1.fromLegacyError)(error).toJSON();
        expect(json).toMatchObject({
            details: [
                {
                    message: results.errors[0],
                    validationErrors: results.errors,
                },
            ],
        });
    });
    it('Converts Joi errors in a sensible fashion', async () => {
        // if the validation doesn't fail, this test does nothing, so ensure
        // that an error is thrown.
        let validationThrewAnError = false;
        try {
            await (0, constraint_types_1.validateString)([]);
        }
        catch (e) {
            validationThrewAnError = true;
            const convertedError = (0, from_legacy_error_1.fromLegacyError)(e);
            const result = convertedError.toJSON();
            expect(result).toMatchObject({
                message: expect.stringContaining('details'),
                details: [
                    {
                        description: '"value" must contain at least 1 items. You provided [].',
                    },
                ],
            });
            expect(result.message).toContain('validation');
        }
        expect(validationThrewAnError).toBeTruthy();
    });
});
describe('Error serialization special cases', () => {
    it('AuthenticationRequired: adds `path` and `type`', () => {
        const type = 'password';
        const path = '/api/login';
        const error = new authentication_required_1.default({
            type,
            path,
            message: 'this is a message',
        });
        const json = error.toJSON();
        expect(json).toMatchObject({ path, type });
    });
    it('AuthenticationRequired adds `options` if they are present', () => {
        const config = {
            type: 'password',
            path: `base-path/auth/simple/login`,
            message: 'You must sign in order to use Unleash',
            defaultHidden: true,
            options: [
                {
                    type: 'google',
                    message: 'Sign in with Google',
                    path: `base-path/auth/google/login`,
                },
            ],
        };
        const json = new authentication_required_1.default(config).toJSON();
        expect(json).toMatchObject(config);
    });
    it('NoAccessError: adds `permissions`', () => {
        const permission = 'x';
        const error = new permission_error_1.default(permission);
        const json = error.toJSON();
        expect(json.permissions).toStrictEqual([permission]);
    });
    it('NoAccessError: supports multiple permissions', () => {
        const permission = ['x', 'y', 'z'];
        const error = new permission_error_1.default(permission);
        const json = error.toJSON();
        expect(json.permissions).toStrictEqual(permission);
    });
    it('BadDataError: adds `details` with error details', () => {
        const description = 'You did **this** wrong';
        const error = new bad_data_error_1.default(description).toJSON();
        expect(error).toMatchObject({
            details: [
                {
                    message: description,
                    description,
                },
            ],
        });
    });
    it('OwaspValidationErrors: adds `validationErrors` to `details`', () => {
        const results = owasp_password_strength_test_1.default.test('123');
        const error = new owasp_validation_error_1.default(results);
        const json = error.toJSON();
        expect(json).toMatchObject({
            message: results.errors[0],
            details: [
                {
                    message: results.errors[0],
                    validationErrors: results.errors,
                },
            ],
        });
    });
    it('IncompatibleProjectError: adds `validationErrors: []` to the `details` list', () => {
        const targetProject = '8927CCCA-AD39-46E2-9D83-8E50D9AACE75';
        const error = new incompatible_project_error_1.default(targetProject);
        const json = error.toJSON();
        expect(json).toMatchObject({
            details: [
                {
                    validationErrors: [],
                    message: expect.stringContaining(targetProject),
                },
            ],
        });
    });
    it('PasswordUndefinedError: adds `validationErrors: []` to the `details` list', () => {
        const error = new password_undefined_1.default();
        const json = error.toJSON();
        expect(json).toMatchObject({
            details: [
                {
                    validationErrors: [],
                    message: json.message,
                },
            ],
        });
    });
    it('ProjectWithoutOwnerError: adds `validationErrors: []` to the `details` list', () => {
        const error = new project_without_owner_error_1.default();
        const json = error.toJSON();
        expect(json).toMatchObject({
            details: [
                {
                    validationErrors: [],
                    message: json.message,
                },
            ],
        });
    });
});
describe('Stack traces', () => {
    it('captures stack traces regardless of whether `Error.captureStackTrace` is called explicitly or not', () => {
        const e = new password_undefined_1.default();
        expect(e.stack).toBeTruthy();
    });
});
//# sourceMappingURL=unleash-error.test.js.map