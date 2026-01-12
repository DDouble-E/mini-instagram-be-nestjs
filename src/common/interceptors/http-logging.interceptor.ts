import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs";

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    private logger = new Logger('HTTP');

    intercept(ctx: ExecutionContext, next: CallHandler) {
        const req = ctx.switchToHttp().getRequest();
        const { method, url } = req;
        const start = Date.now();

        return next.handle().pipe(
            tap(() => {
                this.logger.log(
                    `${method} ${url} ${Date.now() - start}ms`,
                );
            }),
        );
    }
}
