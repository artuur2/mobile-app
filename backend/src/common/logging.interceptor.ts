import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface RequestWithContext {
  method: string;
  originalUrl: string;
  requestId?: string;
  user?: { userId?: string };
}

interface ResponseWithContext {
  statusCode: number;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();
    const http = context.switchToHttp();
    const req = http.getRequest<RequestWithContext>();
    const res = http.getResponse<ResponseWithContext>();

    return next.handle().pipe(
      tap(() => {
        const payload = {
          requestId: req.requestId,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode,
          durationMs: Date.now() - now,
          userId: req.user?.userId ?? null,
        };

        this.logger.log(JSON.stringify(payload));
      }),
    );
  }
}
