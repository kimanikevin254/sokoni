import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
