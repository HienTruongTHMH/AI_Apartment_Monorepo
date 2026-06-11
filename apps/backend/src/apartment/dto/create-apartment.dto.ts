import { IsString, IsNotEmpty, ValidateNested, IsOptional, IsNumber, IsEnum, IsInt, IsUUID } from "class-validator";
import { Type } from 'class-transformer';
import { ApartmentStatus, ApartmentTypes, ListingStatus } from "@prisma/client";

class ListingOptionalDto {
    @IsString({message: "Title must use charater"})
    @IsNotEmpty({message: "Title can not be empty"})
    title!: string;

    @IsString()
    @IsNotEmpty({message: "Description can not be empty"})
    description!: string;

    @IsNumber({}, {message: "Price must type in number"})
    pricePerMonth!: number;
    
    @IsEnum(ListingStatus)
    listingStatus!: ListingStatus;
}

export class CreateApartmentDto {
    @IsInt()
    @IsNotEmpty()
    floor!: number;

    @IsNumber()
    @IsNotEmpty()
    area!: number;

    @IsEnum(ApartmentStatus)
    apartmentStatus!: ApartmentStatus;

    @IsEnum(ApartmentTypes)
    type!: ApartmentTypes

    @IsNumber()
    bedroom!: number;

    @IsNumber()
    livingroom!: number
    
    @IsNumber()
    bathroom!: number

    @IsNumber()
    kitchen!: number

    @IsString()
    district!: string;

    @IsString()
    fullAddress!: string;

    @IsUUID()
    @IsNotEmpty()
    ownerId!: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => ListingOptionalDto)
    listing?: ListingOptionalDto;
}
