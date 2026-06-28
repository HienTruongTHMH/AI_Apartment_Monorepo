import { PartialType } from '@nestjs/mapped-types';
import { CreateApartmentDto } from './create-apartment.dto';

import { IsNotEmpty, IsNumber, IsEnum, IsInt, IsString } from "class-validator";
import { ApartmentStatus, ApartmentTypes } from "@prisma/client";

export class UpdateApartmentDto extends PartialType(CreateApartmentDto) {
    @IsInt()
    @IsNotEmpty()
    floor!: number;

    @IsNumber()
    @IsNotEmpty()
    area!: number;

    @IsEnum(ApartmentStatus)
    apartmentStatus!: ApartmentStatus;

    @IsEnum(ApartmentTypes)
    apartmentType!: ApartmentTypes;

    @IsNumber()
    bedroom!: number;

    @IsNumber()
    livingroom!: number;
    
    @IsNumber()
    bathroom!: number;

    @IsString()
    district!: string;

    @IsString()
    fullAddress!: string;

    // ownerId is intentionally NOT here.
    // An apartment's owner must never change via a PATCH request.
}
