import { Matches } from 'class-validator';
import { USERNAME_PATTERN } from 'users/lib';

export class FindUserByNameDto {
  @Matches(USERNAME_PATTERN, {
    message:
      'Имя пользователя должно быть строчными латинскими буквами от 2 до 30 символов',
  })
  readonly username: string;
}
