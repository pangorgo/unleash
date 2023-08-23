"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromJoiError = exports.fromOpenApiValidationErrors = exports.fromOpenApiValidationError = void 0;
const lodash_get_1 = __importDefault(require("lodash.get"));
const unleash_error_1 = require("./unleash-error");
class BadDataError extends unleash_error_1.UnleashError {
    constructor(message, errors) {
        const topLevelMessage = 'Request validation failed: your request body or params contain invalid data' +
            (errors
                ? '. Refer to the `details` list for more information.'
                : `: ${message}`);
        super(topLevelMessage);
        this.statusCode = 400;
        this.details = errors ?? [{ message: message, description: message }];
    }
    toJSON() {
        return {
            ...super.toJSON(),
            details: this.details,
        };
    }
}
exports.default = BadDataError;
const constructPath = (pathToParent, propertyName) => [pathToParent, propertyName].filter(Boolean).join('.');
const missingRequiredPropertyMessage = (pathToParentObject, missingPropertyName) => {
    const path = constructPath(pathToParentObject, missingPropertyName);
    const description = `The ${path} property is required. It was not present on the data you sent.`;
    return {
        path,
        description,
        message: description,
    };
};
const additionalPropertiesMessage = (pathToParentObject, additionalPropertyName) => {
    const path = constructPath(pathToParentObject, additionalPropertyName);
    const description = `The ${pathToParentObject ? `\`${pathToParentObject}\`` : 'root'} object of the request body does not allow additional properties. Your request included the \`${path}\` property.`;
    return {
        path,
        description,
        message: description,
    };
};
const genericErrorMessage = (requestBody, propertyName, errorMessage = 'is invalid') => {
    const input = (0, lodash_get_1.default)(requestBody, propertyName);
    const youSent = JSON.stringify(input);
    const description = `The .${propertyName} property ${errorMessage}. You sent ${youSent}.`;
    return {
        description,
        message: description,
        path: propertyName,
    };
};
const oneOfMessage = (propertyName, errorMessage = 'is invalid') => {
    const errorPosition = propertyName === '' ? 'root object' : `${propertyName} property`;
    const description = `The ${errorPosition} ${errorMessage}. The data you provided matches more than one option in the schema. These options are mutually exclusive. Please refer back to the schema and remove any excess properties.`;
    return {
        description,
        message: description,
        path: propertyName,
    };
};
const fromOpenApiValidationError = (requestBody) => (validationError) => {
    // @ts-expect-error Unsure why, but the `dataPath` isn't listed on the type definition for error objects. However, it's always there. Suspect this is a bug in the library.
    const dataPath = validationError.dataPath;
    const propertyName = dataPath.substring('.body.'.length);
    switch (validationError.keyword) {
        case 'required':
            return missingRequiredPropertyMessage(propertyName, validationError.params.missingProperty);
        case 'additionalProperties':
            return additionalPropertiesMessage(propertyName, validationError.params.additionalProperty);
        case 'oneOf':
            return oneOfMessage(propertyName, validationError.message);
        default:
            return genericErrorMessage(requestBody, propertyName, validationError.message);
    }
};
exports.fromOpenApiValidationError = fromOpenApiValidationError;
const fromOpenApiValidationErrors = (requestBody, validationErrors) => {
    const [firstDetail, ...remainingDetails] = validationErrors.map((0, exports.fromOpenApiValidationError)(requestBody));
    return new BadDataError("Request validation failed: the payload you provided doesn't conform to the schema. Check the `details` property for a list of errors that we found.", [firstDetail, ...remainingDetails]);
};
exports.fromOpenApiValidationErrors = fromOpenApiValidationErrors;
const fromJoiError = (err) => {
    const details = err.details.map((detail) => {
        const messageEnd = detail.context?.value
            ? `. You provided ${JSON.stringify(detail.context.value)}.`
            : '.';
        const description = detail.message + messageEnd;
        return {
            description,
            message: description,
        };
    });
    const [first, ...rest] = details;
    if (first) {
        return new BadDataError('A validation error occurred while processing your request data. Refer to the `details` property for more information.', [first, ...rest]);
    }
    else {
        return new BadDataError('A validation error occurred while processing your request data. Please make sure it conforms to the request data schema.');
    }
};
exports.fromJoiError = fromJoiError;
//# sourceMappingURL=bad-data-error.js.map