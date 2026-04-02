import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';
import { ConfigKey } from '../config/config-key.enum';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly memoryStore = new Map<string, { expiresAt?: number; value: string }>();
  private readonly memorySubscribers = new Map<string, Set<(message: string) => void>>();
  private publisher: Redis | undefined;
  private subscriber: Redis | undefined;
  private useInMemoryRedis = false;

  constructor(private readonly configService: ConfigService) {

  }

  onModuleInit(): void {
    if ((this.configService.get<string>(ConfigKey.REDIS_HOST) ?? '').toLowerCase() === 'memory') {
      this.useInMemoryRedis = true;
      return;
    }

    const redisConfig: RedisOptions = {
      host: this.configService.get(ConfigKey.REDIS_HOST),
      port: this.configService.get<number>(ConfigKey.REDIS_PORT),
      password: this.configService.get<string>(ConfigKey.REDIS_PASSWORD),
    };

    if (!redisConfig.host || !redisConfig.port) {
      throw new Error('Redis configuration is incomplete');
    }

    this.publisher = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);
  }

  async publish<T>(channel: string, message: T): Promise<void> {
    const serialized = JSON.stringify(message);

    if (this.useInMemoryRedis) {
      for (const callback of this.memorySubscribers.get(channel) ?? []) {
        callback(serialized);
      }

      return;
    }

    if (!this.publisher) {
      throw new Error('Redis publisher is not initialized');
    }

    await this.publisher.publish(channel, serialized);
  }

  async setValue(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.useInMemoryRedis) {
      this.memoryStore.set(key, {
        value,
        expiresAt: ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : undefined,
      });
      return;
    }

    const client = this.getPublisher();

    if (ttlSeconds && ttlSeconds > 0) {
      await client.set(key, value, 'EX', ttlSeconds);
      return;
    }

    await client.set(key, value);
  }

  async getValue(key: string): Promise<string | undefined> {
    if (this.useInMemoryRedis) {
      const entry = this.memoryStore.get(key);

      if (!entry) {
        return undefined;
      }

      if (entry.expiresAt && entry.expiresAt <= Date.now()) {
        this.memoryStore.delete(key);
        return undefined;
      }

      return entry.value;
    }

    return (await this.getPublisher().get(key)) ?? undefined;
  }

  async deleteKey(key: string): Promise<void> {
    if (this.useInMemoryRedis) {
      this.memoryStore.delete(key);
      return;
    }

    await this.getPublisher().del(key);
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.setValue(key, JSON.stringify(value), ttlSeconds);
  }

  async getJson(key: string): Promise<unknown | undefined> {
    const value = await this.getValue(key);

    if (!value) {
      return undefined;
    }

    return JSON.parse(value) as unknown;
  }

  async subscribe(
    channel: string,
    callback: (message: unknown) => void,
  ): Promise<void> {
    if (this.useInMemoryRedis) {
      const callbacks = this.memorySubscribers.get(channel) ?? new Set<(message: string) => void>();

      callbacks.add((message) => {
        try {
          callback(JSON.parse(message) as unknown);
        } catch {
          callback(message);
        }
      });
      this.memorySubscribers.set(channel, callbacks);
      return;
    }

    if (!this.subscriber) {
      throw new Error('Redis subscriber is not initialized');
    }

    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, msg) => {
      if (ch === channel) {
        try {
          callback(JSON.parse(msg) as unknown);
        } catch (error) {
          console.error('Failed to parse message:', error);
          callback(msg);
        }
      }
    });
  }

  async unsubscribe(channel: string): Promise<void> {
    if (this.useInMemoryRedis) {
      this.memorySubscribers.delete(channel);
      return;
    }

    if (!this.subscriber) {
      throw new Error('Redis subscriber is not initialized');
    }

    await this.subscriber.unsubscribe(channel);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.useInMemoryRedis) {
      this.memoryStore.clear();
      this.memorySubscribers.clear();
      return;
    }

    await this.publisher?.quit();
    await this.subscriber?.quit();
  }

  private getPublisher(): Redis {
    if (!this.publisher) {
      throw new Error('Redis publisher is not initialized');
    }

    return this.publisher;
  }
}
