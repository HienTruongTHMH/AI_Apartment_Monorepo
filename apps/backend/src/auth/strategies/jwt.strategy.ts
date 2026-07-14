import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

    constructor(private configService: ConfigService) {

        const secret = configService.get<string>("JWT_SECRET");

        if (!secret) {
            throw new UnauthorizedException('JWT_SECRET is not defined');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Tương tự như cấu hình cổng, gọi là một bước kiểm tra giống với NodeJS
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }
    // Hàm validate này CHỈ ĐƯỢC CHẠY khi Token hợp lệ và chưa hết hạn.
    // NestJS sẽ tự động giải mã Payload và truyền vào biến `payload`.
    async validate(payload: any) {
        return {
            accountId: payload.sub,
            email: payload.email,
            fullName: payload.fullName,
            isActive: payload.isActive,
            hasTenantProfile: payload.hasTenantProfile,
            hasOwnerProfile: payload.hasOwnerProfile,
            ownerProfileId: payload.ownerProfileId || null,
        }
    }
}