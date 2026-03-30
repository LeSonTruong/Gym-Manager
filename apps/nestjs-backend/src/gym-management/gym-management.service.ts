import {
  createGymManagementMockData,
  createGymManagementSnapshot,
  findEquipmentAssetById,
  findMemberById,
  findOperatingExpenseById,
  findPayrollPeriodById,
  findPersonalTrainerById,
  findPtContractByPtId,
  findSalesInvoiceById,
  getAttendanceByPtId,
  getMemberAssignmentsByMemberId,
  getMembershipInvoicesByMemberId,
  getPayrollEntriesByPeriodId,
  getSalesInvoicesByMemberId,
  type DemoUser,
  type GymManagementDataset,
  type GymManagementSnapshot,
} from '@next-nest-turbo-boilerplate/shared';
import {Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';

@Injectable()
export class GymManagementService {
  private readonly dataset: GymManagementDataset = createGymManagementMockData();

  getSnapshot(): GymManagementSnapshot {
    return createGymManagementSnapshot(this.dataset);
  }

  login(email: string, password: string): {
    user: DemoUser;
    accessToken: string;
    refreshToken: string;
  } {
    const user = this.dataset.users.find((currentUser) => currentUser.email === email);

    if (!user || password !== user.passwordHint) {
      throw new UnauthorizedException('Invalid demo credentials');
    }

    return {
      user,
      accessToken: `demo-access-token-${user.id}`,
      refreshToken: `demo-refresh-token-${user.id}`,
    };
  }

  getCurrentUser(): DemoUser {
    const currentUser = this.dataset.users[0];

    if (!currentUser) {
      throw new UnauthorizedException('No demo users configured');
    }

    return currentUser;
  }

  getPtDetail(ptId: string): {
    trainer: GymManagementSnapshot['dataset']['personalTrainers'][number];
    contract: GymManagementSnapshot['dataset']['ptContracts'][number] | undefined;
    attendance: GymManagementSnapshot['dataset']['attendanceLogs'];
    payrollEntries: GymManagementSnapshot['dataset']['payrollEntries'];
    assignedMembers: GymManagementSnapshot['dataset']['members'];
  } {
    const trainer = findPersonalTrainerById(this.dataset, ptId);

    if (!trainer) {
      throw new NotFoundException(`PT ${ptId} not found`);
    }

    const assignedMembers = this.dataset.memberPtAssignments
      .filter((assignment) => assignment.ptId === ptId)
      .map((assignment) => findMemberById(this.dataset, assignment.memberId))
      .filter((member): member is GymManagementSnapshot['dataset']['members'][number] => member !== undefined);

    return {
      trainer,
      contract: findPtContractByPtId(this.dataset, ptId),
      attendance: getAttendanceByPtId(this.dataset, ptId),
      payrollEntries: this.dataset.payrollEntries.filter((entry) => entry.ptId === ptId),
      assignedMembers,
    };
  }

  getMemberDetail(memberId: string): {
    member: GymManagementSnapshot['dataset']['members'][number];
    memberships: GymManagementSnapshot['dataset']['memberMemberships'];
    ptAssignments: GymManagementSnapshot['dataset']['memberPtAssignments'];
    membershipInvoices: GymManagementSnapshot['dataset']['membershipInvoices'];
    salesInvoices: GymManagementSnapshot['dataset']['salesInvoices'];
  } {
    const member = findMemberById(this.dataset, memberId);

    if (!member) {
      throw new NotFoundException(`Member ${memberId} not found`);
    }

    return {
      member,
      memberships: this.dataset.memberMemberships.filter((membership) => membership.memberId === memberId),
      ptAssignments: getMemberAssignmentsByMemberId(this.dataset, memberId),
      membershipInvoices: getMembershipInvoicesByMemberId(this.dataset, memberId),
      salesInvoices: getSalesInvoicesByMemberId(this.dataset, memberId),
    };
  }

  getPayrollPeriodDetail(payrollPeriodId: string): {
    period: GymManagementSnapshot['dataset']['payrollPeriods'][number];
    entries: GymManagementSnapshot['dataset']['payrollEntries'];
  } {
    const period = findPayrollPeriodById(this.dataset, payrollPeriodId);

    if (!period) {
      throw new NotFoundException(`Payroll period ${payrollPeriodId} not found`);
    }

    return {
      period,
      entries: getPayrollEntriesByPeriodId(this.dataset, payrollPeriodId),
    };
  }

  getSalesInvoiceDetail(salesInvoiceId: string): GymManagementSnapshot['dataset']['salesInvoices'][number] {
    const salesInvoice = findSalesInvoiceById(this.dataset, salesInvoiceId);

    if (!salesInvoice) {
      throw new NotFoundException(`Sales invoice ${salesInvoiceId} not found`);
    }

    return salesInvoice;
  }

  getExpenseDetail(expenseId: string): GymManagementSnapshot['dataset']['operatingExpenses'][number] {
    const expense = findOperatingExpenseById(this.dataset, expenseId);

    if (!expense) {
      throw new NotFoundException(`Expense ${expenseId} not found`);
    }

    return expense;
  }

  getEquipmentDetail(equipmentAssetId: string): GymManagementSnapshot['dataset']['equipmentAssets'][number] {
    const equipmentAsset = findEquipmentAssetById(this.dataset, equipmentAssetId);

    if (!equipmentAsset) {
      throw new NotFoundException(`Equipment ${equipmentAssetId} not found`);
    }

    return equipmentAsset;
  }
}
