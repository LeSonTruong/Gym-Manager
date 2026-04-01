"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const migrations_1 = require("@mikro-orm/migrations");
const core_1 = require("@mikro-orm/core");
const postgresql_1 = require("@mikro-orm/postgresql");
const sqlite_1 = require("@mikro-orm/sqlite");
require("dotenv/config");
const isLocalSqlite = (process.env.POSTGRES_HOST ?? '').toLowerCase() === 'sqlite';
const baseConfig = {
    entities: ['dist/**/entities/*.entity.js'],
    entitiesTs: ['src/**/entities/*.entity.ts'],
    migrations: {
        path: 'dist/src/migrations',
        pathTs: 'src/migrations',
    },
    debug: process.env.POSTGRES_DEBUG_MODE === 'true',
    extensions: [migrations_1.Migrator],
};
const mikroOrmConfig = isLocalSqlite
    ? (0, core_1.defineConfig)({
        ...baseConfig,
        driver: sqlite_1.SqliteDriver,
        dbName: process.env.POSTGRES_DB_NAME ?? 'gym-manager.local.sqlite',
    })
    : (0, core_1.defineConfig)({
        ...baseConfig,
        driver: postgresql_1.PostgreSqlDriver,
        dbName: process.env.POSTGRES_DB_NAME ?? 'gym_manager',
        password: process.env.POSTGRES_PASSWORD ?? 'postgres',
        port: Number(process.env.POSTGRES_PORT ?? 5432),
        host: process.env.POSTGRES_HOST ?? 'localhost',
        user: process.env.POSTGRES_USER ?? 'postgres',
        timezone: process.env.POSTGRES_TIMEZONE ?? 'UTC',
    });
exports.default = mikroOrmConfig;
//# sourceMappingURL=mikro-orm.config.js.map