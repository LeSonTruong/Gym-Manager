import { Migration } from '@mikro-orm/migrations';

export class Migration20260406000200RemoveEquipmentMaintenanceDomain extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      alter table "operating_expenses"
        drop constraint if exists "operating_expenses_equipment_asset_id_foreign";

      alter table "operating_expenses"
        drop column if exists "equipment_asset_id";

      drop table if exists "maintenance_records" cascade;
      drop table if exists "equipment_assets" cascade;
    `);
  }

  override async down(): Promise<void> {
    await Promise.resolve();
  }
}
