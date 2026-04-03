import * as Joi from 'joi';
import { ConfigKey } from './config-key.enum';

const validationSchemaMap: Record<ConfigKey, Joi.Schema> = {
  [ConfigKey.NODE_ENV]: Joi.string().valid('development', 'staging', 'production').default('development'),
  [ConfigKey.FRONTEND_HOST]: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .default('http://localhost:3000'),
  [ConfigKey.PORT]: Joi.number().min(0).max(65_535).default(4000),
  [ConfigKey.ENABLE_SWAGGER]: Joi.boolean().optional().default(true),
  [ConfigKey.ENABLE_DEMO_SEED]: Joi.boolean().optional(),

  [ConfigKey.POSTGRES_TIMEZONE]: Joi.string().default('UTC'),
  [ConfigKey.POSTGRES_DB_NAME]: Joi.string().default('gym_manager'),
  [ConfigKey.POSTGRES_PASSWORD]: Joi.string().default('postgres'),
  [ConfigKey.POSTGRES_PORT]: Joi.number().min(0).max(65_535).default(5432),
  [ConfigKey.POSTGRES_USER]: Joi.string().default('postgres'),
  [ConfigKey.POSTGRES_HOST]: Joi.string().default('localhost'),
  [ConfigKey.POSTGRES_DEBUG_MODE]: Joi.boolean().optional().default(false),

  [ConfigKey.REDIS_HOST]: Joi.string().default('localhost'),
  [ConfigKey.REDIS_PORT]: Joi.number().min(0).max(65_535).default(6379),
  [ConfigKey.REDIS_PASSWORD]: Joi.string().optional().allow('', null),
};

export default Joi.object(validationSchemaMap);
