// verify-listing.dto.ts
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApartmentTypes } from "@prisma/client";

export class VerifyListingDto {
    @IsString({message: "Id căn hộ chưa phù hợp"})
    @IsOptional()
    apartmentId?: string;

    @IsString()
    @IsNotEmpty({ message: 'Thiếu ID chủ nhà' })
    ownerId!: string;

    @IsString()
    @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
    title!: string;

    @IsString()
    @IsNotEmpty({ message: 'Mô tả không được để trống' })
    description!: string;

    @IsNumber()
    @Type(() => Number)
    @Min(0, {message: "Vui lòng nhập số tiền cần thuê"})
    pricePerMonth!: number;

    @IsNumber()
    @Type(() => Number)
    @Min(0, {message: "Số phòng không đúng định dạng số !!!"})
    room_number!: number;

    @IsNumber()
    @Type(() => Number)
    @Min(0, {message: "Số tầng không đúng định dạng số !!!"})
    floor!: number;

    @IsNumber()
    area!: number;

    @IsString()
    district!: string;

    @IsString()
    fullAddress!: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    bedroom!: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    bathroom!: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    livingroom!: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    kitchen!: number;

    @IsEnum(ApartmentTypes, {message: "Chọn các thuộc tính của căn hộ"})
    type!: ApartmentTypes;

    // --- ẢNH GỬI LÊN ---
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    imageUrls?: string[];
}