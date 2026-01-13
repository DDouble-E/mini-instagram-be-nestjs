import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
    private readonly logger = new Logger('JwtAccessGuard');

    private readonly whitelist = [
        '/auth/login',
        '/auth/sign-up',
        '/auth/forget-password',
        '/auth/reset-password',
        '/auth/refresh-token',

        '/',
    ];

    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );


        if (isPublic) return true;

        // 2. Kiểm tra nếu URL nằm trong whitelist
        const request = context.switchToHttp().getRequest();
        // Dùng .includes() hoặc kiểm tra chính xác tùy thuộc vào cách bạn cấu hình router

        if (this.whitelist.includes(request.url)) {
            return true;
        }

        return super.canActivate(context);
    }
}
