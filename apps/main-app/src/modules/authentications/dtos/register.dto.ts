import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

class RegisterDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;
}

export { RegisterDTO };
