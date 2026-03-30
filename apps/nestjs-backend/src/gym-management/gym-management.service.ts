import {MikroORM, type RequiredEntityData, wrap} from '@mikro-orm/core';
import {EntityManager} from '@mikro-orm/postgresql';
import {
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
import {
  mapDatasetFromEntities,
  mapEquipmentAssetEntity,
  mapMemberEntity,
  mapMembershipPlanEntity,
  mapOperatingExpenseEntity,
  mapPersonalTrainerEntity,
  mapProductEntity,
  mapSystemConfigEntity,
  mapUserEntity,
  parseDateOnly,
  toDecimalString,
} from './gym-management.mapper';

type LoginResult = {
  user: DemoUser;
  accessToken: string;
  refreshToken: string;
};

type TrainerRecord = GymManagementDataset['personalTrainers'][number];
type MemberRecord = GymManagementDataset['members'][number];
type MembershipPlanRecord = GymManagementDataset['membershipPlans'][number];
type ProductRecord = GymManagementDataset['products'][number];
type EquipmentAssetRecord = GymManagementDataset['equipmentAssets'][number];
type OperatingExpenseRecord = GymManagementDataset['operatingExpenses'][number];
type SystemConfigRecord = GymManagementDataset['systemConfigs'][number];

@Injectable()
export class GymManagementService {
  constructor(private readonly orm: MikroORM) {}

  async getSnapshot(): Promise<GymManagementSnapshot> {
    return createGymManagementSnapshot(await this.loadDataset());
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const em = this.createEntityManager();
    const userEntity = await em.findOne(UserEntity, {email});

    if (!userEntity || password !== userEntity.passwordHint) {
      throw new UnauthorizedException('Invalid demo credentials');
    }

    const user = mapUserEntity(userEntity);

    return {
      user,
      accessToken: `demo-access-token-${user.id}`,
      refreshToken: `demo-refresh-token-${user.id}`,
    };
  }

  async getCurrentUser(): Promise<DemoUser> {
    const em = this.createEntityManager();
    const currentUsers = await em.find(UserEntity, {status: 'ACTIVE'}, {orderBy: {createdAt: 'asc', id: 'asc'}, limit: 1});
    const currentUser = currentUsers[0];

    if (!currentUser) {
      throw new UnauthorizedException('No demo users configured');
    }

    return mapUserEntity(currentUser);
  }

  async getPtDetail(ptId: string): Promise<{
    trainer: TrainerRecord;
    contract: GymManagementSnapshot['dataset']['ptContracts'][number] | undefined;
    attendance: GymManagementSnapshot['dataset']['attendanceLogs'];
    payrollEntries: GymManagementSnapshot['dataset']['payrollEntries'];
    assignedMembers: GymManagementSnapshot['dataset']['members'];
  }> {
    const dataset = await this.loadDataset();
    const trainer = findPersonalTrainerById(dataset, ptId);

    if (!trainer) {
      throw new NotFoundException(`PT ${ptId} not found`);
    }

    const assignedMembers = dataset.memberPtAssignments
      .filter((assignment) => assignment.ptId === ptId)
      .map((assignment) => findMemberById(dataset, assignment.memberId))
      .filter((member): member is GymManagementSnapshot['dataset']['members'][number] => member !== undefined);

    return {
      trainer,
      contract: findPtContractByPtId(dataset, ptId),
      attendance: getAttendanceByPtId(dataset, ptId),
      payrollEntries: dataset.payrollEntries.filter((entry) => entry.ptId === ptId),
      assignedMembers,
    };
  }

  async getMemberDetail(memberId: string): Promise<{
    member: MemberRecord;
    memberships: GymManagementSnapshot['dataset']['memberMemberships'];
    ptAssignments: GymManagementSnapshot['dataset']['memberPtAssignments'];
    membershipInvoices: GymManagementSnapshot['dataset']['membershipInvoices'];
    salesInvoices: GymManagementSnapshot['dataset']['salesInvoices'];
  }> {
    const dataset = await this.loadDataset();
    const member = findMemberById(dataset, memberId);

    if (!member) {
      throw new NotFoundException(`Member ${memberId} not found`);
    }

    return {
      member,
      memberships: dataset.memberMemberships.filter((membership) => membership.memberId === memberId),
      ptAssignments: getMemberAssignmentsByMemberId(dataset, memberId),
      membershipInvoices: getMembershipInvoicesByMemberId(dataset, memberId),
      salesInvoices: getSalesInvoicesByMemberId(dataset, memberId),
    };
  }

  async getPayrollPeriodDetail(payrollPeriodId: string): Promise<{
    period: GymManagementSnapshot['dataset']['payrollPeriods'][number];
    entries: GymManagementSnapshot['dataset']['payrollEntries'];
  }> {
    const dataset = await this.loadDataset();
    const period = findPayrollPeriodById(dataset, payrollPeriodId);

    if (!period) {
      throw new NotFoundException(`Payroll period ${payrollPeriodId} not found`);
    }

    return {
      period,
      entries: getPayrollEntriesByPeriodId(dataset, payrollPeriodId),
    };
  }

  async getSalesInvoiceDetail(salesInvoiceId: string): Promise<GymManagementSnapshot['dataset']['salesInvoices'][number]> {
    const dataset = await this.loadDataset();
    const salesInvoice = findSalesInvoiceById(dataset, salesInvoiceId);

    if (!salesInvoice) {
      throw new NotFoundException(`Sales invoice ${salesInvoiceId} not found`);
    }

    return salesInvoice;
  }

  async getExpenseDetail(expenseId: string): Promise<OperatingExpenseRecord> {
    const dataset = await this.loadDataset();
    const expense = findOperatingExpenseById(dataset, expenseId);

    if (!expense) {
      throw new NotFoundException(`Expense ${expenseId} not found`);
    }

    return expense;
  }

  async getEquipmentDetail(equipmentAssetId: string): Promise<EquipmentAssetRecord> {
    const dataset = await this.loadDataset();
    const equipmentAsset = findEquipmentAssetById(dataset, equipmentAssetId);

    if (!equipmentAsset) {
      throw new NotFoundException(`Equipment ${equipmentAssetId} not found`);
    }

    return equipmentAsset;
  }

  async createPersonalTrainer(createPersonalTrainerDto: CreatePersonalTrainerDto): Promise<TrainerRecord> {
    const em = this.createEntityManager();
    const trainerData =
      this.toPersonalTrainerEntityData(createPersonalTrainerDto) as unknown as RequiredEntityData<PersonalTrainerEntity>;
    const trainer = em.create(PersonalTrainerEntity, trainerData);

    em.persist(trainer);
    await em.flush();

    return mapPersonalTrainerEntity(trainer);
  }

  async updatePersonalTrainer(ptId: string, updatePersonalTrainerDto: UpdatePersonalTrainerDto): Promise<TrainerRecord> {
    const em = this.createEntityManager();
    const trainer = await this.getRequiredPersonalTrainerEntity(em, ptId);

    wrap(trainer).assign(this.toPersonalTrainerEntityData(updatePersonalTrainerDto), {ignoreUndefined: true});
    await em.flush();

    return mapPersonalTrainerEntity(trainer);
  }

  async deletePersonalTrainer(ptId: string): Promise<TrainerRecord> {
    const em = this.createEntityManager();
    const trainer = await this.getRequiredPersonalTrainerEntity(em, ptId);

    trainer.status = 'INACTIVE';
    await em.flush();

    return mapPersonalTrainerEntity(trainer);
  }

  async createMember(createMemberDto: CreateMemberDto): Promise<MemberRecord> {
    const em = this.createEntityManager();
    const memberData = this.toMemberEntityData(createMemberDto) as unknown as RequiredEntityData<MemberEntity>;
    const member = em.create(MemberEntity, memberData);

    em.persist(member);
    await em.flush();

    return mapMemberEntity(member);
  }

  async updateMember(memberId: string, updateMemberDto: UpdateMemberDto): Promise<MemberRecord> {
    const em = this.createEntityManager();
    const member = await this.getRequiredMemberEntity(em, memberId);

    wrap(member).assign(this.toMemberEntityData(updateMemberDto), {ignoreUndefined: true});
    await em.flush();

    return mapMemberEntity(member);
  }

  async deleteMember(memberId: string): Promise<MemberRecord> {
    const em = this.createEntityManager();
    const member = await this.getRequiredMemberEntity(em, memberId);

    member.status = 'INACTIVE';
    await em.flush();

    return mapMemberEntity(member);
  }

  async createMembershipPlan(createMembershipPlanDto: CreateMembershipPlanDto): Promise<MembershipPlanRecord> {
    const em = this.createEntityManager();
    const membershipPlanData =
      this.toMembershipPlanEntityData(createMembershipPlanDto) as unknown as RequiredEntityData<MembershipPlanEntity>;
    const membershipPlan = em.create(MembershipPlanEntity, membershipPlanData);

    em.persist(membershipPlan);
    await em.flush();

    return mapMembershipPlanEntity(membershipPlan);
  }

  async updateMembershipPlan(
    membershipPlanId: string,
    updateMembershipPlanDto: UpdateMembershipPlanDto,
  ): Promise<MembershipPlanRecord> {
    const em = this.createEntityManager();
    const membershipPlan = await this.getRequiredMembershipPlanEntity(em, membershipPlanId);

    wrap(membershipPlan).assign(this.toMembershipPlanEntityData(updateMembershipPlanDto), {ignoreUndefined: true});
    await em.flush();

    return mapMembershipPlanEntity(membershipPlan);
  }

  async deleteMembershipPlan(membershipPlanId: string): Promise<MembershipPlanRecord> {
    const em = this.createEntityManager();
    const membershipPlan = await this.getRequiredMembershipPlanEntity(em, membershipPlanId);

    membershipPlan.status = 'OFF_SALE';
    await em.flush();

    return mapMembershipPlanEntity(membershipPlan);
  }

  async createProduct(createProductDto: CreateProductDto): Promise<ProductRecord> {
    const em = this.createEntityManager();
    const productData = this.toProductEntityData(createProductDto) as unknown as RequiredEntityData<ProductEntity>;
    const product = em.create(ProductEntity, productData);

    em.persist(product);
    await em.flush();

    return mapProductEntity(product);
  }

  async updateProduct(productId: string, updateProductDto: UpdateProductDto): Promise<ProductRecord> {
    const em = this.createEntityManager();
    const product = await this.getRequiredProductEntity(em, productId);

    wrap(product).assign(this.toProductEntityData(updateProductDto), {ignoreUndefined: true});
    await em.flush();

    return mapProductEntity(product);
  }

  async deleteProduct(productId: string): Promise<ProductRecord> {
    const em = this.createEntityManager();
    const product = await this.getRequiredProductEntity(em, productId);

    product.status = 'INACTIVE';
    await em.flush();

    return mapProductEntity(product);
  }

  async createEquipment(createEquipmentDto: CreateEquipmentDto): Promise<EquipmentAssetRecord> {
    const em = this.createEntityManager();
    const equipmentAssetData =
      this.toEquipmentAssetEntityData(createEquipmentDto) as unknown as RequiredEntityData<EquipmentAssetEntity>;
    const equipmentAsset = em.create(EquipmentAssetEntity, equipmentAssetData);

    em.persist(equipmentAsset);
    await em.flush();

    return mapEquipmentAssetEntity(equipmentAsset);
  }

  async updateEquipment(equipmentAssetId: string, updateEquipmentDto: UpdateEquipmentDto): Promise<EquipmentAssetRecord> {
    const em = this.createEntityManager();
    const equipmentAsset = await this.getRequiredEquipmentAssetEntity(em, equipmentAssetId);

    wrap(equipmentAsset).assign(this.toEquipmentAssetEntityData(updateEquipmentDto), {ignoreUndefined: true});
    await em.flush();

    return mapEquipmentAssetEntity(equipmentAsset);
  }

  async createOperatingExpense(createOperatingExpenseDto: CreateOperatingExpenseDto): Promise<OperatingExpenseRecord> {
    const em = this.createEntityManager();
    const operatingExpenseData =
      (await this.toOperatingExpenseEntityData(em, createOperatingExpenseDto)) as unknown as RequiredEntityData<OperatingExpenseEntity>;
    const operatingExpense = em.create(
      OperatingExpenseEntity,
      operatingExpenseData,
    );

    em.persist(operatingExpense);
    await em.flush();

    return mapOperatingExpenseEntity(operatingExpense);
  }

  async updateOperatingExpense(
    expenseId: string,
    updateOperatingExpenseDto: UpdateOperatingExpenseDto,
  ): Promise<OperatingExpenseRecord> {
    const em = this.createEntityManager();
    const operatingExpense = await this.getRequiredOperatingExpenseEntity(em, expenseId);

    wrap(operatingExpense).assign(await this.toOperatingExpenseEntityData(em, updateOperatingExpenseDto), {
      ignoreUndefined: true,
    });
    await em.flush();

    return mapOperatingExpenseEntity(operatingExpense);
  }

  async patchSystemConfig(configKey: string, patchSystemConfigDto: PatchSystemConfigDto): Promise<SystemConfigRecord> {
    const em = this.createEntityManager();
    const systemConfig = await this.getRequiredSystemConfigEntity(em, configKey);

    systemConfig.value = patchSystemConfigDto.value;
    await em.flush();

    return mapSystemConfigEntity(systemConfig);
  }

  private createEntityManager(): EntityManager {
    return this.orm.em.fork() as EntityManager;
  }

  private async loadDataset(): Promise<GymManagementDataset> {
    const em = this.createEntityManager();

    const [
      users,
      personalTrainers,
      ptContracts,
      attendanceLogs,
      payrollPeriods,
      payrollEntries,
      members,
      membershipPlans,
      memberMemberships,
      memberPtAssignments,
      membershipInvoices,
      products,
      inventoryTransactions,
      salesInvoices,
      salesInvoiceItems,
      operatingExpenses,
      equipmentAssets,
      maintenanceRecords,
      systemConfigs,
    ] = await Promise.all([
      em.findAll(UserEntity, {orderBy: {createdAt: 'asc', id: 'asc'}}),
      em.findAll(PersonalTrainerEntity, {orderBy: {code: 'asc'}}),
      em.findAll(PtContractEntity, {orderBy: {effectiveFrom: 'asc', id: 'asc'}}),
      em.findAll(AttendanceLogEntity, {orderBy: {attendanceDate: 'asc', checkInAt: 'asc', id: 'asc'}}),
      em.findAll(PayrollPeriodEntity, {orderBy: {fromDate: 'asc', id: 'asc'}}),
      em.findAll(PayrollEntryEntity, {orderBy: {createdAt: 'asc', id: 'asc'}}),
      em.findAll(MemberEntity, {orderBy: {code: 'asc'}}),
      em.findAll(MembershipPlanEntity, {orderBy: {code: 'asc'}}),
      em.findAll(MemberMembershipEntity, {orderBy: {startDate: 'asc', id: 'asc'}}),
      em.findAll(MemberPtAssignmentEntity, {orderBy: {assignedFrom: 'asc', id: 'asc'}}),
      em.findAll(MembershipInvoiceEntity, {orderBy: {invoiceDate: 'asc', id: 'asc'}}),
      em.findAll(ProductEntity, {orderBy: {code: 'asc'}}),
      em.findAll(InventoryTransactionEntity, {orderBy: {transactionDate: 'asc', id: 'asc'}}),
      em.findAll(SalesInvoiceEntity, {orderBy: {invoiceDate: 'asc', id: 'asc'}}),
      em.findAll(SalesInvoiceItemEntity, {orderBy: {createdAt: 'asc', id: 'asc'}}),
      em.findAll(OperatingExpenseEntity, {orderBy: {expenseDate: 'asc', id: 'asc'}}),
      em.findAll(EquipmentAssetEntity, {orderBy: {code: 'asc'}}),
      em.findAll(MaintenanceRecordEntity, {orderBy: {maintenanceDate: 'asc', id: 'asc'}}),
      em.findAll(SystemConfigEntity, {orderBy: {key: 'asc'}}),
    ]);

    return mapDatasetFromEntities({
      users,
      personalTrainers,
      ptContracts,
      attendanceLogs,
      payrollPeriods,
      payrollEntries,
      members,
      membershipPlans,
      memberMemberships,
      memberPtAssignments,
      membershipInvoices,
      products,
      inventoryTransactions,
      salesInvoices,
      salesInvoiceItems,
      operatingExpenses,
      equipmentAssets,
      maintenanceRecords,
      systemConfigs,
    });
  }

  private toPersonalTrainerEntityData(
    dto: CreatePersonalTrainerDto | UpdatePersonalTrainerDto,
  ): Partial<PersonalTrainerEntity> {
    const data: Partial<PersonalTrainerEntity> = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }

    if (dto.fullName !== undefined) {
      data.fullName = dto.fullName;
    }

    if (dto.gender !== undefined) {
      data.gender = dto.gender;
    }

    if (dto.birthDate !== undefined) {
      data.birthDate = parseDateOnly(dto.birthDate);
    }

    if (dto.phone !== undefined) {
      data.phone = dto.phone;
    }

    if (dto.email !== undefined) {
      data.email = dto.email;
    }

    if (dto.address !== undefined) {
      data.address = dto.address;
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    if (dto.specialties !== undefined) {
      data.specialties = dto.specialties;
    }

    if (dto.experienceYears !== undefined) {
      data.experienceYears = dto.experienceYears;
    }

    if (dto.avatarUrl !== undefined) {
      data.avatarUrl = dto.avatarUrl;
    }

    if (dto.startDate !== undefined) {
      data.startDate = parseDateOnly(dto.startDate);
    }

    return data;
  }

  private toMemberEntityData(dto: CreateMemberDto | UpdateMemberDto): Partial<MemberEntity> {
    const data: Partial<MemberEntity> = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }

    if (dto.fullName !== undefined) {
      data.fullName = dto.fullName;
    }

    if (dto.gender !== undefined) {
      data.gender = dto.gender;
    }

    if (dto.birthDate !== undefined) {
      data.birthDate = parseDateOnly(dto.birthDate);
    }

    if (dto.phone !== undefined) {
      data.phone = dto.phone;
    }

    if (dto.email !== undefined) {
      data.email = dto.email;
    }

    if (dto.address !== undefined) {
      data.address = dto.address;
    }

    if (dto.heightCm !== undefined) {
      data.heightCm = dto.heightCm;
    }

    if (dto.weightKg !== undefined) {
      data.weightKg = dto.weightKg;
    }

    if (dto.goal !== undefined) {
      data.goal = dto.goal;
    }

    if (dto.healthNotes !== undefined) {
      data.healthNotes = dto.healthNotes;
    }

    if (dto.registeredAt !== undefined) {
      data.registeredAt = parseDateOnly(dto.registeredAt);
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    return data;
  }

  private toMembershipPlanEntityData(
    dto: CreateMembershipPlanDto | UpdateMembershipPlanDto,
  ): Partial<MembershipPlanEntity> {
    const data: Partial<MembershipPlanEntity> = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (dto.type !== undefined) {
      data.type = dto.type;
    }

    if (dto.price !== undefined) {
      data.price = toDecimalString(dto.price);
    }

    if (dto.durationDays !== undefined) {
      data.durationDays = dto.durationDays;
    }

    if (dto.usageLimit !== undefined) {
      data.usageLimit = dto.usageLimit;
    }

    if (dto.includesPt !== undefined) {
      data.includesPt = dto.includesPt;
    }

    if (dto.includedPtSessions !== undefined) {
      data.includedPtSessions = dto.includedPtSessions;
    }

    if (dto.perks !== undefined) {
      data.perks = dto.perks;
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    return data;
  }

  private toProductEntityData(dto: CreateProductDto | UpdateProductDto): Partial<ProductEntity> {
    const data: Partial<ProductEntity> = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (dto.category !== undefined) {
      data.category = dto.category;
    }

    if (dto.unitCost !== undefined) {
      data.unitCost = toDecimalString(dto.unitCost);
    }

    if (dto.salePrice !== undefined) {
      data.salePrice = toDecimalString(dto.salePrice);
    }

    if (dto.stockOnHand !== undefined) {
      data.stockOnHand = dto.stockOnHand;
    }

    if (dto.minimumStockLevel !== undefined) {
      data.minimumStockLevel = dto.minimumStockLevel;
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    return data;
  }

  private toEquipmentAssetEntityData(dto: CreateEquipmentDto | UpdateEquipmentDto): Partial<EquipmentAssetEntity> {
    const data: Partial<EquipmentAssetEntity> = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }

    if (dto.name !== undefined) {
      data.name = dto.name;
    }

    if (dto.purchasedAt !== undefined) {
      data.purchasedAt = parseDateOnly(dto.purchasedAt);
    }

    if (dto.purchaseValue !== undefined) {
      data.purchaseValue = toDecimalString(dto.purchaseValue);
    }

    if (dto.condition !== undefined) {
      data.condition = dto.condition;
    }

    if (dto.nextMaintenanceAt !== undefined) {
      data.nextMaintenanceAt = parseDateOnly(dto.nextMaintenanceAt);
    }

    if (dto.note !== undefined) {
      data.note = dto.note;
    }

    return data;
  }

  private async toOperatingExpenseEntityData(
    em: EntityManager,
    dto: CreateOperatingExpenseDto | UpdateOperatingExpenseDto,
  ): Promise<Partial<OperatingExpenseEntity>> {
    const data: Partial<OperatingExpenseEntity> = {};

    if (dto.code !== undefined) {
      data.code = dto.code;
    }

    if (dto.expenseDate !== undefined) {
      data.expenseDate = parseDateOnly(dto.expenseDate);
    }

    if (dto.category !== undefined) {
      data.category = dto.category;
    }

    if (dto.equipmentAssetId !== undefined) {
      data.equipmentAsset = (await this.resolveEquipmentAsset(em, dto.equipmentAssetId)) ?? null;
    }

    if (dto.vendorName !== undefined) {
      data.vendorName = dto.vendorName;
    }

    if (dto.amount !== undefined) {
      data.amount = toDecimalString(dto.amount);
    }

    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    if (dto.approvedByUserId !== undefined) {
      data.approvedByUser = (await this.resolveApprovedByUser(em, dto.approvedByUserId)) ?? null;
    }

    if (dto.attachmentUrl !== undefined) {
      data.attachmentUrl = dto.attachmentUrl;
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    return data;
  }

  private async resolveEquipmentAsset(
    em: EntityManager,
    equipmentAssetId?: string,
  ): Promise<EquipmentAssetEntity | undefined> {
    if (equipmentAssetId === undefined || equipmentAssetId === null) {
      return undefined;
    }

    const equipmentAsset = await em.findOne(EquipmentAssetEntity, {id: equipmentAssetId});

    if (!equipmentAsset) {
      throw new NotFoundException(`Equipment ${equipmentAssetId} not found`);
    }

    return equipmentAsset;
  }

  private async resolveApprovedByUser(
    em: EntityManager,
    approvedByUserId?: string,
  ): Promise<UserEntity | undefined> {
    if (approvedByUserId === undefined || approvedByUserId === null) {
      return undefined;
    }

    const approvedByUser = await em.findOne(UserEntity, {id: approvedByUserId});

    if (!approvedByUser) {
      throw new NotFoundException(`User ${approvedByUserId} not found`);
    }

    return approvedByUser;
  }

  private async getRequiredPersonalTrainerEntity(em: EntityManager, ptId: string): Promise<PersonalTrainerEntity> {
    const personalTrainer = await em.findOne(PersonalTrainerEntity, {id: ptId});

    if (!personalTrainer) {
      throw new NotFoundException(`PT ${ptId} not found`);
    }

    return personalTrainer;
  }

  private async getRequiredMemberEntity(em: EntityManager, memberId: string): Promise<MemberEntity> {
    const member = await em.findOne(MemberEntity, {id: memberId});

    if (!member) {
      throw new NotFoundException(`Member ${memberId} not found`);
    }

    return member;
  }

  private async getRequiredMembershipPlanEntity(
    em: EntityManager,
    membershipPlanId: string,
  ): Promise<MembershipPlanEntity> {
    return this.findMembershipPlanOrThrow(em, membershipPlanId);
  }

  private async findMembershipPlanOrThrow(em: EntityManager, membershipPlanId: string): Promise<MembershipPlanEntity> {
    const membershipPlan = await em.findOne(MembershipPlanEntity, {id: membershipPlanId});

    if (!membershipPlan) {
      throw new NotFoundException(`Membership plan ${membershipPlanId} not found`);
    }

    return membershipPlan;
  }

  private async getRequiredProductEntity(em: EntityManager, productId: string): Promise<ProductEntity> {
    const product = await em.findOne(ProductEntity, {id: productId});

    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    return product;
  }

  private async getRequiredOperatingExpenseEntity(
    em: EntityManager,
    expenseId: string,
  ): Promise<OperatingExpenseEntity> {
    return this.findOperatingExpenseOrThrow(em, expenseId);
  }

  private async getRequiredEquipmentAssetEntity(em: EntityManager, equipmentAssetId: string): Promise<EquipmentAssetEntity> {
    const equipmentAsset = await em.findOne(EquipmentAssetEntity, {id: equipmentAssetId});

    if (!equipmentAsset) {
      throw new NotFoundException(`Equipment ${equipmentAssetId} not found`);
    }

    return equipmentAsset;
  }

  private async findOperatingExpenseOrThrow(em: EntityManager, expenseId: string): Promise<OperatingExpenseEntity> {
    const operatingExpense = await em.findOne(OperatingExpenseEntity, {id: expenseId});

    if (!operatingExpense) {
      throw new NotFoundException(`Expense ${expenseId} not found`);
    }

    return operatingExpense;
  }

  private async getRequiredSystemConfigEntity(em: EntityManager, configKey: string): Promise<SystemConfigEntity> {
    const systemConfig = await em.findOne(SystemConfigEntity, {key: configKey});

    if (!systemConfig) {
      throw new NotFoundException(`System config ${configKey} not found`);
    }

    return systemConfig;
  }
}
