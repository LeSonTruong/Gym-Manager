"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LoggerMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("./logger.service");
let LoggerMiddleware = LoggerMiddleware_1 = class LoggerMiddleware {
    logger;
    constructor(logger) {
        this.logger = logger;
        logger.setContext(LoggerMiddleware_1.name);
    }
    use(req, response, next) {
        const { ip, method, originalUrl } = req;
        const startTime = Date.now();
        const requestHeader = JSON.stringify(req.headers);
        const requestBody = JSON.stringify(req.body);
        response.on('finish', () => {
            const duration = Date.now() - startTime;
            if (response.statusCode >= 200 && response.statusCode < 400) {
                this.logger.log(`[${method}] ${originalUrl} - Status: ${response.statusCode} - IP: ${ip} - ${duration}ms`);
            }
            else if (response.statusCode >= 400 && response.statusCode < 500) {
                this.logger.warn(`[${method}] ${originalUrl} - Status: ${response.statusCode} - IP: ${ip} - ${duration}ms`);
                this.logger.warn(`Request Warning: ${req.method} ${req.originalUrl} - Status: ${response.statusCode}`);
                this.logger.warn(`Request Header: ${requestHeader}`);
                this.logger.warn(`Request Body: ${requestBody}`);
            }
            else if (response.statusCode >= 500) {
                this.logger.error(`[${method}] ${originalUrl} - Status: ${response.statusCode} - IP: ${ip} - ${duration}ms`);
                this.logger.error(`Request Error: ${req.method} ${req.originalUrl} - Status: ${response.statusCode}`);
                this.logger.error(`Request Header: ${requestHeader}`);
                this.logger.error(`Request Body: ${requestBody}`);
            }
        });
        response.on('error', (err) => {
            const duration = Date.now() - startTime;
            this.logger.error(`[${method}] ${originalUrl} - IP: ${ip} - ${duration}ms - Error: ${err.message}`);
            this.logger.error(`Request Header: ${requestHeader}`);
            this.logger.error(`Request Body: ${requestBody}`);
        });
        next();
    }
};
exports.LoggerMiddleware = LoggerMiddleware;
exports.LoggerMiddleware = LoggerMiddleware = LoggerMiddleware_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.Logger])
], LoggerMiddleware);
//# sourceMappingURL=logger.middleware.js.map