import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Tương tự như cấu hình cổng, gọi là một bước kiểm tra giống với NodeJS
            ignoreExpiration: false,
            secretOrKey:  "NestaVietVNUK"
        });
    }
    // Hàm validate này CHỈ ĐƯỢC CHẠY khi Token hợp lệ và chưa hết hạn.
    // NestJS sẽ tự động giải mã Payload và truyền vào biến `payload`.
    async validate(payload: any) {
        return {
            accountId: payload.sub,
            email: payload.email,
            hasTenantProfile: payload.hasTenantProfile,
            hasOwnerProfile: payload.hasOwnerProfile
        }
    }
}