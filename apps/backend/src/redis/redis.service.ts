import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientContext, Redis } from 'ioredis'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private readonly client: Redis;
    constructor(private readonly configService: ConfigService) {
        const redisUrl = this.configService.get<string>('REDIS_URL', String(process.env.REDIS_URL))
        this.client = new Redis(redisUrl);
    }

    async onModuleInit() {
        // Check connection
        this.client.on('connect', () => {
            this.logger.log('Connected to Redis');
        })

        this.client.on('error', (err) => {
            this.logger.error(err);
        })

        // Check container is right ? 
        const pong = await this.client.ping();
        this.logger.log(`PONG to redis: ${pong}`);
    }

    onModuleDestroy() {
        this.client.disconnect();
        this.logger.log('🔌 Redis disconnected — service shutting down');
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async set(key: string, value: string, ttlSeconds: number): Promise<void> {
        await this.client.set(key, value, 'EX', ttlSeconds);

    }

}
