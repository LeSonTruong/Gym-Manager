import { DriverException } from '@mikro-orm/core';
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class MikroOrmExceptionFilter<T extends DriverException> implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost): void;
}
