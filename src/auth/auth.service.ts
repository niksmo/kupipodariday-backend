import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareWithHash } from 'users/lib';
import { UsersService } from 'users/users.service';
import { SignupDto } from './dto';
import { specifyMessage } from 'utils';
import { User } from 'users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async registerUser(signupDto: SignupDto) {
    const isExist = await this.usersService.findOne({
      where: [{ username: signupDto.username }, { email: signupDto.email }],
    });

    if (isExist) {
      throw new ConflictException(
        specifyMessage(
          'Пользователь с таким именем или email уже зарегистрирован'
        )
      );
    }

    return this.usersService.create(signupDto);
  }

  async authorizeUser(userId: User['id']) {
    const accessToken = this.jwtService.sign({ sub: userId });
    return { access_token: accessToken };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne({
      where: { username },
    });

    if (!user) {
      return null;
    }

    const isEqualPassword = await compareWithHash(password, user.password);

    if (!isEqualPassword) {
      return null;
    }

    return user;
  }
}
