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
import type { TranslatableMessage } from '../interfaces/translatable-message.interface';

function isTranslatableMessage(value: unknown): value is TranslatableMessage {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  return typeof (value as Record<string, unknown>).key === 'string';
}

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
    let messageKey: unknown = 'errors.INTERNAL_SERVER_ERROR';
    let translationArgs: Record<string, unknown> | undefined;
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
        const responseBody = exceptionResponse as Record<string, unknown>;
        messageKey = responseBody.message;

        if (
          typeof responseBody.args === 'object' &&
          responseBody.args !== null &&
          !Array.isArray(responseBody.args)
        ) {
          translationArgs = responseBody.args as Record<string, unknown>;
        }
      } else if (typeof exceptionResponse === 'string') {
        messageKey = exceptionResponse;
      } else {
        messageKey = exception.message;
      }
    } else if (exception instanceof DomainException) {
      httpStatus = HttpStatus.BAD_REQUEST;
      errorType = exception.name;
      messageKey = exception.message;
      translationArgs = exception.translationArgs;
    } else if (exception instanceof Error) {
      this.logger.error(
        `[${method}] ${url} - ${exception.message}`,
        exception.stack,
      );
    }

    const translateKey = (message: unknown, args = translationArgs): string => {
      if (isTranslatableMessage(message)) {
        return translateKey(message.key, message.args);
      }

      if (typeof message !== 'string') {
        return String(message);
      }

      if (i18n) {
        return i18n.t(message, args === undefined ? undefined : { args });
      }

      return message;
    };

    const translatedMessage = Array.isArray(messageKey)
      ? messageKey.map((message) => translateKey(message))
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
