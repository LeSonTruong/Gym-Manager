import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuditLogInterceptor } from './audit/audit-log.interceptor';
import { AuditLogService } from './audit/audit-log.service';
import { GymManagementController } from './gym-management.controller';
import { GymAuthGuard } from './auth/gym-auth.guard';
import { GymRolesGuard } from './auth/gym-roles.guard';
import {
  AttendanceLogEntity,
  AuditLogEntity,
  InventoryTransactionEntity,
  MemberEntity,
  MemberMembershipEntity,
  MemberPtAssignmentEntity,
  MembershipInvoiceEntity,
  MembershipPlanEntity,
  OperatingExpenseEntity,
  PayrollEntryEntity,
  PayrollPeriodEntity,
  PersonalTrainerEntity,
  ProductEntity,
  PtContractEntity,
  SalesInvoiceEntity,
  SalesInvoiceItemEntity,
  SystemConfigEntity,
  UserEntity,
} from './entities/gym-management.entity';
import { GymManagementSeedService } from './gym-management.seed.service';
import { GymManagementService } from './gym-management.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      UserEntity,
      PersonalTrainerEntity,
      PtContractEntity,
      AttendanceLogEntity,
      AuditLogEntity,
      PayrollPeriodEntity,
      PayrollEntryEntity,
      MemberEntity,
      MembershipPlanEntity,
      MemberMembershipEntity,
      MemberPtAssignmentEntity,
      MembershipInvoiceEntity,
      ProductEntity,
      InventoryTransactionEntity,
      SalesInvoiceEntity,
      SalesInvoiceItemEntity,
      OperatingExpenseEntity,
      SystemConfigEntity,
    ]),
  ],
  controllers: [GymManagementController],
  providers: [
    GymManagementService,
    GymManagementSeedService,
    GymAuthGuard,
    GymRolesGuard,
    AuditLogService,
    AuditLogInterceptor,
  ],
})
export class GymManagementModule {
 
}
