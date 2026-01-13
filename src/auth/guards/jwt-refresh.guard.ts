import { Logger, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
    private readonly logger = new Logger('JwtRefreshGuard');
    handleRequest(err, user, info) {
        if (info) {
            this.logger.log('--- CHI TIẾT LỖI REFRESH GUARD ---');
            this.logger.log(info.message); // Nó sẽ hiện: "jwt expired" hoặc "invalid signature" hoặc "No auth token"
        }
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
