import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  readonly username: string;

  @IsString()
  @Length(2, 200)
  @IsOptional()
  readonly about: string;

  @IsUrl()
  @IsOptional()
  readonly avatar: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  password: string;
}
