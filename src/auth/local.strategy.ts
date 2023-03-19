import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { PASSWORD_PATTERN, USERNAME_PATTERN } from 'users/lib';
import { specifyMessage } from 'utils';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(username: string, password: string) {
    if (!USERNAME_PATTERN.test(username) || !PASSWORD_PATTERN.test(password)) {
      throw new UnauthorizedException(
        specifyMessage('Неверное имя пользователя или пароль')
      );
    }

    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException(
        specifyMessage('Неверное имя пользователя или пароль')
      );
    }

    return user;
  }
}
