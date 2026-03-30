import {Logger, ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import {DocumentBuilder, OpenAPIObject, SwaggerModule} from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import {AppModule} from './app.module';
import {MikroOrmExceptionFilter} from './common/filters/mikro-orm-exception/mikro-orm-exception.filter';
import {Logger as LoggerService} from './common/logger/logger.service';
import {ConfigKey} from './config/config-key.enum';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);

  app.use(helmet());

  app.enableCors({
    origin: configService.getOrThrow<string>(ConfigKey.FRONTEND_HOST),
    credentials: true,
  });

  app.useLogger(new LoggerService());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new MikroOrmExceptionFilter());

  if (configService.get<boolean>(ConfigKey.ENABLE_SWAGGER)) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Next Nest Turbo Template API')
      .setDescription('Backend API for the Next.js + NestJS + Turborepo starter template.')
      .setVersion('1.0')
      .build();
    const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, documentFactory);
  }

  await app.listen(configService.get<number>(ConfigKey.PORT) ?? 4000);

  if (configService.get<boolean>(ConfigKey.ENABLE_SWAGGER)) {
    const logger = new Logger('bootstrap', {timestamp: true});
    logger.log(`Swagger is running on: ${await app.getUrl()}/api/docs`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
bootstrap();
