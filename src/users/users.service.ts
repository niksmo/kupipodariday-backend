import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TAppConfig } from 'config/app-config';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateViewerDto } from './dto/update-viewer.dto';
import { User } from './entities/user.entity';
import { hashPassword } from './lib';
import { TUser, TUserId } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private configService: ConfigService<TAppConfig, true>
  ) {}

  findById(userId: string): Promise<TUser | null> {
    return this.usersRepository.findOneBy({ id: userId });
  }

  findByName(username: string): Promise<TUser | null> {
    return this.usersRepository.findOneBy({ username });
  }

  findByEmail(email: string): Promise<TUser | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findByNameOrEmail(
    username: string,
    email: string
  ): Promise<TUser[] | null> {
    const users = await this.usersRepository.find({
      where: [{ username }, { email }],
    });
    if (users.length === 0) {
      return null;
    }
    return users;
  }

  async create(createUserDto: CreateUserDto): Promise<TUser | null> {
    await hashPassword(createUserDto, this.configService.get('hashRounds'));
    return await this.usersRepository.save(createUserDto);
  }

  async update(
    updateViewerDto: UpdateViewerDto,
    userId: TUserId
  ): Promise<TUser | null> {
    await hashPassword(updateViewerDto, this.configService.get('hashRounds'));
    await this.usersRepository.update(userId, updateViewerDto);
    return this.usersRepository.findOneBy({ id: userId });
  }
}
