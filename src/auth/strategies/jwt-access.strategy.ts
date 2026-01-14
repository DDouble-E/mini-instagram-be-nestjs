import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_ACCESS_SECRET_KEY || 'default',
            passReqToCallback: true,
        });
    }

    validate(req: Request, payload: any) {
        const authHeader = req.headers['authorization'];

        if (!authHeader) throw new ForbiddenException('Access token missing');

        const accessToken = authHeader.replace('Bearer', '').trim();
        return {
            userId: payload.sub,
            exp: payload.exp,
            accessToken
        };
    }
}
