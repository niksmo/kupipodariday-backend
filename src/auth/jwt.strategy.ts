import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'users/users.service';
import { TAppConfig } from 'config';
import { specifyMessage } from 'utils';
import { User } from 'users/entities/user.entity';

interface IJwtPayload {
  sub: User['id'];
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
    const user = this.usersService.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException(
        specifyMessage('Пользователь не авторизован')
      );
    }

    return user;
  }
}
