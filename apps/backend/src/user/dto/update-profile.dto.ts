import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from "class-validator";

export class UpdateProfileDto {
    @IsOptional()
    @IsString({ message: "Họ và tên phải là chuỗi ký tự" })
    @IsNotEmpty({ message: "Không được bỏ trống họ và tên" })
    @MinLength(2, { message: "Họ và tên phải có ít nhất 2 ký tự" })
    @MaxLength(50, { message: "Họ và tên không được vượt quá 50 ký tự" })
    fullName?: string;

    // Có thể thêm các trường khác như phone, identityCard sau này
}
