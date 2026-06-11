import { 
    IsString,
    IsEmail,
    IsNumber,
    MinLength
} from 'class-validator'

export class CreateUserDto {
    @IsString()
    userName!: string;

    @IsEmail({}, {message: 'Email empty'})
    email!: string;

    @IsString()
    @MinLength(12, {message: 'Min for passwrord are 12 charaters'})
    password!: string


    @IsString()
    @MinLength(10)
    phoneNumber!: string
}
