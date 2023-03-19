import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TAppConfig } from 'config/app-config';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateViewerDto } from './dto/update-viewer.dto';
import { User } from './entities/user.entity';
import { hashPassword } from './lib';
import { IUser, TUserId } from './entities/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private configService: ConfigService<TAppConfig, true>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser | null> {
    await hashPassword(createUserDto, this.configService.get('hashRounds'));
    return await this.usersRepository.save(createUserDto);
  }

  findOne(query: FindOneOptions<User>) {
    return this.usersRepository.findOne(query);
  }

  updateOne(query: FindOptionsWhere<User>, updateViewerDto: UpdateViewerDto) {
    return this.usersRepository.update(query, updateViewerDto);
  }

  async updateByOwner(
    updateViewerDto: UpdateViewerDto,
    userId: TUserId
  ): Promise<IUser | null> {
    await hashPassword(updateViewerDto, this.configService.get('hashRounds'));
    await this.updateOne({ id: userId }, updateViewerDto);
    return this.findOne({ where: { id: userId } });
  }
}
