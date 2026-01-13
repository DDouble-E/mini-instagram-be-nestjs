import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_REFRESH_SECRET_KEY'),
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const authHeader = req.headers['authorization'];

        if (!authHeader) throw new ForbiddenException('Refresh token missing');

        const refreshToken = authHeader.replace('Bearer', '').trim();
        return {
            userId: payload.sub,
            refreshToken, // Trả về payload giải mã + chuỗi token gốc để so sánh
        };
    }
}
