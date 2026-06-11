import { ApartmentStatus, ApartmentTypes, ListingStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsString, IsNumber, IsEnum, IsNotEmpty, IsUUID, IsInt, ValidateNested, Min, IsArray, IsOptional } from "class-validator";

class ApartmentDto {
    @IsUUID()
    ownerId!: string

    @IsNumber()
    floor!: number;

    @IsNumber()
    area!: number;

    @IsString()
    district!: string;

    @IsString()
    fullAddress!: string;

    @IsNumber()
    room_number!: number;

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

    @IsEnum(ApartmentTypes)
    type!: ApartmentTypes
}
export class CreateListingDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsNumber()
    @IsNotEmpty()
    pricePerMonth!: number;

    @IsEnum(ListingStatus)
    listingStatus!: ListingStatus;

    @IsOptional()
    images?: any;

    @IsUUID()
    @IsOptional()
    apartmentId!: string;

    @ValidateNested()
    @Type(() => ApartmentDto)
    apartment?: ApartmentDto
}
