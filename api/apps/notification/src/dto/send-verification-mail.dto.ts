import { IsNotEmpty, IsString } from 'class-validator';

export class SendVerificationMailDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  verificationLink: string;
}
