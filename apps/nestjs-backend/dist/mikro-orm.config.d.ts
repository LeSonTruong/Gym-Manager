import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import 'dotenv/config';
declare const mikroOrmConfig: import("@mikro-orm/core").Options<PostgreSqlDriver, import("@mikro-orm/postgresql").EntityManager<PostgreSqlDriver> & import("@mikro-orm/core").EntityManager<import("@mikro-orm/postgresql").IDatabaseDriver<import("@mikro-orm/postgresql").Connection>>>;
export default mikroOrmConfig;
