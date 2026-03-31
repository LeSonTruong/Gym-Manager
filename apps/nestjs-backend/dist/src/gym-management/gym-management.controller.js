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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymManagementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const audit_action_decorator_1 = require("./audit/audit-action.decorator");
const audit_log_interceptor_1 = require("./audit/audit-log.interceptor");
const gym_management_dto_1 = require("./dto/gym-management.dto");
const current_user_decorator_1 = require("./auth/current-user.decorator");
const gym_auth_guard_1 = require("./auth/gym-auth.guard");
const gym_roles_guard_1 = require("./auth/gym-roles.guard");
const public_decorator_1 = require("./auth/public.decorator");
const roles_decorator_1 = require("./auth/roles.decorator");
const gym_management_service_1 = require("./gym-management.service");
class LoginDto {
    email;
    password;
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class RefreshTokenDto {
    refreshToken;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
class LogoutDto {
    refreshToken;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LogoutDto.prototype, "refreshToken", void 0);
function createResponse(data) {
    return { data };
}
let GymManagementController = class GymManagementController {
    gymManagementService;
    constructor(gymManagementService) {
        this.gymManagementService = gymManagementService;
    }
    async login(loginDto) {
        return createResponse(await this.gymManagementService.login(loginDto.email, loginDto.password));
    }
    async refresh(refreshTokenDto) {
        return createResponse(await this.gymManagementService.refreshAccessToken(refreshTokenDto.refreshToken));
    }
    async logout(logoutDto, currentUser) {
        await this.gymManagementService.logout(logoutDto.refreshToken, currentUser.accessToken);
        return createResponse({ loggedOut: true });
    }
    async getCurrentUser(currentUser) {
        return createResponse(await this.gymManagementService.getCurrentUserById(currentUser.user.id));
    }
    async getDashboard() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dashboard);
    }
    async getSnapshot() {
        return createResponse(await this.gymManagementService.getSnapshot());
    }
    async getPts() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.ptOverview);
    }
    async createPt(createPersonalTrainerDto) {
        return createResponse(await this.gymManagementService.createPersonalTrainer(createPersonalTrainerDto));
    }
    async getPtDetail(ptId) {
        return createResponse(await this.gymManagementService.getPtDetail(ptId));
    }
    async getPtContract(ptId) {
        const ptDetail = await this.gymManagementService.getPtDetail(ptId);
        return createResponse(ptDetail.contract);
    }
    async createPtContract(ptId, createPtContractDto) {
        return createResponse(await this.gymManagementService.createPtContract(ptId, createPtContractDto));
    }
    async updatePtContract(ptId, contractId, updatePtContractDto) {
        return createResponse(await this.gymManagementService.updatePtContract(ptId, contractId, updatePtContractDto));
    }
    async updatePt(ptId, updatePersonalTrainerDto) {
        return createResponse(await this.gymManagementService.updatePersonalTrainer(ptId, updatePersonalTrainerDto));
    }
    async deletePt(ptId) {
        return createResponse(await this.gymManagementService.deletePersonalTrainer(ptId));
    }
    async getAttendance() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.attendanceLogs);
    }
    async checkInAttendance(attendanceCheckInDto, currentUser) {
        attendanceCheckInDto.ptId = this.resolveScopedPtId(currentUser, attendanceCheckInDto.ptId);
        return createResponse(await this.gymManagementService.checkInAttendance(attendanceCheckInDto));
    }
    async checkOutAttendance(attendanceCheckOutDto, currentUser) {
        attendanceCheckOutDto.ptId = this.resolveScopedPtId(currentUser, attendanceCheckOutDto.ptId);
        return createResponse(await this.gymManagementService.checkOutAttendance(attendanceCheckOutDto));
    }
    async patchAttendance(attendanceLogId, patchAttendanceDto) {
        return createResponse(await this.gymManagementService.patchAttendance(attendanceLogId, patchAttendanceDto));
    }
    async getMyAttendance(ptId, currentUser) {
        const scopedPtId = this.resolveScopedPtId(currentUser, ptId);
        const ptDetail = await this.gymManagementService.getPtDetail(scopedPtId);
        return createResponse(ptDetail.attendance);
    }
    async getAttendanceByPt(ptId) {
        const ptDetail = await this.gymManagementService.getPtDetail(ptId);
        return createResponse(ptDetail.attendance);
    }
    async getPayrollPeriods() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.payrollPeriods);
    }
    async createPayrollPeriod(createPayrollPeriodDto) {
        return createResponse(await this.gymManagementService.createPayrollPeriod(createPayrollPeriodDto));
    }
    async getPayrollPeriod(payrollPeriodId) {
        return createResponse(await this.gymManagementService.getPayrollPeriodDetail(payrollPeriodId));
    }
    async generatePayroll(generatePayrollDto) {
        return createResponse(await this.gymManagementService.generatePayroll(generatePayrollDto));
    }
    async getPayrollMe(currentUser) {
        return createResponse(await this.gymManagementService.getPayrollMe(currentUser.user.id));
    }
    async submitPayrollPeriod(payrollPeriodId, currentUser) {
        return createResponse(await this.gymManagementService.submitPayrollPeriod(payrollPeriodId, currentUser.user.id));
    }
    async approvePayrollPeriod(payrollPeriodId, currentUser) {
        return createResponse(await this.gymManagementService.approvePayrollPeriod(payrollPeriodId, currentUser.user.id));
    }
    async markPayrollPeriodPaid(payrollPeriodId, currentUser) {
        return createResponse(await this.gymManagementService.markPayrollPeriodPaid(payrollPeriodId, currentUser.user.id));
    }
    async getMembers() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.memberOverview);
    }
    async createMember(createMemberDto) {
        return createResponse(await this.gymManagementService.createMember(createMemberDto));
    }
    async getMemberDetail(memberId) {
        return createResponse(await this.gymManagementService.getMemberDetail(memberId));
    }
    async getMemberAssignments(memberId) {
        const memberDetail = await this.gymManagementService.getMemberDetail(memberId);
        return createResponse(memberDetail.ptAssignments);
    }
    async updateMember(memberId, updateMemberDto) {
        return createResponse(await this.gymManagementService.updateMember(memberId, updateMemberDto));
    }
    async deleteMember(memberId) {
        return createResponse(await this.gymManagementService.deleteMember(memberId));
    }
    async getMembershipPlans() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.membershipPlans);
    }
    async createMembershipPlan(createMembershipPlanDto) {
        return createResponse(await this.gymManagementService.createMembershipPlan(createMembershipPlanDto));
    }
    async updateMembershipPlan(membershipPlanId, updateMembershipPlanDto) {
        return createResponse(await this.gymManagementService.updateMembershipPlan(membershipPlanId, updateMembershipPlanDto));
    }
    async deleteMembershipPlan(membershipPlanId) {
        return createResponse(await this.gymManagementService.deleteMembershipPlan(membershipPlanId));
    }
    async getMemberMemberships() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.memberMemberships);
    }
    async createMemberMembership(createMemberMembershipDto) {
        return createResponse(await this.gymManagementService.createMemberMembership(createMemberMembershipDto));
    }
    async renewMemberMembership(membershipId, renewMemberMembershipDto) {
        return createResponse(await this.gymManagementService.renewMemberMembership(membershipId, renewMemberMembershipDto));
    }
    async cancelMemberMembership(membershipId, cancelMemberMembershipDto) {
        return createResponse(await this.gymManagementService.cancelMemberMembership(membershipId, cancelMemberMembershipDto.cancelledAt));
    }
    async getMemberAssignmentsList() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.memberPtAssignments);
    }
    async createMemberAssignment(createMemberAssignmentDto) {
        return createResponse(await this.gymManagementService.createMemberAssignment(createMemberAssignmentDto));
    }
    async endMemberAssignment(assignmentId, endMemberAssignmentDto) {
        return createResponse(await this.gymManagementService.endMemberAssignment(assignmentId, endMemberAssignmentDto));
    }
    async getMembershipInvoices() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.membershipInvoices);
    }
    async getProducts() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.products);
    }
    async createProduct(createProductDto) {
        return createResponse(await this.gymManagementService.createProduct(createProductDto));
    }
    async updateProduct(productId, updateProductDto) {
        return createResponse(await this.gymManagementService.updateProduct(productId, updateProductDto));
    }
    async deleteProduct(productId) {
        return createResponse(await this.gymManagementService.deleteProduct(productId));
    }
    async getInventoryTransactions() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.inventoryTransactions);
    }
    async importInventory(inventoryImportDto) {
        return createResponse(await this.gymManagementService.importInventory(inventoryImportDto));
    }
    async getSalesInvoices() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.salesInvoices);
    }
    async createSalesInvoice(createSalesInvoiceDto, currentUser) {
        return createResponse(await this.gymManagementService.createSalesInvoice(createSalesInvoiceDto, currentUser.user.id));
    }
    async getSalesInvoice(salesInvoiceId) {
        return createResponse(await this.gymManagementService.getSalesInvoiceDetail(salesInvoiceId));
    }
    async confirmSalesInvoice(salesInvoiceId) {
        return createResponse(await this.gymManagementService.confirmSalesInvoice(salesInvoiceId));
    }
    async cancelSalesInvoice(salesInvoiceId, cancelSalesInvoiceDto) {
        return createResponse(await this.gymManagementService.cancelSalesInvoice(salesInvoiceId, cancelSalesInvoiceDto.cancellationReason));
    }
    async getExpenses() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.operatingExpenses);
    }
    async createExpense(createOperatingExpenseDto) {
        return createResponse(await this.gymManagementService.createOperatingExpense(createOperatingExpenseDto));
    }
    async getExpense(expenseId) {
        return createResponse(await this.gymManagementService.getExpenseDetail(expenseId));
    }
    async updateExpense(expenseId, updateOperatingExpenseDto) {
        return createResponse(await this.gymManagementService.updateOperatingExpense(expenseId, updateOperatingExpenseDto));
    }
    async submitExpense(expenseId) {
        return createResponse(await this.gymManagementService.submitExpense(expenseId));
    }
    async approveExpense(expenseId, currentUser) {
        return createResponse(await this.gymManagementService.approveExpense(expenseId, currentUser.user.id));
    }
    async rejectExpense(expenseId, rejectExpenseDto) {
        return createResponse(await this.gymManagementService.rejectExpense(expenseId, rejectExpenseDto.rejectionReason));
    }
    async markExpensePaid(expenseId) {
        return createResponse(await this.gymManagementService.markExpensePaid(expenseId));
    }
    async getEquipment() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.equipmentAssets);
    }
    async createEquipment(createEquipmentDto) {
        return createResponse(await this.gymManagementService.createEquipment(createEquipmentDto));
    }
    async getEquipmentDetail(equipmentAssetId) {
        return createResponse(await this.gymManagementService.getEquipmentDetail(equipmentAssetId));
    }
    async updateEquipment(equipmentAssetId, updateEquipmentDto) {
        return createResponse(await this.gymManagementService.updateEquipment(equipmentAssetId, updateEquipmentDto));
    }
    async getMaintenance() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.maintenanceRecords);
    }
    async createMaintenance(createMaintenanceDto, currentUser) {
        return createResponse(await this.gymManagementService.createMaintenance(createMaintenanceDto, currentUser.user.id));
    }
    async getRevenueReport() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.revenueReport);
    }
    async getPayrollReport() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.payrollReport);
    }
    async exportReport(reportType, format, response) {
        const exportedReport = await this.gymManagementService.exportReport(reportType, format ?? "pdf");
        response.setHeader("Content-Type", exportedReport.mimeType);
        response.setHeader("Content-Disposition", `attachment; filename="${exportedReport.fileName}"`);
        return new common_1.StreamableFile(exportedReport.content);
    }
    async getInventoryReport() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.inventoryOverview);
    }
    async getExpenseReport() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.expenseReport);
    }
    async getProfitReport() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.profitReport);
    }
    async getSettings() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.systemConfigs);
    }
    async patchSettings(configKey, patchSystemConfigDto, currentUser) {
        return createResponse(await this.gymManagementService.patchSystemConfig(configKey, patchSystemConfigDto, currentUser.user.id));
    }
    resolveScopedPtId(currentUser, requestedPtId) {
        if (currentUser.role !== "PT") {
            if (!requestedPtId) {
                throw new common_1.ForbiddenException("ptId is required for non-PT users");
            }
            return requestedPtId;
        }
        if (!currentUser.ptId) {
            throw new common_1.ForbiddenException("PT account is not linked to a trainer profile");
        }
        if (requestedPtId && requestedPtId !== currentUser.ptId) {
            throw new common_1.ForbiddenException("PT can only access own attendance data");
        }
        return currentUser.ptId;
    }
};
exports.GymManagementController = GymManagementController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("auth/login"),
    (0, audit_action_decorator_1.AuditAction)("AUTH_LOGIN", "auth"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("auth/refresh"),
    (0, audit_action_decorator_1.AuditAction)("AUTH_REFRESH", "auth"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)("auth/logout"),
    (0, roles_decorator_1.Roles)("ADMIN", "STAFF", "PT"),
    (0, audit_action_decorator_1.AuditAction)("AUTH_LOGOUT", "auth"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LogoutDto, Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("auth/me"),
    (0, roles_decorator_1.Roles)("ADMIN", "STAFF", "PT"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)("dashboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)("snapshot"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getSnapshot", null);
__decorate([
    (0, common_1.Get)("pts"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPts", null);
__decorate([
    (0, common_1.Post)("pts"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreatePersonalTrainerDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createPt", null);
__decorate([
    (0, common_1.Get)("pts/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPtDetail", null);
__decorate([
    (0, common_1.Get)("pts/:id/contracts"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPtContract", null);
__decorate([
    (0, common_1.Post)("pts/:id/contracts"),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, audit_action_decorator_1.AuditAction)("PT_CONTRACT_CREATE", "pt_contracts"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.CreatePtContractDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createPtContract", null);
__decorate([
    (0, common_1.Patch)("pts/:id/contracts/:contractId"),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, audit_action_decorator_1.AuditAction)("PT_CONTRACT_UPDATE", "pt_contracts"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("contractId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, gym_management_dto_1.UpdatePtContractDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updatePtContract", null);
__decorate([
    (0, common_1.Patch)("pts/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.UpdatePersonalTrainerDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updatePt", null);
__decorate([
    (0, common_1.Delete)("pts/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "deletePt", null);
__decorate([
    (0, common_1.Get)("attendance"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Post)("attendance/check-in"),
    (0, roles_decorator_1.Roles)("ADMIN", "STAFF", "PT"),
    (0, audit_action_decorator_1.AuditAction)("ATTENDANCE_CHECK_IN", "attendance_logs"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.AttendanceCheckInDto, Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "checkInAttendance", null);
__decorate([
    (0, common_1.Post)("attendance/check-out"),
    (0, roles_decorator_1.Roles)("ADMIN", "STAFF", "PT"),
    (0, audit_action_decorator_1.AuditAction)("ATTENDANCE_CHECK_OUT", "attendance_logs"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.AttendanceCheckOutDto, Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "checkOutAttendance", null);
__decorate([
    (0, common_1.Patch)("attendance/:id"),
    (0, roles_decorator_1.Roles)("ADMIN", "STAFF"),
    (0, audit_action_decorator_1.AuditAction)("ATTENDANCE_PATCH", "attendance_logs"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.PatchAttendanceDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "patchAttendance", null);
__decorate([
    (0, common_1.Get)("attendance/me"),
    (0, roles_decorator_1.Roles)("ADMIN", "STAFF", "PT"),
    __param(0, (0, common_1.Query)("ptId")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMyAttendance", null);
__decorate([
    (0, common_1.Get)("attendance/pt/:ptId"),
    __param(0, (0, common_1.Param)("ptId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getAttendanceByPt", null);
__decorate([
    (0, common_1.Get)("payroll/periods"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPayrollPeriods", null);
__decorate([
    (0, common_1.Post)("payroll/periods"),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, audit_action_decorator_1.AuditAction)("PAYROLL_PERIOD_CREATE", "payroll_periods"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreatePayrollPeriodDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createPayrollPeriod", null);
__decorate([
    (0, common_1.Get)("payroll/periods/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPayrollPeriod", null);
__decorate([
    (0, common_1.Post)("payroll/generate"),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, audit_action_decorator_1.AuditAction)("PAYROLL_GENERATE", "payroll_entries"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.GeneratePayrollDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "generatePayroll", null);
__decorate([
    (0, common_1.Get)("payroll/me"),
    (0, roles_decorator_1.Roles)("ADMIN", "STAFF", "PT"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPayrollMe", null);
__decorate([
    (0, common_1.Post)("payroll/periods/:id/submit"),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, audit_action_decorator_1.AuditAction)("PAYROLL_PERIOD_SUBMIT", "payroll_periods"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "submitPayrollPeriod", null);
__decorate([
    (0, common_1.Post)("payroll/periods/:id/approve"),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, audit_action_decorator_1.AuditAction)("PAYROLL_PERIOD_APPROVE", "payroll_periods"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "approvePayrollPeriod", null);
__decorate([
    (0, common_1.Post)("payroll/periods/:id/mark-paid"),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, audit_action_decorator_1.AuditAction)("PAYROLL_PERIOD_MARK_PAID", "payroll_periods"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "markPayrollPeriodPaid", null);
__decorate([
    (0, common_1.Get)("members"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Post)("members"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateMemberDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createMember", null);
__decorate([
    (0, common_1.Get)("members/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMemberDetail", null);
__decorate([
    (0, common_1.Get)("members/:id/pt-assignments"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMemberAssignments", null);
__decorate([
    (0, common_1.Patch)("members/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.UpdateMemberDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updateMember", null);
__decorate([
    (0, common_1.Delete)("members/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "deleteMember", null);
__decorate([
    (0, common_1.Get)("membership-plans"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMembershipPlans", null);
__decorate([
    (0, common_1.Post)("membership-plans"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateMembershipPlanDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createMembershipPlan", null);
__decorate([
    (0, common_1.Patch)("membership-plans/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.UpdateMembershipPlanDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updateMembershipPlan", null);
__decorate([
    (0, common_1.Delete)("membership-plans/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "deleteMembershipPlan", null);
__decorate([
    (0, common_1.Get)("member-memberships"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMemberMemberships", null);
__decorate([
    (0, common_1.Post)("member-memberships"),
    (0, audit_action_decorator_1.AuditAction)("MEMBERSHIP_CREATE", "member_memberships"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateMemberMembershipDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createMemberMembership", null);
__decorate([
    (0, common_1.Post)("member-memberships/:id/renew"),
    (0, audit_action_decorator_1.AuditAction)("MEMBERSHIP_RENEW", "member_memberships"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.RenewMemberMembershipDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "renewMemberMembership", null);
__decorate([
    (0, common_1.Post)("member-memberships/:id/cancel"),
    (0, audit_action_decorator_1.AuditAction)("MEMBERSHIP_CANCEL", "member_memberships"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.CancelMemberMembershipDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "cancelMemberMembership", null);
__decorate([
    (0, common_1.Get)("member-assignments"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMemberAssignmentsList", null);
__decorate([
    (0, common_1.Post)("member-assignments"),
    (0, audit_action_decorator_1.AuditAction)("MEMBER_ASSIGNMENT_CREATE", "member_pt_assignments"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateMemberAssignmentDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createMemberAssignment", null);
__decorate([
    (0, common_1.Post)("member-assignments/:id/end"),
    (0, audit_action_decorator_1.AuditAction)("MEMBER_ASSIGNMENT_END", "member_pt_assignments"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.EndMemberAssignmentDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "endMemberAssignment", null);
__decorate([
    (0, common_1.Get)("membership-invoices"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMembershipInvoices", null);
__decorate([
    (0, common_1.Get)("products"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Post)("products"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Patch)("products/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)("products/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Get)("inventory/transactions"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getInventoryTransactions", null);
__decorate([
    (0, common_1.Post)("inventory/import"),
    (0, audit_action_decorator_1.AuditAction)("INVENTORY_IMPORT", "inventory_transactions"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.InventoryImportDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "importInventory", null);
__decorate([
    (0, common_1.Get)("sales/invoices"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getSalesInvoices", null);
__decorate([
    (0, common_1.Post)("sales/invoices"),
    (0, roles_decorator_1.Roles)("ADMIN", "STAFF", "PT"),
    (0, audit_action_decorator_1.AuditAction)("SALES_INVOICE_CREATE", "sales_invoices"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateSalesInvoiceDto, Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createSalesInvoice", null);
__decorate([
    (0, common_1.Get)("sales/invoices/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getSalesInvoice", null);
__decorate([
    (0, common_1.Post)("sales/invoices/:id/confirm"),
    (0, audit_action_decorator_1.AuditAction)("SALES_INVOICE_CONFIRM", "sales_invoices"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "confirmSalesInvoice", null);
__decorate([
    (0, common_1.Post)("sales/invoices/:id/cancel"),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, audit_action_decorator_1.AuditAction)("SALES_INVOICE_CANCEL", "sales_invoices"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.CancelSalesInvoiceDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "cancelSalesInvoice", null);
__decorate([
    (0, common_1.Get)("expenses"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getExpenses", null);
__decorate([
    (0, common_1.Post)("expenses"),
    (0, audit_action_decorator_1.AuditAction)("EXPENSE_CREATE", "operating_expenses"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateOperatingExpenseDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Get)("expenses/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getExpense", null);
__decorate([
    (0, common_1.Patch)("expenses/:id"),
    (0, audit_action_decorator_1.AuditAction)("EXPENSE_UPDATE", "operating_expenses"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.UpdateOperatingExpenseDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Post)("expenses/:id/submit"),
    (0, audit_action_decorator_1.AuditAction)("EXPENSE_SUBMIT", "operating_expenses"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "submitExpense", null);
__decorate([
    (0, common_1.Post)("expenses/:id/approve"),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, audit_action_decorator_1.AuditAction)("EXPENSE_APPROVE", "operating_expenses"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "approveExpense", null);
__decorate([
    (0, common_1.Post)("expenses/:id/reject"),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, audit_action_decorator_1.AuditAction)("EXPENSE_REJECT", "operating_expenses"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.RejectExpenseDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "rejectExpense", null);
__decorate([
    (0, common_1.Post)("expenses/:id/mark-paid"),
    (0, roles_decorator_1.Roles)("ADMIN"),
    (0, audit_action_decorator_1.AuditAction)("EXPENSE_MARK_PAID", "operating_expenses"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "markExpensePaid", null);
__decorate([
    (0, common_1.Get)("equipment"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getEquipment", null);
__decorate([
    (0, common_1.Post)("equipment"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateEquipmentDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createEquipment", null);
__decorate([
    (0, common_1.Get)("equipment/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getEquipmentDetail", null);
__decorate([
    (0, common_1.Patch)("equipment/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.UpdateEquipmentDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updateEquipment", null);
__decorate([
    (0, common_1.Get)("maintenance"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMaintenance", null);
__decorate([
    (0, common_1.Post)("maintenance"),
    (0, audit_action_decorator_1.AuditAction)("MAINTENANCE_CREATE", "maintenance_records"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateMaintenanceDto, Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createMaintenance", null);
__decorate([
    (0, common_1.Get)("reports/revenue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getRevenueReport", null);
__decorate([
    (0, common_1.Get)("reports/payroll"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPayrollReport", null);
__decorate([
    (0, common_1.Get)("reports/:reportType/export"),
    (0, roles_decorator_1.Roles)("ADMIN"),
    __param(0, (0, common_1.Param)("reportType")),
    __param(1, (0, common_1.Query)("format")),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "exportReport", null);
__decorate([
    (0, common_1.Get)("reports/inventory"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getInventoryReport", null);
__decorate([
    (0, common_1.Get)("reports/expenses"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getExpenseReport", null);
__decorate([
    (0, common_1.Get)("reports/profit"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getProfitReport", null);
__decorate([
    (0, common_1.Get)("settings"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Patch)("settings/:key"),
    __param(0, (0, common_1.Param)("key")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.PatchSystemConfigDto, Object]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "patchSettings", null);
exports.GymManagementController = GymManagementController = __decorate([
    (0, swagger_1.ApiTags)("Gym Management"),
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(gym_auth_guard_1.GymAuthGuard, gym_roles_guard_1.GymRolesGuard),
    (0, common_1.UseInterceptors)(audit_log_interceptor_1.AuditLogInterceptor),
    (0, roles_decorator_1.Roles)("ADMIN", "STAFF"),
    __metadata("design:paramtypes", [gym_management_service_1.GymManagementService])
], GymManagementController);
//# sourceMappingURL=gym-management.controller.js.map