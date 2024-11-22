import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  description: string;

  @IsString()
  @Length(1, 255)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be a valid URL-friendly string.',
  })
  slug: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  contactNumber?: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @IsOptional()
  @IsUrl()
  bannerUrl?: string;

  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isVirtual?: boolean;
}
