"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymManagementModule = void 0;
const nestjs_1 = require("@mikro-orm/nestjs");
const common_1 = require("@nestjs/common");
const audit_log_interceptor_1 = require("./audit/audit-log.interceptor");
const audit_log_service_1 = require("./audit/audit-log.service");
const gym_management_controller_1 = require("./gym-management.controller");
const gym_auth_guard_1 = require("./auth/gym-auth.guard");
const gym_roles_guard_1 = require("./auth/gym-roles.guard");
const gym_management_entity_1 = require("./entities/gym-management.entity");
const gym_management_seed_service_1 = require("./gym-management.seed.service");
const gym_management_service_1 = require("./gym-management.service");
let GymManagementModule = class GymManagementModule {
};
exports.GymManagementModule = GymManagementModule;
exports.GymManagementModule = GymManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_1.MikroOrmModule.forFeature([
                gym_management_entity_1.UserEntity,
                gym_management_entity_1.PersonalTrainerEntity,
                gym_management_entity_1.PtContractEntity,
                gym_management_entity_1.AttendanceLogEntity,
                gym_management_entity_1.AuditLogEntity,
                gym_management_entity_1.PayrollPeriodEntity,
                gym_management_entity_1.PayrollEntryEntity,
                gym_management_entity_1.MemberEntity,
                gym_management_entity_1.MembershipPlanEntity,
                gym_management_entity_1.MemberMembershipEntity,
                gym_management_entity_1.MemberPtAssignmentEntity,
                gym_management_entity_1.MembershipInvoiceEntity,
                gym_management_entity_1.ProductEntity,
                gym_management_entity_1.InventoryTransactionEntity,
                gym_management_entity_1.SalesInvoiceEntity,
                gym_management_entity_1.SalesInvoiceItemEntity,
                gym_management_entity_1.EquipmentAssetEntity,
                gym_management_entity_1.OperatingExpenseEntity,
                gym_management_entity_1.MaintenanceRecordEntity,
                gym_management_entity_1.SystemConfigEntity,
            ]),
        ],
        controllers: [gym_management_controller_1.GymManagementController],
        providers: [
            gym_management_service_1.GymManagementService,
            gym_management_seed_service_1.GymManagementSeedService,
            gym_auth_guard_1.GymAuthGuard,
            gym_roles_guard_1.GymRolesGuard,
            audit_log_service_1.AuditLogService,
            audit_log_interceptor_1.AuditLogInterceptor,
        ],
    })
], GymManagementModule);
//# sourceMappingURL=gym-management.module.js.map