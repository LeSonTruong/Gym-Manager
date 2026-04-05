import { Migration } from '@mikro-orm/migrations';

export class Migration20260406000300RestorePtMemberCoreProfile extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      alter table "personal_trainers"
        add column if not exists "gender" varchar(30) not null default 'OTHER',
        add column if not exists "birth_date" date not null default date '2000-01-01',
        add column if not exists "start_date" date not null default current_date;

      alter table "members"
        add column if not exists "gender" varchar(30) not null default 'OTHER',
        add column if not exists "birth_date" date not null default date '2000-01-01',
        add column if not exists "registered_at" date not null default current_date;

      update "personal_trainers"
        set "start_date" = coalesce(date("created_at"), current_date)
        where "start_date" = current_date;

      update "members"
        set "registered_at" = coalesce(date("created_at"), current_date)
        where "registered_at" = current_date;
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      alter table "members"
        drop column if exists "registered_at",
        drop column if exists "birth_date",
        drop column if exists "gender";

      alter table "personal_trainers"
        drop column if exists "start_date",
        drop column if exists "birth_date",
        drop column if exists "gender";
    `);
  }
}
