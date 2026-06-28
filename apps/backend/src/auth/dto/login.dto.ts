import { IsString, IsEmail, MinLength} from 'class-validator'

export class LoginDto {
    @IsEmail({}, {message: "Email không hợp lệ"})
    email!: string

    @IsString({message: "Mặt khẩu không để trống!!"})
    @MinLength(6, {message: "Tối thiểu 6 kí tự"})
    password!: string
}