import {Migrator} from '@mikro-orm/migrations';
import {defineConfig, PostgreSqlDriver} from '@mikro-orm/postgresql';
// eslint-disable-next-line import-x/no-unassigned-import
import 'dotenv/config';

const mikroOrmConfig = defineConfig({
  entities: ['dist/**/entities/*.entity.js'],
  entitiesTs: ['src/**/entities/*.entity.ts'], // for TypeScript src folder
  migrations: {
    path: 'dist/src/migrations',
    pathTs: 'src/migrations',
  },
  driver: PostgreSqlDriver,
  dbName: process.env.POSTGRES_DB_NAME ?? 'gym_manager',
  password: process.env.POSTGRES_PASSWORD ?? 'postgres',
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  host: process.env.POSTGRES_HOST ?? 'localhost',
  user: process.env.POSTGRES_USER ?? 'postgres',
  debug: process.env.POSTGRES_DEBUG_MODE === 'true',
  timezone: process.env.POSTGRES_TIMEZONE ?? 'UTC',
  extensions: [Migrator],
});
export default mikroOrmConfig;
