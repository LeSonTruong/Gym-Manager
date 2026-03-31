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
var AuditLogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogService = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const gym_management_entity_1 = require("../entities/gym-management.entity");
let AuditLogService = AuditLogService_1 = class AuditLogService {
    orm;
    logger = new common_1.Logger(AuditLogService_1.name);
    constructor(orm) {
        this.orm = orm;
    }
    async createAuditLog(input) {
        const em = this.orm.em.fork();
        const changedByUser = input.changedByUserId
            ? await em.findOne(gym_management_entity_1.UserEntity, { id: input.changedByUserId })
            : undefined;
        const auditLogEntity = em.create(gym_management_entity_1.AuditLogEntity, {
            action: input.action,
            resource: input.resource,
            recordId: input.recordId ?? null,
            changedByUser: changedByUser ?? null,
            method: input.method,
            path: input.path,
            statusCode: input.statusCode,
            requestBody: this.toSafePayload(input.requestBody),
            responseBody: this.toSafePayload(input.responseBody),
        });
        em.persist(auditLogEntity);
        try {
            await em.flush();
        }
        catch (error) {
            this.logger.warn(`Unable to persist audit log for ${input.action}: ${String(error)}`);
        }
    }
    toSafePayload(payload) {
        if (!payload || typeof payload !== "object") {
            return payload;
        }
        const clone = structuredClone(payload);
        return this.redactSensitive(clone);
    }
    redactSensitive(payload) {
        if (!payload || typeof payload !== "object") {
            return payload;
        }
        if (Array.isArray(payload)) {
            return payload.map((item) => this.redactSensitive(item));
        }
        const clonedPayload = payload;
        const redactedPayload = {};
        for (const [key, value] of Object.entries(clonedPayload)) {
            if (["password", "refreshToken", "accessToken"].includes(key)) {
                redactedPayload[key] = "[REDACTED]";
                continue;
            }
            redactedPayload[key] = this.redactSensitive(value);
        }
        return redactedPayload;
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = AuditLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.MikroORM])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map