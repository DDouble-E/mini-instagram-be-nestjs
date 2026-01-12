import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface ResponseFormat<T> {
  data: T;
  message?: string;
  code?: number; // custom status code
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, any> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((res: ResponseFormat<T> | T) => {
        let data: T;
        let message = 'Success';
        let code = 200;

        // Nếu res là object có data/message/statusCode
        if (res && typeof res === 'object' && 'data' in res) {
          data = (res as ResponseFormat<T>).data;
          message = (res as ResponseFormat<T>).message || message;
          code = (res as ResponseFormat<T>).code || code;
        } else {
          data = res as T;
        }

        // Set status code custom
        response.status(code);

        return {
          success: true,
          code,
          message,
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}