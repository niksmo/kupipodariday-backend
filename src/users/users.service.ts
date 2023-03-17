import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TAppConfig } from 'config/app-config';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { hashPassword } from './lib';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private configService: ConfigService<TAppConfig, true>
  ) {}

  findById(userId: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id: userId });
  }

  findByName(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findByNameOrEmail(
    username: string,
    email: string
  ): Promise<User[] | null> {
    const users = await this.usersRepository.find({
      where: [{ username }, { email }],
    });
    if (users.length === 0) {
      return null;
    }
    return users;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    await hashPassword(createUserDto, this.configService.get('hashRounds'));
    return await this.usersRepository.save(createUserDto);
  }
}
