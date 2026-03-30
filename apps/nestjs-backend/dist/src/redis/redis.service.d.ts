import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private publisher;
    private subscriber;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    publish<T>(channel: string, message: T): Promise<void>;
    subscribe<T>(channel: string, callback: (message: T) => void): Promise<void>;
    unsubscribe(channel: string): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
