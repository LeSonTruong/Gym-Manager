import {MikroOrmModule} from '@mikro-orm/nestjs';
import {Module} from '@nestjs/common';
import {GymManagementController} from './gym-management.controller';
import {
  AttendanceLogEntity,
  EquipmentAssetEntity,
  InventoryTransactionEntity,
  MaintenanceRecordEntity,
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
import {GymManagementSeedService} from './gym-management.seed.service';
import {GymManagementService} from './gym-management.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      UserEntity,
      PersonalTrainerEntity,
      PtContractEntity,
      AttendanceLogEntity,
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
      EquipmentAssetEntity,
      OperatingExpenseEntity,
      MaintenanceRecordEntity,
      SystemConfigEntity,
    ]),
  ],
  controllers: [GymManagementController],
  providers: [GymManagementService, GymManagementSeedService],
})
export class GymManagementModule {}
