import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { specifyMessage } from 'utils';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err: unknown, user: undefined | TUser) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(specifyMessage('Пользователь не авторизован'))
      );
    }
    return user;
  }
}
