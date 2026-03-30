"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_key_enum_1 = require("./config-key.enum");
function readNumber(value) {
    if (!value) {
        return undefined;
    }
    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? undefined : parsedValue;
}
const appConfig = () => ({
    [config_key_enum_1.ConfigKey.NODE_ENV]: process.env.NODE_ENV ?? 'development',
    [config_key_enum_1.ConfigKey.FRONTEND_HOST]: process.env.FRONTEND_HOST ?? 'http://localhost:3000',
    [config_key_enum_1.ConfigKey.PORT]: readNumber(process.env.PORT) ?? 4000,
    [config_key_enum_1.ConfigKey.ENABLE_SWAGGER]: process.env.ENABLE_SWAGGER === undefined ? true : process.env.ENABLE_SWAGGER === 'true',
    [config_key_enum_1.ConfigKey.POSTGRES_TIMEZONE]: process.env.POSTGRES_TIMEZONE ?? 'UTC',
    [config_key_enum_1.ConfigKey.POSTGRES_DB_NAME]: process.env.POSTGRES_DB_NAME ?? 'gym_manager',
    [config_key_enum_1.ConfigKey.POSTGRES_PASSWORD]: process.env.POSTGRES_PASSWORD ?? 'postgres',
    [config_key_enum_1.ConfigKey.POSTGRES_PORT]: readNumber(process.env.POSTGRES_PORT) ?? 5432,
    [config_key_enum_1.ConfigKey.POSTGRES_HOST]: process.env.POSTGRES_HOST ?? 'localhost',
    [config_key_enum_1.ConfigKey.POSTGRES_USER]: process.env.POSTGRES_USER ?? 'postgres',
    [config_key_enum_1.ConfigKey.POSTGRES_DEBUG_MODE]: process.env.POSTGRES_DEBUG_MODE === undefined ? false : process.env.POSTGRES_DEBUG_MODE === 'true',
    [config_key_enum_1.ConfigKey.REDIS_HOST]: process.env.REDIS_HOST ?? 'localhost',
    [config_key_enum_1.ConfigKey.REDIS_PORT]: readNumber(process.env.REDIS_PORT) ?? 6379,
    [config_key_enum_1.ConfigKey.REDIS_PASSWORD]: process.env.REDIS_PASSWORD,
    [config_key_enum_1.ConfigKey.MAILDEV_WEB_PORT]: readNumber(process.env.MAILDEV_WEB_PORT) ?? 1080,
    [config_key_enum_1.ConfigKey.MAIL_HOST]: process.env.MAIL_HOST,
    [config_key_enum_1.ConfigKey.MAIL_PORT]: readNumber(process.env.MAIL_PORT) ?? 587,
    [config_key_enum_1.ConfigKey.MAIL_USER]: process.env.MAIL_USER,
    [config_key_enum_1.ConfigKey.MAIL_PASS]: process.env.MAIL_PASS,
});
exports.default = appConfig;
//# sourceMappingURL=app.config.js.map