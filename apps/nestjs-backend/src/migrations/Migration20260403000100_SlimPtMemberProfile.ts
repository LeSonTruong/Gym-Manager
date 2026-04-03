import { Migration } from '@mikro-orm/migrations';

export class GymManagementSlimPtMemberProfileMigration20260403000100 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      alter table "personal_trainers" drop constraint if exists "personal_trainers_email_unique";
      alter table "members" drop constraint if exists "members_email_unique";

      alter table "personal_trainers"
        drop column if exists "gender",
        drop column if exists "birth_date",
        drop column if exists "email",
        drop column if exists "address",
        drop column if exists "specialties",
        drop column if exists "experience_years",
        drop column if exists "avatar_url",
        drop column if exists "start_date";

      alter table "members"
        drop column if exists "gender",
        drop column if exists "birth_date",
        drop column if exists "email",
        drop column if exists "address",
        drop column if exists "height_cm",
        drop column if exists "weight_kg",
        drop column if exists "goal",
        drop column if exists "health_notes",
        drop column if exists "registered_at";
    `);
  }

  override async down(): Promise<void> {
    this.addSql(`
      alter table "personal_trainers"
        add column "gender" varchar(30) not null default 'OTHER',
        add column "birth_date" date not null default current_date,
        add column "email" varchar(180) null,
        add column "address" varchar(255) not null default '',
        add column "specialties" jsonb not null default '[]'::jsonb,
        add column "experience_years" int not null default 0,
        add column "avatar_url" varchar(500) not null default '',
        add column "start_date" date not null default current_date;
      update "personal_trainers"
        set "email" = 'pt-' || "id" || '@offline.local'
        where "email" is null;
      alter table "personal_trainers"
        alter column "email" set not null;
      alter table "personal_trainers"
        add constraint "personal_trainers_email_unique" unique ("email");

      alter table "members"
        add column "gender" varchar(30) not null default 'OTHER',
        add column "birth_date" date not null default current_date,
        add column "email" varchar(180) null,
        add column "address" varchar(255) not null default '',
        add column "height_cm" int not null default 0,
        add column "weight_kg" int not null default 0,
        add column "goal" varchar(255) not null default '',
        add column "health_notes" text not null default '',
        add column "registered_at" date not null default current_date;
      update "members"
        set "email" = 'member-' || "id" || '@offline.local'
        where "email" is null;
      alter table "members"
        alter column "email" set not null;
      alter table "members"
        add constraint "members_email_unique" unique ("email");
    `);
  }
}
