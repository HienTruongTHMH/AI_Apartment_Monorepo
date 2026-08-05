import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from "class-validator";

export enum RegisterRoles {
    TENANT = 'TENANT',
    OWNER = 'OWNER'
}

export class RegisterDto {
    @IsEmail({}, { message: "Email không phù hợp" })
    email!: string;

    @IsOptional()          // Not required for Tenant registration
    @IsString({ message: "Không được để trống CCCD" })
    identityCard?: string; // ← changed to optional (?)

    @IsString()
    @MinLength(6, { message: "Mật khẩu có tối thiểu 6 kí tự" })
    password!: string;

    @IsString()
    @MinLength(6, { message: "Mật khẩu có tối thiểu 6 kí tự" })
    confirmPassword!: string;

    @IsString()
    phone!: string

    @IsString({ message: "Họ và tên phải là chuỗi ký tự" })
    @IsNotEmpty({ message: "Không được bỏ trống họ và tên" })
    @MinLength(2, { message: "Họ và tên phải có ít nhất 2 ký tự" })
    fullName!: string;

    @IsEnum(RegisterRoles)
    roles!: RegisterRoles;

}