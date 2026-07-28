import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'nestjs-pino';
import { I18nContext } from 'nestjs-i18n';
import { DomainException } from '../exceptions/domain.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const i18n = I18nContext.current(host);

    const method = request.method;
    const url = request.originalUrl;

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let messageKey: string | string[] = 'errors.INTERNAL_SERVER_ERROR';
    let errorType = 'InternalServerError';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      errorType = exception.name;
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        messageKey = (exceptionResponse as Record<string, unknown>).message as
          string | string[];
      } else if (typeof exceptionResponse === 'string') {
        messageKey = exceptionResponse;
      } else {
        messageKey = exception.message;
      }
    } else if (exception instanceof DomainException) {
      httpStatus = HttpStatus.BAD_REQUEST;
      errorType = exception.name;
      messageKey = exception.message;
    } else if (exception instanceof Error) {
      this.logger.error(
        `[${method}] ${url} - ${exception.message}`,
        exception.stack,
      );
    }

    const translateKey = (key: string): string => {
      if (i18n && typeof key === 'string') {
        return i18n.t(key);
      }
      return key;
    };

    const translatedMessage = Array.isArray(messageKey)
      ? messageKey.map((key) => translateKey(key))
      : translateKey(messageKey);

    response.status(httpStatus).json({
      success: false,
      statusCode: httpStatus,
      error: errorType,
      message: translatedMessage,
      timestamp: new Date().toISOString(),
      path: url,
    });
  }
}
