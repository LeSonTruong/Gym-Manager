import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly memoryStore;
    private readonly memorySubscribers;
    private publisher;
    private subscriber;
    private useInMemoryRedis;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    publish<T>(channel: string, message: T): Promise<void>;
    setValue(key: string, value: string, ttlSeconds?: number): Promise<void>;
    getValue(key: string): Promise<string | undefined>;
    deleteKey(key: string): Promise<void>;
    setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
    getJson<T>(key: string): Promise<T | undefined>;
    subscribe<T>(channel: string, callback: (message: T) => void): Promise<void>;
    unsubscribe(channel: string): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private getPublisher;
}
