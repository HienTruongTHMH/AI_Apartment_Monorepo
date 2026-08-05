import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateListingDto } from './create-listing.dto';
import { ListingStatus } from "@prisma/client";
import { IsString, IsNumber, IsEnum, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';

import { ApartmentDto } from './create-listing.dto';

export class UpdateApartmentDto {
    @IsOptional()
    @IsString()
    type?: any;

    @IsOptional()
    @IsNumber()
    floor?: number;

    @IsOptional()
    @IsNumber()
    area?: number;

    @IsOptional()
    @IsNumber()
    bedroom?: number;

    @IsOptional()
    @IsNumber()
    bathroom?: number;

    @IsOptional()
    @IsNumber()
    livingroom?: number;

    @IsOptional()
    @IsNumber()
    kitchen?: number;

    @IsOptional()
    @IsNumber()
    room_number?: number;

    @IsOptional()
    @IsString()
    fullAddress?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    ownerId?: string;
}

export class UpdateListingDto extends PartialType(OmitType(CreateListingDto, ['apartment'] as const)) {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    pricePerMonth?: number;

    @IsOptional()
    @IsEnum(ListingStatus)
    listingStatus?: ListingStatus;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageUrls?: string[];

    @IsOptional()
    @IsString()
    apartmentId?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateApartmentDto)
    apartment?: UpdateApartmentDto;
}
