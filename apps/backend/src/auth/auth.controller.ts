import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
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
        const freshUser = await this.authService.getFreshProfile(req.user.accountId);
        return {
            message: 'Chào mừng bạn có quyền xem profile',
            user: freshUser
        }
    }
}
