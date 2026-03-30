"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MikroOrmExceptionFilter = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
let MikroOrmExceptionFilter = class MikroOrmExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const { code } = exception;
        const errorResponse = {
            statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Database error occurred',
            timestamp: new Date().toISOString(),
            path: request.url,
            detail: exception.message,
        };
        switch (code) {
            case '23503': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Foreign key constraint violation';
                break;
            }
            case '23505': {
                errorResponse.statusCode = common_1.HttpStatus.CONFLICT;
                errorResponse.message = 'Unique constraint violation';
                break;
            }
            case '23502': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Required field is missing';
                break;
            }
            case '23514': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Check constraint violation';
                break;
            }
            case '23000': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Integrity constraint violation';
                break;
            }
            case '23001': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Restrict violation';
                break;
            }
            case '23504': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Foreign key violation: no action';
                break;
            }
            case '22000': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Data exception';
                break;
            }
            case '22001': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'String data right truncation';
                break;
            }
            case '22003': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Numeric value out of range';
                break;
            }
            case '22007': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Invalid datetime format';
                break;
            }
            case '22008': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Datetime field overflow';
                break;
            }
            case '22012': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Division by zero';
                break;
            }
            case '22026': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'String data length mismatch';
                break;
            }
            case '42601': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Syntax error';
                break;
            }
            case '42501': {
                errorResponse.statusCode = common_1.HttpStatus.FORBIDDEN;
                errorResponse.message = 'Insufficient privilege';
                break;
            }
            case '42602': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Invalid name';
                break;
            }
            case '42622': {
                errorResponse.statusCode = common_1.HttpStatus.BAD_REQUEST;
                errorResponse.message = 'Name too long';
                break;
            }
            case '08000': {
                errorResponse.statusCode = common_1.HttpStatus.SERVICE_UNAVAILABLE;
                errorResponse.message = 'Connection exception';
                break;
            }
            case '08003': {
                errorResponse.statusCode = common_1.HttpStatus.SERVICE_UNAVAILABLE;
                errorResponse.message = 'Connection does not exist';
                break;
            }
            case '08006': {
                errorResponse.statusCode = common_1.HttpStatus.SERVICE_UNAVAILABLE;
                errorResponse.message = 'Connection failure';
                break;
            }
            case '53000': {
                errorResponse.statusCode = common_1.HttpStatus.SERVICE_UNAVAILABLE;
                errorResponse.message = 'Insufficient resources';
                break;
            }
            case '53100': {
                errorResponse.statusCode = common_1.HttpStatus.SERVICE_UNAVAILABLE;
                errorResponse.message = 'Disk full';
                break;
            }
            case '53200': {
                errorResponse.statusCode = common_1.HttpStatus.SERVICE_UNAVAILABLE;
                errorResponse.message = 'Out of memory';
                break;
            }
            case '53300': {
                errorResponse.statusCode = common_1.HttpStatus.SERVICE_UNAVAILABLE;
                errorResponse.message = 'Too many connections';
                break;
            }
            case '40001': {
                errorResponse.statusCode = common_1.HttpStatus.CONFLICT;
                errorResponse.message = 'Serialization failure';
                break;
            }
            case '40003': {
                errorResponse.statusCode = common_1.HttpStatus.CONFLICT;
                errorResponse.message = 'Statement completion unknown';
                break;
            }
            case undefined: {
                errorResponse.statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                errorResponse.message = 'An unexpected database error occurred';
                break;
            }
            default: {
                errorResponse.statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                errorResponse.message = 'An unexpected database error occurred';
            }
        }
        response.status(errorResponse.statusCode).json(errorResponse);
    }
};
exports.MikroOrmExceptionFilter = MikroOrmExceptionFilter;
exports.MikroOrmExceptionFilter = MikroOrmExceptionFilter = __decorate([
    (0, common_1.Catch)(core_1.DriverException)
], MikroOrmExceptionFilter);
//# sourceMappingURL=mikro-orm-exception.filter.js.map