import { IsString, IsUUID } from 'class-validator';

export class UpdateProductParamsDto {
  @IsString()
  @IsUUID()
  productId: string;
}
