import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import mikroOrmConfig from '../mikro-orm.config';
import { CommonModule } from './common/common.module';
import appConfig from './config/app.config';
import validationSchema from './config/validation.schema';
import { GymManagementModule } from './gym-management/gym-management.module';
import { HealthModule } from './health/health.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema,
      load: [appConfig],
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default-throttler',
          ttl: 60 * 1000,
          limit: 60,
        },
      ],
    }),
    CommonModule,
    RedisModule,
    GymManagementModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
