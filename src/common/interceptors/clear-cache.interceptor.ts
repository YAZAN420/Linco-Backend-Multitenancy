import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { CachePort } from 'src/core/cache/cache.port';
import { ClearCache } from '../decorators/clear-cache.decorator';
import { Logger } from 'nestjs-pino';

@Injectable()
export class ClearCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cachePort: CachePort,
    private readonly reflector: Reflector,
    private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const patterns = this.reflector.get(ClearCache, context.getHandler());

    if (!patterns) {
      return next.handle();
    }

    const patternsArray = Array.isArray(patterns) ? patterns : [patterns];

    return next.handle().pipe(
      tap(() => {
        patternsArray.forEach((pattern) => {
          this.cachePort.deleteByPattern(pattern).catch((err) => {
            const trace = err instanceof Error ? err.stack : undefined;
            this.logger.error(
              `Failed to clear cache for pattern: ${pattern}`,
              trace,
            );
          });
        });
      }),
    );
  }
}
