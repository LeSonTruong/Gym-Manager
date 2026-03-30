"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const migrations_1 = require("@mikro-orm/migrations");
const postgresql_1 = require("@mikro-orm/postgresql");
require("dotenv/config");
const mikroOrmConfig = (0, postgresql_1.defineConfig)({
    entities: ['dist/**/entities/*.entity.js'],
    entitiesTs: ['src/**/entities/*.entity.ts'],
    migrations: {
        path: 'dist/src/migrations',
        pathTs: 'src/migrations',
    },
    driver: postgresql_1.PostgreSqlDriver,
    dbName: process.env.POSTGRES_DB_NAME ?? 'gym_manager',
    password: process.env.POSTGRES_PASSWORD ?? 'postgres',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    host: process.env.POSTGRES_HOST ?? 'localhost',
    user: process.env.POSTGRES_USER ?? 'postgres',
    debug: process.env.POSTGRES_DEBUG_MODE === 'true',
    timezone: process.env.POSTGRES_TIMEZONE ?? 'UTC',
    extensions: [migrations_1.Migrator],
});
exports.default = mikroOrmConfig;
//# sourceMappingURL=mikro-orm.config.js.map