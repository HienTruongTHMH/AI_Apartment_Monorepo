import { IsString, IsEmail, IsNotEmpty, MinLength, IsEnum } from "class-validator";

export enum RegisterRoles {
    TENANT = 'TENANT',
    OWNER = 'OWNER'
}

export class RegisterDto {
    @IsEmail({}, {message: "Email không phù hợp"})
    email!: string;

    @IsString()
    @MinLength(6, {message: "Mật khẩu có tối thiểu 6 kí tự"})
    password!: string;

    @IsString()
    @MinLength(6, {message: "Mật khẩu có tối thiểu 6 kí tự"})
    passwordTwo!: string;   

    @IsString()
    phone!: string

    @IsString({message: "Không được bỏ trôgns tên"})
    fullName!: string;

    @IsEnum(RegisterRoles)
    roles!: RegisterRoles;

}