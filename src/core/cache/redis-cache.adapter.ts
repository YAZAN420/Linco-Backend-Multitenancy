import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import type { ConfigType } from '@nestjs/config';
import redisConfig from 'src/config/redis.config';
import { CachePort } from './cache.port';

@Injectable()
export class RedisCacheAdapter
  implements CachePort, OnModuleInit, OnModuleDestroy
{
  private redisClient!: Redis;

  constructor(
    @Inject(redisConfig.KEY)
    private readonly redisConfiguration: ConfigType<typeof redisConfig>,
  ) {}

  onModuleInit() {
    const rejectUnauthorized = Boolean(
      this.redisConfiguration.tlsRejectUnauthorized,
    );

    this.redisClient = new Redis({
      host: this.redisConfiguration.host,
      port: this.redisConfiguration.port,
      password: this.redisConfiguration.password,
      tls: this.redisConfiguration.tlsEnabled
        ? {
            rejectUnauthorized,
          }
        : undefined,
    });
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async set<T>(
    key: string,
    value: T,
    ttlSeconds: number = 3600,
  ): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.unlink(key);
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const stream = this.redisClient.scanStream({
      match: pattern,
      count: 100,
    });

    for await (const chunk of stream) {
      const keys = chunk as string[];

      if (keys.length > 0) {
        await this.redisClient.unlink(...keys);
      }
    }
  }
}
