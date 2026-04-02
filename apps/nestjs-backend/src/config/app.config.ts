import {ConfigKey} from './config-key.enum';

function readNumber(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isNaN(parsedValue) ? undefined : parsedValue;
}

const appConfig = (): Record<ConfigKey, unknown> => ({
  [ConfigKey.NODE_ENV]: process.env.NODE_ENV ?? 'development',
  [ConfigKey.FRONTEND_HOST]: process.env.FRONTEND_HOST ?? 'http://localhost:3000',
  [ConfigKey.PORT]: readNumber(process.env.PORT) ?? 4000,
  [ConfigKey.ENABLE_SWAGGER]:
    process.env.ENABLE_SWAGGER === undefined ? true : process.env.ENABLE_SWAGGER === 'true',

  [ConfigKey.POSTGRES_TIMEZONE]: process.env.POSTGRES_TIMEZONE ?? 'UTC',
  [ConfigKey.POSTGRES_DB_NAME]: process.env.POSTGRES_DB_NAME ?? 'gym_manager',
  [ConfigKey.POSTGRES_PASSWORD]: process.env.POSTGRES_PASSWORD ?? 'postgres',
  [ConfigKey.POSTGRES_PORT]: readNumber(process.env.POSTGRES_PORT) ?? 5432,
  [ConfigKey.POSTGRES_HOST]: process.env.POSTGRES_HOST ?? 'localhost',
  [ConfigKey.POSTGRES_USER]: process.env.POSTGRES_USER ?? 'postgres',
  [ConfigKey.POSTGRES_DEBUG_MODE]:
    process.env.POSTGRES_DEBUG_MODE === undefined ? false : process.env.POSTGRES_DEBUG_MODE === 'true',

  [ConfigKey.REDIS_HOST]: process.env.REDIS_HOST ?? 'localhost',
  [ConfigKey.REDIS_PORT]: readNumber(process.env.REDIS_PORT) ?? 6379,
  [ConfigKey.REDIS_PASSWORD]: process.env.REDIS_PASSWORD,
});

export default appConfig;
