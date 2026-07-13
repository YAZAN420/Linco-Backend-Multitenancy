import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import redisConfig from 'src/common/config/redis.config';
import { RedisCacheAdapter } from './redis-cache.adapter';
import { CachePort } from './cache.port';
import { CacheBootstrapService } from './cache-bootstrap.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
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
