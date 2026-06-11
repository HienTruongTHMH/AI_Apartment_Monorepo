import { 
    IsString,
    IsNumber,
    Min
} from 'class-validator';


export class SearchApartmentDto {
    @IsString()
    keyword!: string;

    @IsNumber()
    @Min(0)
    minPrice!: number;

   @IsNumber()
   maxPrice!: number;
} 