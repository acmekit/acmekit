import { Migration } from "@acmekit/framework/mikro-orm/migrations";

export class Migration20260205065417 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "api_key" drop constraint if exists "api_key_token_unique";`);
    this.addSql(`create table if not exists "api_key" ("id" text not null, "token" text not null, "salt" text not null, "redacted" text not null, "title" text not null, "type" text check ("type" in ('client', 'secret')) not null, "last_used_at" timestamptz null, "created_by" text not null, "revoked_by" text null, "revoked_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "api_key_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_api_key_deleted_at" ON "api_key" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_api_key_token_unique" ON "api_key" ("token") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_api_key_revoked_at" ON "api_key" ("revoked_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_api_key_redacted" ON "api_key" ("redacted") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_api_key_type" ON "api_key" ("type") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "api_key" cascade;`);
  }

}
