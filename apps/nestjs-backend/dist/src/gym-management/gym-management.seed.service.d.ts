import { MikroORM } from '@mikro-orm/core';
import { OnModuleInit } from '@nestjs/common';
export declare class GymManagementSeedService implements OnModuleInit {
    private readonly orm;
    private readonly logger;
    constructor(orm: MikroORM);
    onModuleInit(): Promise<void>;
    private seedIfEmpty;
}
