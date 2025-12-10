import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, query, body } = request;
    const startTime = Date.now();

    // Логируем входящий запрос
    const requestInfo = {
      method,
      url,
      query: Object.keys(query).length > 0 ? query : undefined,
      body: this.sanitizeBody(body),
    };

    this.loggingService.log(
      `Incoming request: ${method} ${url}${requestInfo.query ? ` | Query: ${JSON.stringify(requestInfo.query)}` : ''}${requestInfo.body ? ` | Body: ${JSON.stringify(requestInfo.body)}` : ''}`,
      'LoggingInterceptor',
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - startTime;
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;

          this.loggingService.log(
            `${method} ${url} - ${statusCode} - ${responseTime}ms`,
            'LoggingInterceptor',
          );
        },
        error: (error) => {
          const responseTime = Date.now() - startTime;
          this.loggingService.error(
            `${method} ${url} - Error after ${responseTime}ms`,
            error.stack,
            'LoggingInterceptor',
          );
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return undefined;

    // Убираем пароли из логов
    const sanitized = { ...body };
    if (sanitized.password) {
      sanitized.password = '***';
    }
    if (sanitized.oldPassword) {
      sanitized.oldPassword = '***';
    }
    if (sanitized.newPassword) {
      sanitized.newPassword = '***';
    }
    return sanitized;
  }
}
