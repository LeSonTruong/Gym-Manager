import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqliteDriver } from '@mikro-orm/sqlite';
import 'dotenv/config';
declare const mikroOrmConfig: import("@mikro-orm/core").Options<SqliteDriver, import("@mikro-orm/postgresql").EntityManager<SqliteDriver> & import("@mikro-orm/core").EntityManager<import("@mikro-orm/core").IDatabaseDriver<import("@mikro-orm/core").Connection>>> | import("@mikro-orm/core").Options<PostgreSqlDriver, import("@mikro-orm/postgresql").EntityManager<PostgreSqlDriver> & import("@mikro-orm/core").EntityManager<import("@mikro-orm/core").IDatabaseDriver<import("@mikro-orm/core").Connection>>>;
export default mikroOrmConfig;
