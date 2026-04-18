import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CachePort } from './cache.port';

@Injectable()
export class CacheBootstrapService implements OnApplicationBootstrap {
  constructor(private readonly cachePort: CachePort) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.cachePort.deleteByPattern('GET:*');
      console.log('✅ Cache cleared on bootstrap');
    } catch (err) {
      console.error('❌ Failed to clear cache on bootstrap', err);
    }
  }
}
