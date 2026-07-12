import { IsString, IsDate, IsNumber, IsDateString, IsOptional } from "class-validator";

export class CreateDraftDto {
    @IsString()
    tenantId!: string;

    @IsString()
    apartmentId!: string;

    @IsDateString()
    startDate!: Date;

    @IsDateString()
    endDate!: Date;

    @IsNumber()
    rentPrice!: number;

    @IsNumber()
    deposit!: number;

    @IsOptional()
    @IsString()
    terms?: string;
}