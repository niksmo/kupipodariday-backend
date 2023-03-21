import { IsOptional, IsUrl, Length, Matches } from 'class-validator';
import { EMAIL_PATTERN, USERNAME_PATTERN, PASSWORD_PATTERN } from 'users/lib';
import { specifyMessage } from 'utils';

export class UpdateUserDto {
  @Matches(
    USERNAME_PATTERN,
    specifyMessage(
      'Имя пользователя должно быть строчными латинскими буквами от 2 до 30 символов'
    )
  )
  @IsOptional()
  readonly username: string;

  @Length(
    2,
    200,
    specifyMessage('Раздел "О себе" должен содержать от 2 до 200 символов')
  )
  @IsOptional()
  readonly about: string;

  @IsUrl(undefined, specifyMessage('Неверная ссылка на аватар'))
  @IsOptional()
  readonly avatar: string;

  @Matches(EMAIL_PATTERN, specifyMessage('Email указан неверно'))
  @IsOptional()
  readonly email: string;

  @Matches(
    PASSWORD_PATTERN,
    specifyMessage('Пароль должен содержать латинские и специальные символы')
  )
  @IsOptional()
  password: string;
}
