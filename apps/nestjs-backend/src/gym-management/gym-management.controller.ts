import { type ApiResponse } from '@next-nest-turbo-boilerplate/shared';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import type { Response } from 'express';
import { AuditAction } from './audit/audit-action.decorator';
import { AuditLogInterceptor } from './audit/audit-log.interceptor';
import {
  AttendanceCheckInDto,
  AttendanceCheckOutDto,
  CancelSalesInvoiceDto,
  CreateEquipmentDto,
  CreateMemberDto,
  CreateMembershipPlanDto,
  CreateOperatingExpenseDto,
  CreatePersonalTrainerDto,
  CreateProductDto,
  PatchSystemConfigDto,
  RejectExpenseDto,
  UpdateEquipmentDto,
  UpdateMemberDto,
  UpdateMembershipPlanDto,
  UpdateOperatingExpenseDto,
  UpdatePersonalTrainerDto,
  UpdateProductDto,
} from './dto/gym-management.dto';
import type { AuthenticatedUser } from './auth/authenticated-user.type';
import { CurrentUser } from './auth/current-user.decorator';
import { GymAuthGuard } from './auth/gym-auth.guard';
import { GymRolesGuard } from './auth/gym-roles.guard';
import { Public } from './auth/public.decorator';
import { Roles } from './auth/roles.decorator';
import { GymManagementService } from './gym-management.service';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  password!: string;
}

class RefreshTokenDto {
  @IsString()
  refreshToken!: string;
}

class LogoutDto {
  @IsString()
  refreshToken!: string;
}

type Snapshot = Awaited<ReturnType<GymManagementService['getSnapshot']>>;
type LoginResult = Awaited<ReturnType<GymManagementService['login']>>;
type CurrentUserProfile = Awaited<ReturnType<GymManagementService['getCurrentUser']>>;
type PtDetail = Awaited<ReturnType<GymManagementService['getPtDetail']>>;
type MemberDetail = Awaited<ReturnType<GymManagementService['getMemberDetail']>>;
type PayrollPeriodDetail = Awaited<ReturnType<GymManagementService['getPayrollPeriodDetail']>>;
type SalesInvoiceDetail = Awaited<ReturnType<GymManagementService['getSalesInvoiceDetail']>>;
type ExpenseDetail = Awaited<ReturnType<GymManagementService['getExpenseDetail']>>;
type EquipmentDetail = Awaited<ReturnType<GymManagementService['getEquipmentDetail']>>;
type PersonalTrainerRecord = Awaited<ReturnType<GymManagementService['createPersonalTrainer']>>;
type MemberRecord = Awaited<ReturnType<GymManagementService['createMember']>>;
type MembershipPlanRecord = Awaited<ReturnType<GymManagementService['createMembershipPlan']>>;
type ProductRecord = Awaited<ReturnType<GymManagementService['createProduct']>>;
type EquipmentRecord = Awaited<ReturnType<GymManagementService['createEquipment']>>;
type ExpenseRecord = Awaited<ReturnType<GymManagementService['createOperatingExpense']>>;
type SystemConfigRecord = Awaited<ReturnType<GymManagementService['patchSystemConfig']>>;
type AttendanceRecord = Awaited<ReturnType<GymManagementService['checkInAttendance']>>;

function createResponse<ResponsePayload>(data: ResponsePayload): ApiResponse<ResponsePayload> {
  return { data };
}

@ApiTags('Gym Management')
@Controller()
@UseGuards(GymAuthGuard, GymRolesGuard)
@UseInterceptors(AuditLogInterceptor)
@Roles('ADMIN', 'STAFF')
export class GymManagementController {
  constructor(private readonly gymManagementService: GymManagementService) { }

  @Public()
  @Post('auth/login')
  @AuditAction('AUTH_LOGIN', 'auth')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<LoginResult>> {
    return createResponse(await this.gymManagementService.login(loginDto.email, loginDto.password));
  }

  @Public()
  @Post('auth/refresh')
  @AuditAction('AUTH_REFRESH', 'auth')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<ApiResponse<LoginResult>> {
    return createResponse(await this.gymManagementService.refreshAccessToken(refreshTokenDto.refreshToken));
  }

  @Post('auth/logout')
  @Roles('ADMIN', 'STAFF', 'PT')
  @AuditAction('AUTH_LOGOUT', 'auth')
  async logout(
    @Body() logoutDto: LogoutDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<ApiResponse<{ loggedOut: true }>> {
    await this.gymManagementService.logout(logoutDto.refreshToken, currentUser.accessToken);

    return createResponse({ loggedOut: true });
  }

  @Get('auth/me')
  @Roles('ADMIN', 'STAFF', 'PT')
  async getCurrentUser(@CurrentUser() currentUser: AuthenticatedUser): Promise<ApiResponse<CurrentUserProfile>> {
    return createResponse(await this.gymManagementService.getCurrentUserById(currentUser.user.id));
  }

  @Get('dashboard')
  async getDashboard(): Promise<ApiResponse<Snapshot['dashboard']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dashboard);
  }

  @Get('pts')
  async getPts(): Promise<ApiResponse<Snapshot['ptOverview']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.ptOverview);
  }

  @Post('pts')
  async createPt(@Body() createPersonalTrainerDto: CreatePersonalTrainerDto): Promise<ApiResponse<PersonalTrainerRecord>> {
    return createResponse(await this.gymManagementService.createPersonalTrainer(createPersonalTrainerDto));
  }

  @Get('pts/:id')
  async getPtDetail(@Param('id') ptId: string): Promise<ApiResponse<PtDetail>> {
    return createResponse(await this.gymManagementService.getPtDetail(ptId));
  }

  @Get('pts/:id/contracts')
  async getPtContract(@Param('id') ptId: string): Promise<ApiResponse<PtDetail['contract']>> {
    const ptDetail = await this.gymManagementService.getPtDetail(ptId);

    return createResponse(ptDetail.contract);
  }

  @Patch('pts/:id')
  async updatePt(
    @Param('id') ptId: string,
    @Body() updatePersonalTrainerDto: UpdatePersonalTrainerDto,
  ): Promise<ApiResponse<PersonalTrainerRecord>> {
    return createResponse(await this.gymManagementService.updatePersonalTrainer(ptId, updatePersonalTrainerDto));
  }

  @Delete('pts/:id')
  async deletePt(@Param('id') ptId: string): Promise<ApiResponse<PersonalTrainerRecord>> {
    return createResponse(await this.gymManagementService.deletePersonalTrainer(ptId));
  }

  @Get('attendance')
  async getAttendance(): Promise<ApiResponse<Snapshot['dataset']['attendanceLogs']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.attendanceLogs);
  }

  @Post('attendance/check-in')
  @Roles('ADMIN', 'STAFF', 'PT')
  @AuditAction('ATTENDANCE_CHECK_IN', 'attendance_logs')
  async checkInAttendance(
    @Body() attendanceCheckInDto: AttendanceCheckInDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<ApiResponse<AttendanceRecord>> {
    attendanceCheckInDto.ptId = this.resolveScopedPtId(currentUser, attendanceCheckInDto.ptId);

    return createResponse(await this.gymManagementService.checkInAttendance(attendanceCheckInDto));
  }

  @Post('attendance/check-out')
  @Roles('ADMIN', 'STAFF', 'PT')
  @AuditAction('ATTENDANCE_CHECK_OUT', 'attendance_logs')
  async checkOutAttendance(
    @Body() attendanceCheckOutDto: AttendanceCheckOutDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<ApiResponse<AttendanceRecord>> {
    attendanceCheckOutDto.ptId = this.resolveScopedPtId(currentUser, attendanceCheckOutDto.ptId);

    return createResponse(await this.gymManagementService.checkOutAttendance(attendanceCheckOutDto));
  }

  @Get('attendance/me')
  @Roles('ADMIN', 'STAFF', 'PT')
  async getMyAttendance(
    @Query('ptId') ptId: string | undefined,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<ApiResponse<PtDetail['attendance']>> {
    const scopedPtId = this.resolveScopedPtId(currentUser, ptId);
    const ptDetail = await this.gymManagementService.getPtDetail(scopedPtId);

    return createResponse(ptDetail.attendance);
  }

  @Get('attendance/pt/:ptId')
  async getAttendanceByPt(@Param('ptId') ptId: string): Promise<ApiResponse<PtDetail['attendance']>> {
    const ptDetail = await this.gymManagementService.getPtDetail(ptId);

    return createResponse(ptDetail.attendance);
  }

  @Get('payroll/periods')
  async getPayrollPeriods(): Promise<ApiResponse<Snapshot['dataset']['payrollPeriods']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.payrollPeriods);
  }

  @Get('payroll/periods/:id')
  async getPayrollPeriod(@Param('id') payrollPeriodId: string): Promise<ApiResponse<PayrollPeriodDetail>> {
    return createResponse(await this.gymManagementService.getPayrollPeriodDetail(payrollPeriodId));
  }

  @Post('payroll/periods/:id/submit')
  @Roles('ADMIN')
  @AuditAction('PAYROLL_PERIOD_SUBMIT', 'payroll_periods')
  async submitPayrollPeriod(
    @Param('id') payrollPeriodId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<ApiResponse<PayrollPeriodDetail>> {
    return createResponse(await this.gymManagementService.submitPayrollPeriod(payrollPeriodId, currentUser.user.id));
  }

  @Post('payroll/periods/:id/approve')
  @Roles('ADMIN')
  @AuditAction('PAYROLL_PERIOD_APPROVE', 'payroll_periods')
  async approvePayrollPeriod(
    @Param('id') payrollPeriodId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<ApiResponse<PayrollPeriodDetail>> {
    return createResponse(await this.gymManagementService.approvePayrollPeriod(payrollPeriodId, currentUser.user.id));
  }

  @Post('payroll/periods/:id/mark-paid')
  @Roles('ADMIN')
  @AuditAction('PAYROLL_PERIOD_MARK_PAID', 'payroll_periods')
  async markPayrollPeriodPaid(
    @Param('id') payrollPeriodId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<ApiResponse<PayrollPeriodDetail>> {
    return createResponse(await this.gymManagementService.markPayrollPeriodPaid(payrollPeriodId, currentUser.user.id));
  }

  @Get('members')
  async getMembers(): Promise<ApiResponse<Snapshot['memberOverview']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.memberOverview);
  }

  @Post('members')
  async createMember(@Body() createMemberDto: CreateMemberDto): Promise<ApiResponse<MemberRecord>> {
    return createResponse(await this.gymManagementService.createMember(createMemberDto));
  }

  @Get('members/:id')
  async getMemberDetail(@Param('id') memberId: string): Promise<ApiResponse<MemberDetail>> {
    return createResponse(await this.gymManagementService.getMemberDetail(memberId));
  }

  @Get('members/:id/pt-assignments')
  async getMemberAssignments(@Param('id') memberId: string): Promise<ApiResponse<MemberDetail['ptAssignments']>> {
    const memberDetail = await this.gymManagementService.getMemberDetail(memberId);

    return createResponse(memberDetail.ptAssignments);
  }

  @Patch('members/:id')
  async updateMember(
    @Param('id') memberId: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ): Promise<ApiResponse<MemberRecord>> {
    return createResponse(await this.gymManagementService.updateMember(memberId, updateMemberDto));
  }

  @Delete('members/:id')
  async deleteMember(@Param('id') memberId: string): Promise<ApiResponse<MemberRecord>> {
    return createResponse(await this.gymManagementService.deleteMember(memberId));
  }

  @Get('membership-plans')
  async getMembershipPlans(): Promise<ApiResponse<Snapshot['dataset']['membershipPlans']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.membershipPlans);
  }

  @Post('membership-plans')
  async createMembershipPlan(
    @Body() createMembershipPlanDto: CreateMembershipPlanDto,
  ): Promise<ApiResponse<MembershipPlanRecord>> {
    return createResponse(await this.gymManagementService.createMembershipPlan(createMembershipPlanDto));
  }

  @Patch('membership-plans/:id')
  async updateMembershipPlan(
    @Param('id') membershipPlanId: string,
    @Body() updateMembershipPlanDto: UpdateMembershipPlanDto,
  ): Promise<ApiResponse<MembershipPlanRecord>> {
    return createResponse(
      await this.gymManagementService.updateMembershipPlan(membershipPlanId, updateMembershipPlanDto),
    );
  }

  @Delete('membership-plans/:id')
  async deleteMembershipPlan(@Param('id') membershipPlanId: string): Promise<ApiResponse<MembershipPlanRecord>> {
    return createResponse(await this.gymManagementService.deleteMembershipPlan(membershipPlanId));
  }

  @Get('member-memberships')
  async getMemberMemberships(): Promise<ApiResponse<Snapshot['dataset']['memberMemberships']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.memberMemberships);
  }

  @Get('member-assignments')
  async getMemberAssignmentsList(): Promise<ApiResponse<Snapshot['dataset']['memberPtAssignments']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.memberPtAssignments);
  }

  @Get('membership-invoices')
  async getMembershipInvoices(): Promise<ApiResponse<Snapshot['dataset']['membershipInvoices']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.membershipInvoices);
  }

  @Get('products')
  async getProducts(): Promise<ApiResponse<Snapshot['dataset']['products']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.products);
  }

  @Post('products')
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ApiResponse<ProductRecord>> {
    return createResponse(await this.gymManagementService.createProduct(createProductDto));
  }

  @Patch('products/:id')
  async updateProduct(
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ApiResponse<ProductRecord>> {
    return createResponse(await this.gymManagementService.updateProduct(productId, updateProductDto));
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') productId: string): Promise<ApiResponse<ProductRecord>> {
    return createResponse(await this.gymManagementService.deleteProduct(productId));
  }

  @Get('inventory/transactions')
  async getInventoryTransactions(): Promise<ApiResponse<Snapshot['dataset']['inventoryTransactions']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.inventoryTransactions);
  }

  @Get('sales/invoices')
  async getSalesInvoices(): Promise<ApiResponse<Snapshot['dataset']['salesInvoices']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.salesInvoices);
  }

  @Get('sales/invoices/:id')
  async getSalesInvoice(@Param('id') salesInvoiceId: string): Promise<ApiResponse<SalesInvoiceDetail>> {
    return createResponse(await this.gymManagementService.getSalesInvoiceDetail(salesInvoiceId));
  }

  @Post('sales/invoices/:id/confirm')
  @AuditAction('SALES_INVOICE_CONFIRM', 'sales_invoices')
  async confirmSalesInvoice(@Param('id') salesInvoiceId: string): Promise<ApiResponse<SalesInvoiceDetail>> {
    return createResponse(await this.gymManagementService.confirmSalesInvoice(salesInvoiceId));
  }

  @Post('sales/invoices/:id/cancel')
  @Roles('ADMIN')
  @AuditAction('SALES_INVOICE_CANCEL', 'sales_invoices')
  async cancelSalesInvoice(
    @Param('id') salesInvoiceId: string,
    @Body() cancelSalesInvoiceDto: CancelSalesInvoiceDto,
  ): Promise<ApiResponse<SalesInvoiceDetail>> {
    return createResponse(
      await this.gymManagementService.cancelSalesInvoice(salesInvoiceId, cancelSalesInvoiceDto.cancellationReason),
    );
  }

  @Get('expenses')
  async getExpenses(): Promise<ApiResponse<Snapshot['dataset']['operatingExpenses']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.operatingExpenses);
  }

  @Post('expenses')
  @AuditAction('EXPENSE_CREATE', 'operating_expenses')
  async createExpense(@Body() createOperatingExpenseDto: CreateOperatingExpenseDto): Promise<ApiResponse<ExpenseRecord>> {
    return createResponse(await this.gymManagementService.createOperatingExpense(createOperatingExpenseDto));
  }

  @Get('expenses/:id')
  async getExpense(@Param('id') expenseId: string): Promise<ApiResponse<ExpenseDetail>> {
    return createResponse(await this.gymManagementService.getExpenseDetail(expenseId));
  }

  @Patch('expenses/:id')
  @AuditAction('EXPENSE_UPDATE', 'operating_expenses')
  async updateExpense(
    @Param('id') expenseId: string,
    @Body() updateOperatingExpenseDto: UpdateOperatingExpenseDto,
  ): Promise<ApiResponse<ExpenseRecord>> {
    return createResponse(await this.gymManagementService.updateOperatingExpense(expenseId, updateOperatingExpenseDto));
  }

  @Post('expenses/:id/submit')
  @AuditAction('EXPENSE_SUBMIT', 'operating_expenses')
  async submitExpense(@Param('id') expenseId: string): Promise<ApiResponse<ExpenseRecord>> {
    return createResponse(await this.gymManagementService.submitExpense(expenseId));
  }

  @Post('expenses/:id/approve')
  @Roles('ADMIN')
  @AuditAction('EXPENSE_APPROVE', 'operating_expenses')
  async approveExpense(
    @Param('id') expenseId: string,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<ApiResponse<ExpenseRecord>> {
    return createResponse(await this.gymManagementService.approveExpense(expenseId, currentUser.user.id));
  }

  @Post('expenses/:id/reject')
  @Roles('ADMIN')
  @AuditAction('EXPENSE_REJECT', 'operating_expenses')
  async rejectExpense(
    @Param('id') expenseId: string,
    @Body() rejectExpenseDto: RejectExpenseDto,
  ): Promise<ApiResponse<ExpenseRecord>> {
    return createResponse(await this.gymManagementService.rejectExpense(expenseId, rejectExpenseDto.rejectionReason));
  }

  @Post('expenses/:id/mark-paid')
  @Roles('ADMIN')
  @AuditAction('EXPENSE_MARK_PAID', 'operating_expenses')
  async markExpensePaid(@Param('id') expenseId: string): Promise<ApiResponse<ExpenseRecord>> {
    return createResponse(await this.gymManagementService.markExpensePaid(expenseId));
  }

  @Get('equipment')
  async getEquipment(): Promise<ApiResponse<Snapshot['dataset']['equipmentAssets']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.equipmentAssets);
  }

  @Post('equipment')
  async createEquipment(@Body() createEquipmentDto: CreateEquipmentDto): Promise<ApiResponse<EquipmentRecord>> {
    return createResponse(await this.gymManagementService.createEquipment(createEquipmentDto));
  }

  @Get('equipment/:id')
  async getEquipmentDetail(@Param('id') equipmentAssetId: string): Promise<ApiResponse<EquipmentDetail>> {
    return createResponse(await this.gymManagementService.getEquipmentDetail(equipmentAssetId));
  }

  @Patch('equipment/:id')
  async updateEquipment(
    @Param('id') equipmentAssetId: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<ApiResponse<EquipmentRecord>> {
    return createResponse(await this.gymManagementService.updateEquipment(equipmentAssetId, updateEquipmentDto));
  }

  @Get('maintenance')
  async getMaintenance(): Promise<ApiResponse<Snapshot['dataset']['maintenanceRecords']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.maintenanceRecords);
  }

  @Get('reports/revenue')
  async getRevenueReport(): Promise<ApiResponse<Snapshot['revenueReport']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.revenueReport);
  }

  @Get('reports/payroll')
  async getPayrollReport(): Promise<ApiResponse<Snapshot['payrollReport']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.payrollReport);
  }

  @Get('reports/:reportType/export')
  @Roles('ADMIN')
  async exportReport(
    @Param('reportType') reportType: 'payroll' | 'revenue' | 'expenses' | 'profit',
    @Query('format') format: 'pdf' | 'xlsx',
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const exportedReport = await this.gymManagementService.exportReport(reportType, format ?? 'pdf');

    response.setHeader('Content-Type', exportedReport.mimeType);
    response.setHeader('Content-Disposition', `attachment; filename="${exportedReport.fileName}"`);

    return new StreamableFile(exportedReport.content);
  }

  @Get('reports/inventory')
  async getInventoryReport(): Promise<ApiResponse<Snapshot['inventoryOverview']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.inventoryOverview);
  }

  @Get('reports/expenses')
  async getExpenseReport(): Promise<ApiResponse<Snapshot['expenseReport']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.expenseReport);
  }

  @Get('reports/profit')
  async getProfitReport(): Promise<ApiResponse<Snapshot['profitReport']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.profitReport);
  }

  @Get('settings')
  async getSettings(): Promise<ApiResponse<Snapshot['dataset']['systemConfigs']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.systemConfigs);
  }

  @Patch('settings/:key')
  async patchSettings(
    @Param('key') configKey: string,
    @Body() patchSystemConfigDto: PatchSystemConfigDto,
  ): Promise<ApiResponse<SystemConfigRecord>> {
    return createResponse(await this.gymManagementService.patchSystemConfig(configKey, patchSystemConfigDto));
  }

  private resolveScopedPtId(currentUser: AuthenticatedUser, requestedPtId?: string): string {
    if (currentUser.role !== 'PT') {
      if (!requestedPtId) {
        throw new ForbiddenException('ptId is required for non-PT users');
      }

      return requestedPtId;
    }

    if (!currentUser.ptId) {
      throw new ForbiddenException('PT account is not linked to a trainer profile');
    }

    if (requestedPtId && requestedPtId !== currentUser.ptId) {
      throw new ForbiddenException('PT can only access own attendance data');
    }

    return currentUser.ptId;
  }
}
