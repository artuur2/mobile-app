import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface RequestWithId extends Request {
  requestId?: string;
}

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<RequestWithId>();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    const message = this.extractMessage(exceptionResponse);
    const error =
      exception instanceof HttpException
        ? HttpStatus[statusCode] ?? 'HttpException'
        : 'InternalServerError';

    const payload = {
      requestId: request.requestId ?? null,
      statusCode,
      error,
      message,
      method: request.method,
      path: request.originalUrl,
      timestamp: new Date().toISOString(),
    };

    if (statusCode >= 500) {
      this.logger.error(JSON.stringify(payload));
    } else {
      this.logger.warn(JSON.stringify(payload));
    }

    response.status(statusCode).json(payload);
  }

  private extractMessage(exceptionResponse: unknown): string | string[] {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const { message } = exceptionResponse as { message?: string | string[] };
      return message ?? 'Unexpected error';
    }

    return 'Unexpected error';
  }
}
