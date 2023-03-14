import { Injectable } from '@nestjs/common';
import { compareWithHash } from 'users/lib';
import { UsersService } from 'users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
