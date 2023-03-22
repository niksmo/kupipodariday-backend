import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { specifyMessage } from 'utils';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<User>(err: unknown, user: undefined | User) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(specifyMessage('Пользователь не авторизован'))
      );
    }
    return user;
  }
}
