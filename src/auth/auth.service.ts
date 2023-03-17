import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareWithHash } from 'users/lib';
import { TUserId } from 'users/types';
import { UsersService } from 'users/users.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async registerUser(signupDto: SignupDto) {
    const isExist = await this.usersService.findByNameOrEmail(
      signupDto.username,
      signupDto.email
    );

    if (isExist) {
      throw new ConflictException({
        message: 'Пользователь с таким именем или email уже зарегистрирован',
      });
    }

    return this.usersService.create(signupDto);
  }

  async authorizeUser(userId: TUserId) {
    const accessToken = this.jwtService.sign({ sub: userId });
    return { accessToken };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByName(username);

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
