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
const gym_management_dto_1 = require("./dto/gym-management.dto");
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
    async getCurrentUser() {
        return createResponse(await this.gymManagementService.getCurrentUser());
    }
    async getDashboard() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dashboard);
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
    async getAttendanceByPt(ptId) {
        const ptDetail = await this.gymManagementService.getPtDetail(ptId);
        return createResponse(ptDetail.attendance);
    }
    async getPayrollPeriods() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.payrollPeriods);
    }
    async getPayrollPeriod(payrollPeriodId) {
        return createResponse(await this.gymManagementService.getPayrollPeriodDetail(payrollPeriodId));
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
    async getMemberAssignmentsList() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.memberPtAssignments);
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
    async getSalesInvoices() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.dataset.salesInvoices);
    }
    async getSalesInvoice(salesInvoiceId) {
        return createResponse(await this.gymManagementService.getSalesInvoiceDetail(salesInvoiceId));
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
    async getRevenueReport() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.revenueReport);
    }
    async getPayrollReport() {
        const snapshot = await this.gymManagementService.getSnapshot();
        return createResponse(snapshot.payrollReport);
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
    async patchSettings(configKey, patchSystemConfigDto) {
        return createResponse(await this.gymManagementService.patchSystemConfig(configKey, patchSystemConfigDto));
    }
};
exports.GymManagementController = GymManagementController;
__decorate([
    (0, common_1.Post)('auth/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('auth/me'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('pts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPts", null);
__decorate([
    (0, common_1.Post)('pts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreatePersonalTrainerDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createPt", null);
__decorate([
    (0, common_1.Get)('pts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPtDetail", null);
__decorate([
    (0, common_1.Get)('pts/:id/contracts'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPtContract", null);
__decorate([
    (0, common_1.Patch)('pts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.UpdatePersonalTrainerDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updatePt", null);
__decorate([
    (0, common_1.Delete)('pts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "deletePt", null);
__decorate([
    (0, common_1.Get)('attendance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getAttendance", null);
__decorate([
    (0, common_1.Get)('attendance/pt/:ptId'),
    __param(0, (0, common_1.Param)('ptId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getAttendanceByPt", null);
__decorate([
    (0, common_1.Get)('payroll/periods'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPayrollPeriods", null);
__decorate([
    (0, common_1.Get)('payroll/periods/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPayrollPeriod", null);
__decorate([
    (0, common_1.Get)('members'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Post)('members'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateMemberDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createMember", null);
__decorate([
    (0, common_1.Get)('members/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMemberDetail", null);
__decorate([
    (0, common_1.Get)('members/:id/pt-assignments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMemberAssignments", null);
__decorate([
    (0, common_1.Patch)('members/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.UpdateMemberDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updateMember", null);
__decorate([
    (0, common_1.Delete)('members/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "deleteMember", null);
__decorate([
    (0, common_1.Get)('membership-plans'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMembershipPlans", null);
__decorate([
    (0, common_1.Post)('membership-plans'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateMembershipPlanDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createMembershipPlan", null);
__decorate([
    (0, common_1.Patch)('membership-plans/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.UpdateMembershipPlanDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updateMembershipPlan", null);
__decorate([
    (0, common_1.Delete)('membership-plans/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "deleteMembershipPlan", null);
__decorate([
    (0, common_1.Get)('member-memberships'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMemberMemberships", null);
__decorate([
    (0, common_1.Get)('member-assignments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMemberAssignmentsList", null);
__decorate([
    (0, common_1.Get)('membership-invoices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMembershipInvoices", null);
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Post)('products'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Patch)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Get)('inventory/transactions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getInventoryTransactions", null);
__decorate([
    (0, common_1.Get)('sales/invoices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getSalesInvoices", null);
__decorate([
    (0, common_1.Get)('sales/invoices/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getSalesInvoice", null);
__decorate([
    (0, common_1.Get)('expenses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getExpenses", null);
__decorate([
    (0, common_1.Post)('expenses'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateOperatingExpenseDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Get)('expenses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getExpense", null);
__decorate([
    (0, common_1.Patch)('expenses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.UpdateOperatingExpenseDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Get)('equipment'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getEquipment", null);
__decorate([
    (0, common_1.Post)('equipment'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gym_management_dto_1.CreateEquipmentDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "createEquipment", null);
__decorate([
    (0, common_1.Get)('equipment/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getEquipmentDetail", null);
__decorate([
    (0, common_1.Patch)('equipment/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.UpdateEquipmentDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "updateEquipment", null);
__decorate([
    (0, common_1.Get)('maintenance'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getMaintenance", null);
__decorate([
    (0, common_1.Get)('reports/revenue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getRevenueReport", null);
__decorate([
    (0, common_1.Get)('reports/payroll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getPayrollReport", null);
__decorate([
    (0, common_1.Get)('reports/inventory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getInventoryReport", null);
__decorate([
    (0, common_1.Get)('reports/expenses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getExpenseReport", null);
__decorate([
    (0, common_1.Get)('reports/profit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getProfitReport", null);
__decorate([
    (0, common_1.Get)('settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Patch)('settings/:key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, gym_management_dto_1.PatchSystemConfigDto]),
    __metadata("design:returntype", Promise)
], GymManagementController.prototype, "patchSettings", null);
exports.GymManagementController = GymManagementController = __decorate([
    (0, swagger_1.ApiTags)('Gym Management'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [gym_management_service_1.GymManagementService])
], GymManagementController);
//# sourceMappingURL=gym-management.controller.js.map