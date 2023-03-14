import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'users/users.service';
import { TUserId } from 'users/types';
import { TAppConfig } from 'config/app-config';

interface IJwtPayload {
  sub: TUserId;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService<TAppConfig, true>,
    private usersService: UsersService
  ) {
    const secretOrKey = configService.get('jwtSecret');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  async validate(payload: IJwtPayload) {
    const user = this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }

    return user;
  }
}
