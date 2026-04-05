"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GymManagementInitialMigration20260331000100 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class GymManagementInitialMigration20260331000100 extends migrations_1.Migration {
    async up() {
        this.addSql(`
      create table "users" (
        "id" varchar(120) not null,
        "full_name" varchar(160) not null,
        "email" varchar(180) not null,
        "role" varchar(30) not null,
        "status" varchar(30) not null,
        "password_hint" varchar(200) not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "users_pkey" primary key ("id"),
        constraint "users_email_unique" unique ("email")
      );

      create table "personal_trainers" (
        "id" varchar(120) not null,
        "code" varchar(30) not null,
        "full_name" varchar(160) not null,
        "gender" varchar(30) not null,
        "birth_date" date not null,
        "phone" varchar(40) not null,
        "email" varchar(180) not null,
        "address" varchar(255) not null,
        "status" varchar(30) not null,
        "specialties" jsonb not null,
        "experience_years" int not null,
        "avatar_url" varchar(500) not null,
        "start_date" date not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "personal_trainers_pkey" primary key ("id"),
        constraint "personal_trainers_code_unique" unique ("code"),
        constraint "personal_trainers_email_unique" unique ("email")
      );

      create table "members" (
        "id" varchar(120) not null,
        "code" varchar(30) not null,
        "full_name" varchar(160) not null,
        "gender" varchar(30) not null,
        "birth_date" date not null,
        "phone" varchar(40) not null,
        "email" varchar(180) not null,
        "address" varchar(255) not null,
        "height_cm" int not null,
        "weight_kg" int not null,
        "goal" varchar(255) not null,
        "health_notes" text not null,
        "registered_at" date not null,
        "status" varchar(30) not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "members_pkey" primary key ("id"),
        constraint "members_code_unique" unique ("code"),
        constraint "members_email_unique" unique ("email")
      );

      create table "membership_plans" (
        "id" varchar(120) not null,
        "code" varchar(40) not null,
        "name" varchar(160) not null,
        "type" varchar(30) not null,
        "price" numeric(15,2) not null,
        "duration_days" int not null,
        "usage_limit" int null,
        "includes_pt" boolean not null,
        "included_pt_sessions" int not null,
        "perks" jsonb not null,
        "status" varchar(30) not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "membership_plans_pkey" primary key ("id"),
        constraint "membership_plans_code_unique" unique ("code")
      );

      create table "products" (
        "id" varchar(120) not null,
        "code" varchar(40) not null,
        "name" varchar(160) not null,
        "category" varchar(80) not null,
        "unit_cost" numeric(15,2) not null,
        "sale_price" numeric(15,2) not null,
        "stock_on_hand" int not null,
        "minimum_stock_level" int not null,
        "status" varchar(30) not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "products_pkey" primary key ("id"),
        constraint "products_code_unique" unique ("code")
      );

      create table "system_configs" (
        "key" varchar(120) not null,
        "label" varchar(160) not null,
        "value" text not null,
        "description" text not null,
        constraint "system_configs_pkey" primary key ("key")
      );
    `);
        this.addSql(`
      create table "pt_contracts" (
        "id" varchar(120) not null,
        "pt_id" varchar(120) not null,
        "contract_type" varchar(160) not null,
        "salary_type" varchar(30) not null,
        "base_salary" numeric(15,2) not null,
        "min_valid_shift_hours" numeric(6,2) not null,
        "standard_shift_hours" numeric(6,2) not null,
        "overtime_hourly_rate" numeric(15,2) not null,
        "performance_bonus_threshold" int not null,
        "performance_bonus_amount" numeric(15,2) not null,
        "package_commission_rate" numeric(6,4) not null,
        "sales_commission_rate" numeric(6,4) not null,
        "allowances" numeric(15,2) not null,
        "penalty_rules" jsonb not null,
        "effective_from" date not null,
        "effective_to" date not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "pt_contracts_pkey" primary key ("id"),
        constraint "pt_contracts_pt_id_foreign" foreign key ("pt_id") references "personal_trainers" ("id") on update cascade
      );

      create table "attendance_logs" (
        "id" varchar(120) not null,
        "pt_id" varchar(120) not null,
        "attendance_date" date not null,
        "check_in_at" timestamp not null,
        "check_out_at" timestamp null,
        "worked_hours" numeric(6,2) not null,
        "overtime_hours" numeric(6,2) not null,
        "status" varchar(30) not null,
        "work_credit" numeric(6,2) not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "attendance_logs_pkey" primary key ("id"),
        constraint "attendance_logs_pt_id_foreign" foreign key ("pt_id") references "personal_trainers" ("id") on update cascade
      );

      create table "payroll_periods" (
        "id" varchar(120) not null,
        "code" varchar(30) not null,
        "from_date" date not null,
        "to_date" date not null,
        "status" varchar(30) not null,
        "submitted_at" timestamp null,
        "approved_by_user_id" varchar(120) null,
        "approved_at" timestamp null,
        "paid_at" timestamp null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "payroll_periods_pkey" primary key ("id"),
        constraint "payroll_periods_code_unique" unique ("code"),
        constraint "payroll_periods_approved_by_user_id_foreign" foreign key ("approved_by_user_id") references "users" ("id") on update cascade on delete set null
      );

      create table "member_memberships" (
        "id" varchar(120) not null,
        "member_id" varchar(120) not null,
        "membership_plan_id" varchar(120) not null,
        "start_date" date not null,
        "end_date" date not null,
        "remaining_sessions" int null,
        "status" varchar(30) not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "member_memberships_pkey" primary key ("id"),
        constraint "member_memberships_member_id_foreign" foreign key ("member_id") references "members" ("id") on update cascade,
        constraint "member_memberships_membership_plan_id_foreign" foreign key ("membership_plan_id") references "membership_plans" ("id") on update cascade
      );

      create table "membership_invoices" (
        "id" varchar(120) not null,
        "code" varchar(40) not null,
        "member_id" varchar(120) not null,
        "member_membership_id" varchar(120) not null,
        "invoice_date" timestamp not null,
        "total_amount" numeric(15,2) not null,
        "payment_method" varchar(30) not null,
        "status" varchar(30) not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "membership_invoices_pkey" primary key ("id"),
        constraint "membership_invoices_code_unique" unique ("code"),
        constraint "membership_invoices_member_id_foreign" foreign key ("member_id") references "members" ("id") on update cascade,
        constraint "membership_invoices_member_membership_id_foreign" foreign key ("member_membership_id") references "member_memberships" ("id") on update cascade
      );

      create table "inventory_transactions" (
        "id" varchar(120) not null,
        "product_id" varchar(120) not null,
        "type" varchar(30) not null,
        "quantity" int not null,
        "unit_cost" numeric(15,2) not null,
        "transaction_date" timestamp not null,
        "reference_code" varchar(60) not null,
        "note" text not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "inventory_transactions_pkey" primary key ("id"),
        constraint "inventory_transactions_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade
      );

    `);
        this.addSql(`
      create table "payroll_entries" (
        "id" varchar(120) not null,
        "payroll_period_id" varchar(120) not null,
        "pt_id" varchar(120) not null,
        "valid_shift_credits" numeric(8,2) not null,
        "overtime_hours" numeric(8,2) not null,
        "package_commission" numeric(15,2) not null,
        "sales_commission" numeric(15,2) not null,
        "performance_bonus" numeric(15,2) not null,
        "penalties" numeric(15,2) not null,
        "gross_pay" numeric(15,2) not null,
        "net_pay" numeric(15,2) not null,
        "status" varchar(30) not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "payroll_entries_pkey" primary key ("id"),
        constraint "payroll_entries_payroll_period_id_foreign" foreign key ("payroll_period_id") references "payroll_periods" ("id") on update cascade,
        constraint "payroll_entries_pt_id_foreign" foreign key ("pt_id") references "personal_trainers" ("id") on update cascade
      );

      create table "member_pt_assignments" (
        "id" varchar(120) not null,
        "member_id" varchar(120) not null,
        "pt_id" varchar(120) not null,
        "member_membership_id" varchar(120) not null,
        "assigned_from" date not null,
        "assigned_to" date null,
        "commission_amount" numeric(15,2) not null,
        "status" varchar(30) not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "member_pt_assignments_pkey" primary key ("id"),
        constraint "member_pt_assignments_member_id_foreign" foreign key ("member_id") references "members" ("id") on update cascade,
        constraint "member_pt_assignments_pt_id_foreign" foreign key ("pt_id") references "personal_trainers" ("id") on update cascade,
        constraint "member_pt_assignments_member_membership_id_foreign" foreign key ("member_membership_id") references "member_memberships" ("id") on update cascade
      );

      create table "sales_invoices" (
        "id" varchar(120) not null,
        "code" varchar(40) not null,
        "invoice_date" timestamp not null,
        "created_by_user_id" varchar(120) not null,
        "member_id" varchar(120) null,
        "customer_name" varchar(160) not null,
        "status" varchar(30) not null,
        "payment_method" varchar(30) not null,
        "discount_amount" numeric(15,2) not null,
        "total_amount" numeric(15,2) not null,
        "note" text not null,
        "confirmed_at" timestamp null,
        "cancelled_at" timestamp null,
        "cancellation_reason" text null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "sales_invoices_pkey" primary key ("id"),
        constraint "sales_invoices_code_unique" unique ("code"),
        constraint "sales_invoices_created_by_user_id_foreign" foreign key ("created_by_user_id") references "users" ("id") on update cascade,
        constraint "sales_invoices_member_id_foreign" foreign key ("member_id") references "members" ("id") on update cascade on delete set null
      );

      create table "operating_expenses" (
        "id" varchar(120) not null,
        "code" varchar(40) not null,
        "expense_date" date not null,
        "category" varchar(40) not null,
        "vendor_name" varchar(160) not null,
        "amount" numeric(15,2) not null,
        "description" text not null,
        "approved_by_user_id" varchar(120) null,
        "submitted_at" timestamp null,
        "approved_at" timestamp null,
        "rejected_at" timestamp null,
        "rejection_reason" text null,
        "paid_at" timestamp null,
        "attachment_url" varchar(500) null,
        "status" varchar(30) not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "operating_expenses_pkey" primary key ("id"),
        constraint "operating_expenses_code_unique" unique ("code"),
        constraint "operating_expenses_approved_by_user_id_foreign" foreign key ("approved_by_user_id") references "users" ("id") on update cascade on delete set null
      );
    `);
        this.addSql(`
      create table "sales_invoice_items" (
        "id" varchar(120) not null,
        "sales_invoice_id" varchar(120) not null,
        "product_id" varchar(120) not null,
        "quantity" int not null,
        "unit_price" numeric(15,2) not null,
        "unit_cost" numeric(15,2) not null,
        "line_total" numeric(15,2) not null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "sales_invoice_items_pkey" primary key ("id"),
        constraint "sales_invoice_items_sales_invoice_id_foreign" foreign key ("sales_invoice_id") references "sales_invoices" ("id") on update cascade on delete cascade,
        constraint "sales_invoice_items_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade
      );

      create table "audit_logs" (
        "id" varchar(120) not null,
        "action" varchar(120) not null,
        "resource" varchar(120) not null,
        "record_id" varchar(120) null,
        "changed_by_user_id" varchar(120) null,
        "method" varchar(16) not null,
        "path" varchar(255) not null,
        "status_code" int not null,
        "request_body" jsonb null,
        "response_body" jsonb null,
        "created_at" timestamp not null,
        "updated_at" timestamp not null,
        constraint "audit_logs_pkey" primary key ("id"),
        constraint "audit_logs_changed_by_user_id_foreign" foreign key ("changed_by_user_id") references "users" ("id") on update cascade on delete set null
      );

      create index "attendance_logs_pt_id_index" on "attendance_logs" ("pt_id");
      create index "attendance_logs_attendance_date_index" on "attendance_logs" ("attendance_date");
      create index "member_memberships_member_id_index" on "member_memberships" ("member_id");
      create index "member_memberships_end_date_index" on "member_memberships" ("end_date");
      create index "member_pt_assignments_member_id_index" on "member_pt_assignments" ("member_id");
      create index "member_pt_assignments_pt_id_index" on "member_pt_assignments" ("pt_id");
      create index "member_pt_assignments_status_index" on "member_pt_assignments" ("status");
      create index "inventory_transactions_product_id_index" on "inventory_transactions" ("product_id");
      create index "membership_invoices_invoice_date_index" on "membership_invoices" ("invoice_date");
      create index "sales_invoices_invoice_date_index" on "sales_invoices" ("invoice_date");
      create index "operating_expenses_expense_date_index" on "operating_expenses" ("expense_date");
      create index "operating_expenses_status_index" on "operating_expenses" ("status");
      create index "audit_logs_resource_record_id_index" on "audit_logs" ("resource", "record_id");
    `);
    }
    async down() {
        this.addSql('drop table if exists "audit_logs" cascade;');
        this.addSql('drop table if exists "sales_invoice_items" cascade;');
        this.addSql('drop table if exists "operating_expenses" cascade;');
        this.addSql('drop table if exists "sales_invoices" cascade;');
        this.addSql('drop table if exists "member_pt_assignments" cascade;');
        this.addSql('drop table if exists "payroll_entries" cascade;');
        this.addSql('drop table if exists "inventory_transactions" cascade;');
        this.addSql('drop table if exists "membership_invoices" cascade;');
        this.addSql('drop table if exists "member_memberships" cascade;');
        this.addSql('drop table if exists "payroll_periods" cascade;');
        this.addSql('drop table if exists "attendance_logs" cascade;');
        this.addSql('drop table if exists "pt_contracts" cascade;');
        this.addSql('drop table if exists "system_configs" cascade;');
        this.addSql('drop table if exists "products" cascade;');
        this.addSql('drop table if exists "membership_plans" cascade;');
        this.addSql('drop table if exists "members" cascade;');
        this.addSql('drop table if exists "personal_trainers" cascade;');
        this.addSql('drop table if exists "users" cascade;');
    }
}
exports.GymManagementInitialMigration20260331000100 = GymManagementInitialMigration20260331000100;
//# sourceMappingURL=Migration20260331000100_GymManagementInitial.js.map