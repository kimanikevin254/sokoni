import { IsString, IsUUID } from 'class-validator';

export class UpdateStoreParamsDto {
  @IsString()
  @IsUUID()
  storeId: string;
}
