import { Migration } from '@mikro-orm/migrations';

export class GymManagementSlimPtMemberProfileMigration20260403000100 extends Migration {
    override async up(): Promise<void> {
        this.addSql(`
      alter table "personal_trainers" drop column "gender";
      alter table "personal_trainers" drop column "birth_date";
      alter table "personal_trainers" drop column "email";
      alter table "personal_trainers" drop column "address";
      alter table "personal_trainers" drop column "specialties";
      alter table "personal_trainers" drop column "experience_years";
      alter table "personal_trainers" drop column "avatar_url";
      alter table "personal_trainers" drop column "start_date";

      alter table "members" drop column "gender";
      alter table "members" drop column "birth_date";
      alter table "members" drop column "email";
      alter table "members" drop column "address";
      alter table "members" drop column "height_cm";
      alter table "members" drop column "weight_kg";
      alter table "members" drop column "goal";
      alter table "members" drop column "health_notes";
      alter table "members" drop column "registered_at";
    `);
    }

    override async down(): Promise<void> {
        this.addSql(`
      alter table "personal_trainers" add column "gender" varchar(30) not null default 'OTHER';
      alter table "personal_trainers" add column "birth_date" date not null default current_date;
      alter table "personal_trainers" add column "email" varchar(180) not null default '';
      alter table "personal_trainers" add column "address" varchar(255) not null default '';
      alter table "personal_trainers" add column "specialties" jsonb not null default '[]';
      alter table "personal_trainers" add column "experience_years" int not null default 0;
      alter table "personal_trainers" add column "avatar_url" varchar(500) not null default '';
      alter table "personal_trainers" add column "start_date" date not null default current_date;
      update "personal_trainers"
        set "email" = 'pt-' || "id" || '@offline.local'
        where "email" = '';
      create unique index if not exists "personal_trainers_email_unique" on "personal_trainers" ("email");

      alter table "members" add column "gender" varchar(30) not null default 'OTHER';
      alter table "members" add column "birth_date" date not null default current_date;
      alter table "members" add column "email" varchar(180) not null default '';
      alter table "members" add column "address" varchar(255) not null default '';
      alter table "members" add column "height_cm" int not null default 0;
      alter table "members" add column "weight_kg" int not null default 0;
      alter table "members" add column "goal" varchar(255) not null default '';
      alter table "members" add column "health_notes" text not null default '';
      alter table "members" add column "registered_at" date not null default current_date;
      update "members"
        set "email" = 'member-' || "id" || '@offline.local'
        where "email" = '';
      create unique index if not exists "members_email_unique" on "members" ("email");
    `);
    }
}
