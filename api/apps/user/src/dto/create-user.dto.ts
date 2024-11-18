import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty.' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email should not be empty.' })
  email: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}
