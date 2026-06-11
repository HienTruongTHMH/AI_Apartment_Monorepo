import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumber, Min } from "class-validator";

export class SearchListingDto {
    @IsOptional()
    @IsString()
    keyword?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxPrice?: number;

}