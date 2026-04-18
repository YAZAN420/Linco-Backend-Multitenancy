import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CachePort } from './cache.port';
import { Logger } from 'nestjs-pino/Logger';

@Injectable()
export class CacheBootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly cachePort: CachePort,
    private readonly logger: Logger,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.cachePort.deleteByPattern('GET:*');
      this.logger.log('✅ Cache cleared on bootstrap');
    } catch (err) {
      this.logger.error('❌ Failed to clear cache on bootstrap', err);
    }
  }
}
