"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymManagementParityMigration20260331000200 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class GymManagementParityMigration20260331000200 extends migrations_1.Migration {
    async up() {
        this.addSql(`
      alter table "users"
        rename column "password_hint" to "password_hash";
      alter table "users"
        alter column "password_hash" type varchar(255);
      alter table "users"
        add column "deleted_at" timestamp null;

      create table "refresh_tokens" (
        "id" varchar(120) not null,
        "user_id" varchar(120) not null,
        "token_hash" varchar(255) not null,
        "session_id" varchar(120) not null,
        "expires_at" timestamp not null,
        "revoked_at" timestamp null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "refresh_tokens_pkey" primary key ("id"),
        constraint "refresh_tokens_token_hash_unique" unique ("token_hash"),
        constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade
      );

      alter table "personal_trainers"
        add column "user_id" varchar(120) null,
        add column "deleted_at" timestamp null;
      alter table "personal_trainers"
        add constraint "personal_trainers_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;
      create unique index "personal_trainers_user_id_unique" on "personal_trainers" ("user_id");

      alter table "pt_contracts"
        add column "contract_code" varchar(60) null;
      update "pt_contracts"
      set "contract_code" = 'PTC-' || upper(replace("pt_id", '-', '')) || '-' || right("id", 3)
      where "contract_code" is null;
      alter table "pt_contracts"
        alter column "contract_code" set not null,
        alter column "effective_to" drop not null;
      alter table "pt_contracts"
        add constraint "pt_contracts_contract_code_unique" unique ("contract_code");

      alter table "attendance_logs"
        add column "paid_hours" numeric(6,2) not null default 0,
        add column "note" text null;
      update "attendance_logs" set "paid_hours" = "worked_hours";

      alter table "payroll_entries"
        add column "contract_id" varchar(120) null,
        add column "paid_hours_total" numeric(8,2) not null default 0,
        add column "base_salary_amount" numeric(15,2) not null default 0,
        add column "attendance_bonus_amount" numeric(15,2) not null default 0,
        add column "overtime_amount" numeric(15,2) not null default 0,
        add column "allowance_amount" numeric(15,2) not null default 0,
        add column "deduction_amount" numeric(15,2) not null default 0;
      alter table "payroll_entries"
        rename column "penalties" to "penalty_amount";
      alter table "payroll_entries"
        rename column "net_pay" to "total_amount";
      alter table "payroll_entries"
        add constraint "payroll_entries_contract_id_foreign" foreign key ("contract_id") references "pt_contracts" ("id") on update cascade on delete set null;

      alter table "members"
        add column "deleted_at" timestamp null;

      alter table "member_memberships"
        add column "deleted_at" timestamp null;

      alter table "member_pt_assignments"
        add column "commission_type" varchar(20) null,
        add column "commission_value" numeric(15,2) null,
        add column "note" text null;

      alter table "products"
        add column "deleted_at" timestamp null;

      alter table "equipment_assets"
        add column "category" varchar(120) null,
        add column "status" varchar(30) null,
        add column "location" varchar(160) null,
        add column "deleted_at" timestamp null;
      alter table "equipment_assets"
        rename column "condition" to "condition_status";
      alter table "equipment_assets"
        alter column "next_maintenance_at" drop not null;

      alter table "maintenance_records"
        add column "maintenance_type" varchar(30) null,
        add column "result_status" varchar(30) null,
        add column "note" text null,
        add column "created_by_user_id" varchar(120) null;
      alter table "maintenance_records"
        add constraint "maintenance_records_created_by_user_id_foreign" foreign key ("created_by_user_id") references "users" ("id") on update cascade on delete set null;

      alter table "system_configs"
        add column "updated_by_user_id" varchar(120) null,
        add column "created_at" timestamp not null default current_timestamp,
        add column "updated_at" timestamp not null default current_timestamp;
      alter table "system_configs"
        add constraint "system_configs_updated_by_user_id_foreign" foreign key ("updated_by_user_id") references "users" ("id") on update cascade on delete set null;
    `);
    }
    async down() {
        this.addSql(`
      alter table "system_configs" drop constraint if exists "system_configs_updated_by_user_id_foreign";
      alter table "system_configs"
        drop column if exists "updated_by_user_id",
        drop column if exists "created_at",
        drop column if exists "updated_at";

      alter table "maintenance_records" drop constraint if exists "maintenance_records_created_by_user_id_foreign";
      alter table "maintenance_records"
        drop column if exists "maintenance_type",
        drop column if exists "result_status",
        drop column if exists "note",
        drop column if exists "created_by_user_id";

      alter table "equipment_assets"
        rename column "condition_status" to "condition";
      alter table "equipment_assets"
        drop column if exists "category",
        drop column if exists "status",
        drop column if exists "location",
        drop column if exists "deleted_at";

      alter table "products" drop column if exists "deleted_at";
      alter table "member_pt_assignments"
        drop column if exists "commission_type",
        drop column if exists "commission_value",
        drop column if exists "note";
      alter table "member_memberships" drop column if exists "deleted_at";
      alter table "members" drop column if exists "deleted_at";

      alter table "payroll_entries" drop constraint if exists "payroll_entries_contract_id_foreign";
      alter table "payroll_entries"
        rename column "penalty_amount" to "penalties";
      alter table "payroll_entries"
        rename column "total_amount" to "net_pay";
      alter table "payroll_entries"
        drop column if exists "contract_id",
        drop column if exists "paid_hours_total",
        drop column if exists "base_salary_amount",
        drop column if exists "attendance_bonus_amount",
        drop column if exists "overtime_amount",
        drop column if exists "allowance_amount",
        drop column if exists "deduction_amount";

      alter table "attendance_logs"
        drop column if exists "paid_hours",
        drop column if exists "note";

      alter table "pt_contracts" drop constraint if exists "pt_contracts_contract_code_unique";
      alter table "pt_contracts"
        drop column if exists "contract_code";

      drop index if exists "personal_trainers_user_id_unique";
      alter table "personal_trainers" drop constraint if exists "personal_trainers_user_id_foreign";
      alter table "personal_trainers"
        drop column if exists "user_id",
        drop column if exists "deleted_at";

      drop table if exists "refresh_tokens" cascade;

      alter table "users"
        rename column "password_hash" to "password_hint";
      alter table "users"
        alter column "password_hint" type varchar(200);
      alter table "users" drop column if exists "deleted_at";
    `);
    }
}
exports.GymManagementParityMigration20260331000200 = GymManagementParityMigration20260331000200;
//# sourceMappingURL=Migration20260331000200_GymManagementParity.js.map