import { Global, Module } from '@nestjs/common';
import { RedisCacheAdapter } from './redis-cache.adapter';
import { CachePort } from './cache.port';
import { CacheBootstrapService } from './cache-bootstrap.service';

@Global()
@Module({
  providers: [
    {
      provide: CachePort,
      useClass: RedisCacheAdapter,
    },
    CacheBootstrapService,
  ],
  exports: [CachePort],
})
export class CacheModule {}
