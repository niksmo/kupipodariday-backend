import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TAppConfig } from 'config/app-config';
import { FindOneOptions, FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { hashPassword } from './lib';
import { specifyMessage } from 'utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private configService: ConfigService<TAppConfig, true>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    await hashPassword(createUserDto, this.configService.get('hashRounds'));
    return await this.usersRepository.save(createUserDto);
  }

  findOne(query: FindOneOptions<User>) {
    return this.usersRepository.findOne(query);
  }

  findMany(query: string) {
    const normalizedQuery = query.toLowerCase();
    return this.usersRepository.find({
      where: [
        { username: Like(`%${normalizedQuery}%`) },
        { email: normalizedQuery },
      ],
    });
  }

  updateOne(query: FindOptionsWhere<User>, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(query, updateUserDto);
  }

  async updateByOwner(
    updateUserDto: UpdateUserDto,
    user: User
  ): Promise<User | null> {
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const isExistUsername = await this.findOne({
        where: { username: updateUserDto.username },
      });

      if (isExistUsername) {
        throw new ConflictException(
          specifyMessage('Пользователь с таким именем уже зарегистрирован')
        );
      }
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const isExistEmail = await this.findOne({
        where: { email: updateUserDto.email },
      });

      if (isExistEmail) {
        throw new ConflictException(
          specifyMessage('Пользователь с таким email уже зарегистрирован')
        );
      }
    }

    await hashPassword(updateUserDto, this.configService.get('hashRounds'));
    await this.updateOne({ id: user.id }, updateUserDto);
    return this.findOne({ where: { id: user.id } });
  }
}
