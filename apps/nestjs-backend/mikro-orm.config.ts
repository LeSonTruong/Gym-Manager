import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
// eslint-disable-next-line import-x/no-unassigned-import
import 'dotenv/config';

const isLocalSqlite = (process.env.POSTGRES_HOST ?? '').toLowerCase() === 'sqlite';
const baseConfig = {
  entities: ['dist/**/entities/*.entity.js'],
  entitiesTs: ['src/**/entities/*.entity.ts'], // for TypeScript src folder
  migrations: {
    path: 'dist/src/migrations',
    pathTs: 'src/migrations',
  },
  debug: process.env.POSTGRES_DEBUG_MODE === 'true',
  extensions: [Migrator],
};

function resolveSqliteDriver() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
    const sqlitePackage = require('@mikro-orm/sqlite') as { SqliteDriver: unknown };

    return sqlitePackage.SqliteDriver as never;
  } catch {
    throw new Error(
      'SQLite driver is not installed. Install optional dependencies to use POSTGRES_HOST=sqlite.',
    );
  }
}

const mikroOrmConfig = isLocalSqlite
  ? defineConfig({
    ...baseConfig,
    driver: resolveSqliteDriver(),
    dbName: process.env.POSTGRES_DB_NAME ?? 'gym-manager.local.sqlite',
  })
  : defineConfig({
    ...baseConfig,
    driver: PostgreSqlDriver,
    dbName: process.env.POSTGRES_DB_NAME ?? 'gym_manager',
    password: process.env.POSTGRES_PASSWORD ?? 'postgres',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    host: process.env.POSTGRES_HOST ?? 'localhost',
    user: process.env.POSTGRES_USER ?? 'postgres',
    timezone: process.env.POSTGRES_TIMEZONE ?? 'UTC',
  });
export default mikroOrmConfig;
