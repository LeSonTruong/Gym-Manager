"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const config_key_enum_1 = require("./config-key.enum");
const validationSchemaMap = {
    [config_key_enum_1.ConfigKey.NODE_ENV]: Joi.string().valid('development', 'staging', 'production').default('development'),
    [config_key_enum_1.ConfigKey.FRONTEND_HOST]: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .default('http://localhost:3000'),
    [config_key_enum_1.ConfigKey.PORT]: Joi.number().min(0).max(65_535).default(4000),
    [config_key_enum_1.ConfigKey.ENABLE_SWAGGER]: Joi.boolean().optional().default(true),
    [config_key_enum_1.ConfigKey.POSTGRES_TIMEZONE]: Joi.string().default('UTC'),
    [config_key_enum_1.ConfigKey.POSTGRES_DB_NAME]: Joi.string().default('gym_manager'),
    [config_key_enum_1.ConfigKey.POSTGRES_PASSWORD]: Joi.string().default('postgres'),
    [config_key_enum_1.ConfigKey.POSTGRES_PORT]: Joi.number().min(0).max(65_535).default(5432),
    [config_key_enum_1.ConfigKey.POSTGRES_USER]: Joi.string().default('postgres'),
    [config_key_enum_1.ConfigKey.POSTGRES_HOST]: Joi.string().default('localhost'),
    [config_key_enum_1.ConfigKey.POSTGRES_DEBUG_MODE]: Joi.boolean().optional().default(false),
    [config_key_enum_1.ConfigKey.REDIS_HOST]: Joi.string().default('localhost'),
    [config_key_enum_1.ConfigKey.REDIS_PORT]: Joi.number().min(0).max(65_535).default(6379),
    [config_key_enum_1.ConfigKey.REDIS_PASSWORD]: Joi.string().optional().allow('', null),
    [config_key_enum_1.ConfigKey.MAILDEV_WEB_PORT]: Joi.number().min(0).max(65_535).default(1080).when(config_key_enum_1.ConfigKey.NODE_ENV, {
        is: 'development',
        then: Joi.optional(),
        otherwise: Joi.forbidden(),
    }),
    [config_key_enum_1.ConfigKey.MAIL_HOST]: Joi.string().optional(),
    [config_key_enum_1.ConfigKey.MAIL_PORT]: Joi.number().min(0).max(65_535).default(587).optional(),
    [config_key_enum_1.ConfigKey.MAIL_USER]: Joi.string().optional(),
    [config_key_enum_1.ConfigKey.MAIL_PASS]: Joi.string().optional(),
};
exports.default = Joi.object(validationSchemaMap);
//# sourceMappingURL=validation.schema.js.map