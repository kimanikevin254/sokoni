import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

class ProductDetailDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock: number;
}

export class AddProductsToStoreDto {
  @IsNotEmpty()
  @IsUUID()
  storeId: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductDetailDto)
  @ArrayMinSize(1)
  products: ProductDetailDto[];
}
