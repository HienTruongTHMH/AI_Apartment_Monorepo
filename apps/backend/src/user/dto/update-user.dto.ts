import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
