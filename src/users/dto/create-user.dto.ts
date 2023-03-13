import { IsOptional, IsUrl, Length, Matches } from 'class-validator';
import { EMAIL_PATTERN, NAME_PATTERN, PASSWORD_PATTERN } from 'users/lib';

export class CreateUserDto {
  @Matches(NAME_PATTERN, {
    message: 'Имя пользователя должно быть на латинском от 2 до 30 символов',
  })
  readonly username: string;

  @Length(2, 200, {
    message: 'Раздел "О себе" должен содержать от 2 до 200 символов',
  })
  @IsOptional()
  readonly about: string;

  @IsUrl(undefined, { message: 'Неверная ссылка на аватар' })
  @IsOptional()
  readonly avatar: string;

  @Matches(EMAIL_PATTERN, { message: 'Email указан неверно' })
  readonly email: string;

  @Matches(PASSWORD_PATTERN, {
    message: 'Пароль должен содержать латинские и специальные символы',
  })
  password: string;
}
