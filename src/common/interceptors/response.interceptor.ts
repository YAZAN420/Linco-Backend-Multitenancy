import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { I18nContext } from 'nestjs-i18n';
import { ApiResponse } from '../interfaces/api-response.interface';
import { ControllerResponse } from '../interfaces/controller-response.interface';
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

    const i18n = I18nContext.current(context);

    const translateKey = (key?: string): string => {
      const defaultKey = 'messages.REQUEST_SUCCESSFUL';
      const targetKey = key || defaultKey;

      if (i18n && typeof targetKey === 'string') {
        return i18n.t(targetKey);
      }

      return key || 'Request successful';
    };

    return next.handle().pipe(
      map((response): ApiResponse<T> => {
        if (response === null || response === undefined) {
          return {
            success: true,
            message: translateKey(),
            data: response,
            timestamp: new Date().toISOString(),
          };
        }

        if (typeof response !== 'object') {
          return {
            success: true,
            message: translateKey(),
            data: response,
            timestamp: new Date().toISOString(),
          };
        }

        const typedResponse = response;
        const data =
          'data' in typedResponse
            ? typedResponse.data
            : (response as unknown as T);

        const customMessageKey =
          'message' in typedResponse &&
          typeof typedResponse.message === 'string'
            ? typedResponse.message
            : undefined;

        const apiResponse: ApiResponse<T> = {
          success: true,
          message: translateKey(customMessageKey),
          data,
          timestamp: new Date().toISOString(),
        };

        if ('meta' in typedResponse && typedResponse.meta) {
          apiResponse.meta = typedResponse.meta;
        }

        return apiResponse;
      }),
    );
  }
}
