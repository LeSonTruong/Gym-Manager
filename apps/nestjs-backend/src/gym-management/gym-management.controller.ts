import {type ApiResponse} from '@next-nest-turbo-boilerplate/shared';
import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {IsEmail, IsString, MinLength} from 'class-validator';
import {
  CreateEquipmentDto,
  CreateMemberDto,
  CreateMembershipPlanDto,
  CreateOperatingExpenseDto,
  CreatePersonalTrainerDto,
  CreateProductDto,
  PatchSystemConfigDto,
  UpdateEquipmentDto,
  UpdateMemberDto,
  UpdateMembershipPlanDto,
  UpdateOperatingExpenseDto,
  UpdatePersonalTrainerDto,
  UpdateProductDto,
} from './dto/gym-management.dto';
import {GymManagementService} from './gym-management.service';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  password!: string;
}

type Snapshot = Awaited<ReturnType<GymManagementService['getSnapshot']>>;
type LoginResult = Awaited<ReturnType<GymManagementService['login']>>;
type CurrentUser = Awaited<ReturnType<GymManagementService['getCurrentUser']>>;
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

function createResponse<ResponsePayload>(data: ResponsePayload): ApiResponse<ResponsePayload> {
  return {data};
}

@ApiTags('Gym Management')
@Controller()
export class GymManagementController {
  constructor(private readonly gymManagementService: GymManagementService) {}

  @Post('auth/login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponse<LoginResult>> {
    return createResponse(await this.gymManagementService.login(loginDto.email, loginDto.password));
  }

  @Get('auth/me')
  async getCurrentUser(): Promise<ApiResponse<CurrentUser>> {
    return createResponse(await this.gymManagementService.getCurrentUser());
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

  @Get('expenses')
  async getExpenses(): Promise<ApiResponse<Snapshot['dataset']['operatingExpenses']>> {
    const snapshot = await this.gymManagementService.getSnapshot();

    return createResponse(snapshot.dataset.operatingExpenses);
  }

  @Post('expenses')
  async createExpense(@Body() createOperatingExpenseDto: CreateOperatingExpenseDto): Promise<ApiResponse<ExpenseRecord>> {
    return createResponse(await this.gymManagementService.createOperatingExpense(createOperatingExpenseDto));
  }

  @Get('expenses/:id')
  async getExpense(@Param('id') expenseId: string): Promise<ApiResponse<ExpenseDetail>> {
    return createResponse(await this.gymManagementService.getExpenseDetail(expenseId));
  }

  @Patch('expenses/:id')
  async updateExpense(
    @Param('id') expenseId: string,
    @Body() updateOperatingExpenseDto: UpdateOperatingExpenseDto,
  ): Promise<ApiResponse<ExpenseRecord>> {
    return createResponse(await this.gymManagementService.updateOperatingExpense(expenseId, updateOperatingExpenseDto));
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
}
