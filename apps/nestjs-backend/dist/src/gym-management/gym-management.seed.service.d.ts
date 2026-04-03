import { MikroORM } from '@mikro-orm/core';
import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class GymManagementSeedService implements OnModuleInit {
    private readonly orm;
    private readonly configService;
    private readonly logger;
    constructor(orm: MikroORM, configService: ConfigService);
    onModuleInit(): Promise<void>;
    private seedIfEmpty;
}
