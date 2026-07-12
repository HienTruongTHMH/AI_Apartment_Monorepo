import { Injectable, ConflictException, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto, RegisterRoles } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        if (dto.password !== dto.passwordTwo) {
            throw new BadRequestException("Mật khẩu không trùng nhau")
        }

        const existingAccount = await this.prisma.account.findUnique({
            where: { email: dto.email }
        })

        if (existingAccount) {
            throw new ConflictException("Email này đã tồn tại !!!");
        }

        const saltRounds = 10; // Tránh việc trùng lập mật khẩu nếu hash chung 1 mk bằng cách thêm saltRounds
        const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

        const newAccount = await this.prisma.$transaction(async (tx) => {
            const account = await tx.account.create({
                data: {
                    email: dto.email,
                    hashedPassword: hashedPassword,
                    fullName: dto.fullName,
                    phone: dto.phone,
                    identityCard: dto.identityCard
                }
            })

            if (dto.roles === RegisterRoles.TENANT) {
                await tx.tenantProfile.create({
                    data: {
                        accountId: account.id,
                        fullName: dto.fullName
                    }
                })

                this.logger.log(`Tài khoản người thuê được tạo thành công, tài khoản id người thuê: ${account.id}`)
            }

            if (dto.roles === RegisterRoles.OWNER) {
                await tx.ownerProfile.create({
                    data: {
                        accountId: account.id,
                        fullName: dto.fullName
                    }
                })

                this.logger.log(`Tài khoản người thuê được tạo thành công, tài khoản id chủ thuê: ${account.id}`)

            }

            return account;
        })

        return {
            message: "Đăng ký tài khoản thành công !!!",
            accountId: newAccount.id,
            email: newAccount.email
        }
    }

    async login(dto: LoginDto) {
        const account = await this.prisma.account.findUnique({
            where: {
                email: dto.email
            },
            include: {
                tenantProfile: true,
                ownerProfile: true
            }
        }
        )

        if (!account) {
            throw new UnauthorizedException("Email hoặc mật khẩu không tồn tại")
        }

        const isPasswordMatch = await bcrypt.compare(dto.password, account.hashedPassword);

        if (!isPasswordMatch) {
            throw new UnauthorizedException("Mật khẩu không chính xác")
        }

        if (!account.isActive) {
            throw new UnauthorizedException("Tài khoản của bạn đã bị khoá")
        }

        const payload = {
            sub: account.id,
            email: account.email,
            hasTenantProfile: !!account.tenantProfile,
            hasOwnerProfile: !!account.ownerProfile,
        }

        this.logger.log(`User ${account.email} đã đăng nhập thành công `);

        return {
            message: "Đăng nhập thành công!",
            accessToken: this.jwtService.sign(payload),
        }
    }

    async createOwnerProfile(accountId: string) {
        const existing = await this.prisma.ownerProfile.findUnique({
            where: { accountId }
        })

        if (existing) {
            throw new ConflictException("Bạn đã có tài khoản chủ căn hộ ")
        }

        const userProfile = await this.prisma.account.findUnique({
            where: { id: accountId }
        })

        if (!userProfile) {
            throw new ConflictException("Tài khoản không tồn tại")
        }

        // Tạo tài khoản chủ căn hộ
        await this.prisma.ownerProfile.create({
            data: {
                accountId: userProfile.id,
                fullName: "Later",
                taxCode: "Update_later",
                bankAccount: "Update_later"
            }
        });

        return {
            message: "Thiết lập tài khoản chủ hộ thành công, Vui lòng đăng nhập lại"
        }
    }

    async forgotPassword(dto: RegisterDto) {
    }


}
