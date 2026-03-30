"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
const config_key_enum_1 = require("../config/config-key.enum");
let RedisService = class RedisService {
    configService;
    publisher;
    subscriber;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const redisConfig = {
            host: this.configService.get(config_key_enum_1.ConfigKey.REDIS_HOST),
            port: this.configService.get(config_key_enum_1.ConfigKey.REDIS_PORT),
            password: this.configService.get(config_key_enum_1.ConfigKey.REDIS_PASSWORD),
        };
        if (!redisConfig.host || !redisConfig.port) {
            throw new Error('Redis configuration is incomplete');
        }
        this.publisher = new ioredis_1.default(redisConfig);
        this.subscriber = new ioredis_1.default(redisConfig);
    }
    async publish(channel, message) {
        const serialized = JSON.stringify(message);
        if (!this.publisher) {
            throw new Error('Redis publisher is not initialized');
        }
        await this.publisher.publish(channel, serialized);
    }
    async subscribe(channel, callback) {
        if (!this.subscriber) {
            throw new Error('Redis subscriber is not initialized');
        }
        await this.subscriber.subscribe(channel);
        this.subscriber.on('message', (ch, msg) => {
            if (ch === channel) {
                try {
                    const parsed = JSON.parse(msg);
                    callback(parsed);
                }
                catch (error) {
                    console.error('Failed to parse message:', error);
                    callback(msg);
                }
            }
        });
    }
    async unsubscribe(channel) {
        if (!this.subscriber) {
            throw new Error('Redis subscriber is not initialized');
        }
        await this.subscriber.unsubscribe(channel);
    }
    async onModuleDestroy() {
        await this.publisher?.quit();
        await this.subscriber?.quit();
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map