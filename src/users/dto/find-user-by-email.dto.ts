import { Matches } from 'class-validator';
import { EMAIL_PATTERN } from 'users/lib';

export class FindUserByEmailDto {
  @Matches(EMAIL_PATTERN, { message: 'Email указан неверно' })
  readonly email: string;
}
