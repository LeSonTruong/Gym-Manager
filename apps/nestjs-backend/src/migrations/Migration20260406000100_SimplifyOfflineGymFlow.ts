import { Migration } from '@mikro-orm/migrations';

export class Migration20260406000100SimplifyOfflineGymFlow extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      alter table "users"
        rename column "email" to "username";

      alter table "membership_plans"
        drop column if exists "usage_limit",
        drop column if exists "included_pt_sessions";

      alter table "member_memberships"
        drop column if exists "remaining_sessions";

      alter table "member_pt_assignments"
        drop column if exists "commission_type",
        drop column if exists "commission_value";
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      alter table "member_pt_assignments"
        add column if not exists "commission_type" varchar(20) null,
        add column if not exists "commission_value" numeric(15,2) null;

      alter table "member_memberships"
        add column if not exists "remaining_sessions" int null;

      alter table "membership_plans"
        add column if not exists "usage_limit" int null,
        add column if not exists "included_pt_sessions" int not null default 0;

      alter table "users"
        rename column "username" to "email";
    `);
  }
}
