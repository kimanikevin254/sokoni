import { IsString, IsUUID } from 'class-validator';

export class GetStoreProductsParamsDto {
  @IsString()
  @IsUUID()
  storeId: string;
}
