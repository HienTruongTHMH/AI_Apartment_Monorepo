import { IsString, IsNotEmpty, ValidateNested, IsOptional, IsNumber, IsEnum, IsInt } from "class-validator";
import { Type } from 'class-transformer';
import { ApartmentStatus, ApartmentTypes, ListingStatus } from "@prisma/client";

class ListingOptionalDto {
    @IsString({ message: "Title must use characters" })
    @IsNotEmpty({ message: "Title can not be empty" })
    title!: string;

    @IsString()
    @IsNotEmpty({ message: "Description can not be empty" })
    description!: string;

    @IsNumber({}, { message: "Price must be a number" })
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
    type!: ApartmentTypes;

    @IsNumber()
    bedroom!: number;

    @IsNumber()
    livingroom!: number;

    @IsNumber()
    bathroom!: number;

    @IsNumber()
    kitchen!: number;

    @IsString()
    district!: string;

    @IsString()
    fullAddress!: string;

    // ownerId is intentionally NOT here.
    // It is a server-side value injected from the authenticated user's JWT.
    // Never trust the client to provide it.

    @IsOptional()
    @ValidateNested()
    @Type(() => ListingOptionalDto)
    listing?: ListingOptionalDto;
}
