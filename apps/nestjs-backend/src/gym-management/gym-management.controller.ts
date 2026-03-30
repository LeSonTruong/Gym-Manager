import {type ApiResponse} from '@next-nest-turbo-boilerplate/shared';
import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {IsEmail, IsString, MinLength} from 'class-validator';
import {GymManagementService} from './gym-management.service';

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  password!: string;
}

@ApiTags('Gym Management')
@Controller()
export class GymManagementController {
  constructor(private readonly gymManagementService: GymManagementService) {}

  @Post('auth/login')
  login(@Body() loginDto: LoginDto): ApiResponse<ReturnType<GymManagementService['login']>> {
    return {
      data: this.gymManagementService.login(loginDto.email, loginDto.password),
    };
  }

  @Get('auth/me')
  getCurrentUser(): ApiResponse<ReturnType<GymManagementService['getCurrentUser']>> {
    return {
      data: this.gymManagementService.getCurrentUser(),
    };
  }

  @Get('dashboard')
  getDashboard(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['dashboard']> {
    return {
      data: this.gymManagementService.getSnapshot().dashboard,
    };
  }

  @Get('pts')
  getPts(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['ptOverview']> {
    return {
      data: this.gymManagementService.getSnapshot().ptOverview,
    };
  }

  @Get('pts/:id')
  getPtDetail(@Param('id') ptId: string): ApiResponse<ReturnType<GymManagementService['getPtDetail']>> {
    return {
      data: this.gymManagementService.getPtDetail(ptId),
    };
  }

  @Get('pts/:id/contracts')
  getPtContract(@Param('id') ptId: string): ApiResponse<ReturnType<GymManagementService['getPtDetail']>['contract']> {
    return {
      data: this.gymManagementService.getPtDetail(ptId).contract,
    };
  }

  @Get('attendance')
  getAttendance(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['dataset']['attendanceLogs']> {
    return {
      data: this.gymManagementService.getSnapshot().dataset.attendanceLogs,
    };
  }

  @Get('attendance/pt/:ptId')
  getAttendanceByPt(
    @Param('ptId') ptId: string,
  ): ApiResponse<ReturnType<GymManagementService['getPtDetail']>['attendance']> {
    return {
      data: this.gymManagementService.getPtDetail(ptId).attendance,
    };
  }

  @Get('payroll/periods')
  getPayrollPeriods(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['dataset']['payrollPeriods']> {
    return {
      data: this.gymManagementService.getSnapshot().dataset.payrollPeriods,
    };
  }

  @Get('payroll/periods/:id')
  getPayrollPeriod(
    @Param('id') payrollPeriodId: string,
  ): ApiResponse<ReturnType<GymManagementService['getPayrollPeriodDetail']>> {
    return {
      data: this.gymManagementService.getPayrollPeriodDetail(payrollPeriodId),
    };
  }

  @Get('members')
  getMembers(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['memberOverview']> {
    return {
      data: this.gymManagementService.getSnapshot().memberOverview,
    };
  }

  @Get('members/:id')
  getMemberDetail(@Param('id') memberId: string): ApiResponse<ReturnType<GymManagementService['getMemberDetail']>> {
    return {
      data: this.gymManagementService.getMemberDetail(memberId),
    };
  }

  @Get('members/:id/pt-assignments')
  getMemberAssignments(
    @Param('id') memberId: string,
  ): ApiResponse<ReturnType<GymManagementService['getMemberDetail']>['ptAssignments']> {
    return {
      data: this.gymManagementService.getMemberDetail(memberId).ptAssignments,
    };
  }

  @Get('membership-plans')
  getMembershipPlans(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['dataset']['membershipPlans']> {
    return {
      data: this.gymManagementService.getSnapshot().dataset.membershipPlans,
    };
  }

  @Get('member-memberships')
  getMemberMemberships(): ApiResponse<
    ReturnType<GymManagementService['getSnapshot']>['dataset']['memberMemberships']
  > {
    return {
      data: this.gymManagementService.getSnapshot().dataset.memberMemberships,
    };
  }

  @Get('member-assignments')
  getMemberAssignmentsList(): ApiResponse<
    ReturnType<GymManagementService['getSnapshot']>['dataset']['memberPtAssignments']
  > {
    return {
      data: this.gymManagementService.getSnapshot().dataset.memberPtAssignments,
    };
  }

  @Get('membership-invoices')
  getMembershipInvoices(): ApiResponse<
    ReturnType<GymManagementService['getSnapshot']>['dataset']['membershipInvoices']
  > {
    return {
      data: this.gymManagementService.getSnapshot().dataset.membershipInvoices,
    };
  }

  @Get('products')
  getProducts(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['dataset']['products']> {
    return {
      data: this.gymManagementService.getSnapshot().dataset.products,
    };
  }

  @Get('inventory/transactions')
  getInventoryTransactions(): ApiResponse<
    ReturnType<GymManagementService['getSnapshot']>['dataset']['inventoryTransactions']
  > {
    return {
      data: this.gymManagementService.getSnapshot().dataset.inventoryTransactions,
    };
  }

  @Get('sales/invoices')
  getSalesInvoices(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['dataset']['salesInvoices']> {
    return {
      data: this.gymManagementService.getSnapshot().dataset.salesInvoices,
    };
  }

  @Get('sales/invoices/:id')
  getSalesInvoice(@Param('id') salesInvoiceId: string): ApiResponse<ReturnType<GymManagementService['getSalesInvoiceDetail']>> {
    return {
      data: this.gymManagementService.getSalesInvoiceDetail(salesInvoiceId),
    };
  }

  @Get('expenses')
  getExpenses(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['dataset']['operatingExpenses']> {
    return {
      data: this.gymManagementService.getSnapshot().dataset.operatingExpenses,
    };
  }

  @Get('expenses/:id')
  getExpense(@Param('id') expenseId: string): ApiResponse<ReturnType<GymManagementService['getExpenseDetail']>> {
    return {
      data: this.gymManagementService.getExpenseDetail(expenseId),
    };
  }

  @Get('equipment')
  getEquipment(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['dataset']['equipmentAssets']> {
    return {
      data: this.gymManagementService.getSnapshot().dataset.equipmentAssets,
    };
  }

  @Get('equipment/:id')
  getEquipmentDetail(
    @Param('id') equipmentAssetId: string,
  ): ApiResponse<ReturnType<GymManagementService['getEquipmentDetail']>> {
    return {
      data: this.gymManagementService.getEquipmentDetail(equipmentAssetId),
    };
  }

  @Get('maintenance')
  getMaintenance(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['dataset']['maintenanceRecords']> {
    return {
      data: this.gymManagementService.getSnapshot().dataset.maintenanceRecords,
    };
  }

  @Get('reports/revenue')
  getRevenueReport(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['revenueReport']> {
    return {
      data: this.gymManagementService.getSnapshot().revenueReport,
    };
  }

  @Get('reports/payroll')
  getPayrollReport(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['payrollReport']> {
    return {
      data: this.gymManagementService.getSnapshot().payrollReport,
    };
  }

  @Get('reports/inventory')
  getInventoryReport(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['inventoryOverview']> {
    return {
      data: this.gymManagementService.getSnapshot().inventoryOverview,
    };
  }

  @Get('reports/expenses')
  getExpenseReport(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['expenseReport']> {
    return {
      data: this.gymManagementService.getSnapshot().expenseReport,
    };
  }

  @Get('reports/profit')
  getProfitReport(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['profitReport']> {
    return {
      data: this.gymManagementService.getSnapshot().profitReport,
    };
  }

  @Get('settings')
  getSettings(): ApiResponse<ReturnType<GymManagementService['getSnapshot']>['dataset']['systemConfigs']> {
    return {
      data: this.gymManagementService.getSnapshot().dataset.systemConfigs,
    };
  }
}
