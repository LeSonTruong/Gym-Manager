"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateHeader = void 0;
const common_1 = require("@nestjs/common");
exports.ValidateHeader = (0, common_1.createParamDecorator)((param, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const headerName = typeof param === 'string' ? param : param.headerName;
    const options = typeof param === 'string' ? {} : (param.options ?? {});
    const { expectedValue, caseSensitive = false, missingMessage, invalidValueMessage, allowEmpty = false } = options;
    const headerValue = request.headers[headerName.toLowerCase()];
    if (headerValue === undefined || headerValue === null || (!allowEmpty && headerValue === '')) {
        const message = missingMessage ?? `Missing required header: ${headerName}`;
        throw new common_1.NotAcceptableException(message);
    }
    if (expectedValue === undefined) {
        return headerValue;
    }
    const isValid = validateHeaderValue(headerValue, expectedValue, caseSensitive);
    if (!isValid) {
        const message = invalidValueMessage ??
            `Invalid value for header '${headerName}'. Expected: ${formatExpectedValue(expectedValue)}`;
        throw new common_1.NotAcceptableException(message);
    }
    return headerValue;
});
function validateHeaderValue(headerValue, expectedValue, caseSensitive) {
    const headerValues = Array.isArray(headerValue) ? headerValue : [headerValue];
    if (expectedValue instanceof RegExp) {
        return headerValues.some((value) => expectedValue.test(value));
    }
    if (typeof expectedValue === 'object' && !Array.isArray(expectedValue) && expectedValue !== null) {
        const enumValues = Object.values(expectedValue).map(String);
        return headerValues.some((headerVal) => enumValues.some((enumVal) => caseSensitive ? headerVal === enumVal : headerVal.toLowerCase() === enumVal.toLowerCase()));
    }
    const expectedValues = Array.isArray(expectedValue) ? expectedValue : [expectedValue];
    return headerValues.some((headerVal) => expectedValues.some((expectedVal) => caseSensitive ? headerVal === expectedVal : headerVal.toLowerCase() === expectedVal.toLowerCase()));
}
function formatExpectedValue(expectedValue) {
    if (expectedValue instanceof RegExp) {
        return expectedValue.toString();
    }
    if (Array.isArray(expectedValue)) {
        return expectedValue.join(' | ');
    }
    if (typeof expectedValue === 'object' && expectedValue !== null) {
        return Object.values(expectedValue).join(' | ');
    }
    return String(expectedValue);
}
//# sourceMappingURL=validate-header.decorator.js.map