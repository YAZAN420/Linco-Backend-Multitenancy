import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ControllerResponse } from '../interfaces/controller-response.interface';
import { Reflector } from '@nestjs/core';
import { SkipResponseWrap } from '../decorators/skip-response-wrap.decorator';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  ControllerResponse<T>,
  ApiResponse<T> | ControllerResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<ControllerResponse<T>>,
  ) {
    const skip = this.reflector.getAllAndOverride<boolean>(SkipResponseWrap, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) {
      return next.handle();
    }
    return next.handle().pipe(
      map((response): ApiResponse<T> => {
        const apiResponse: ApiResponse<T> = {
          success: true,
          message: response.message ?? 'Request successful',
          data: response.data,
          timestamp: new Date().toISOString(),
        };

        if (response.meta) {
          apiResponse.meta = response.meta;
        }

        return apiResponse;
      }),
    );
  }
}
