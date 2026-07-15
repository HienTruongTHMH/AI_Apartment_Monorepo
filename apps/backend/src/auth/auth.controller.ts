import { Controller, Post, Body, Req, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return await this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('become-owner')
    async createOwnerProfile(@Req() req) {
        return this.authService.createOwnerProfile(req.user.accountId)
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req) {
        const account = await this.authService.getFreshAccount(req.user.accountId);
        if (!account) {
            throw new UnauthorizedException("Tài khoản không tồn tại hoặc đã bị khóa");
        }
        return {
            message: 'Chào mừng bạn có quyền xem profile',
            user: {
                accountId: account.id,
                email: account.email,
                fullName: account.fullName,
                isActive: account.isActive,
                hasTenantProfile: !!account.tenantProfile,
                hasOwnerProfile: !!account.ownerProfile,
                ownerProfileId: account.ownerProfile?.id || null,
                isTenancyActivated: account.tenantProfile ? account.tenantProfile.isActive : false,
            }
        }
    }
}
