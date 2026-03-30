import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from './logger.service';
export declare class LoggerMiddleware implements NestMiddleware {
    private readonly logger;
    constructor(logger: Logger);
    use(req: Request, response: Response, next: () => void): void;
}
