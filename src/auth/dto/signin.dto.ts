import { Matches } from 'class-validator';
import { PASSWORD_PATTERN, USERNAME_PATTERN } from 'users/lib';

export class SigninDto {
  @Matches(USERNAME_PATTERN, {
    message:
      'Имя пользователя должно быть строчными латинскими буквами от 2 до 30 символов',
  })
  readonly username: string;

  @Matches(PASSWORD_PATTERN, {
    message: 'Пароль должен содержать латинские и специальные символы',
  })
  password: string;
}
