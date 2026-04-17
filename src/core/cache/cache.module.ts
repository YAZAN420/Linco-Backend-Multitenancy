import { Global, Module } from '@nestjs/common';
import { RedisCacheAdapter } from './redis-cache.adapter';
import { CachePort } from './cache.port';

@Global()
@Module({
  providers: [
    {
      provide: CachePort,
      useClass: RedisCacheAdapter,
    },
  ],
  exports: [CachePort],
})
export class CacheModule {}
