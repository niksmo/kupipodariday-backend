import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser>(err: unknown, user: undefined | TUser) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException({ message: 'Пользователь не авторизован' })
      );
    }
    return user;
  }
}
