"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const cookieParser = require("cookie-parser");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const mikro_orm_exception_filter_1 = require("./common/filters/mikro-orm-exception/mikro-orm-exception.filter");
const logger_service_1 = require("./common/logger/logger.service");
const config_key_enum_1 = require("./config/config-key.enum");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const configService = app.get(config_1.ConfigService);
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: configService.getOrThrow(config_key_enum_1.ConfigKey.FRONTEND_HOST),
        credentials: true,
    });
    app.useLogger(new logger_service_1.Logger());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new mikro_orm_exception_filter_1.MikroOrmExceptionFilter());
    if (configService.get(config_key_enum_1.ConfigKey.ENABLE_SWAGGER)) {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('Gym Manager API')
            .setDescription('Demo API surface for the Gym Management System MVP.')
            .setVersion('1.0')
            .build();
        const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/docs', app, documentFactory);
    }
    await app.listen(configService.get(config_key_enum_1.ConfigKey.PORT) ?? 4000);
    if (configService.get(config_key_enum_1.ConfigKey.ENABLE_SWAGGER)) {
        const logger = new common_1.Logger('bootstrap', { timestamp: true });
        logger.log(`Swagger is running on: ${await app.getUrl()}/api/docs`);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map