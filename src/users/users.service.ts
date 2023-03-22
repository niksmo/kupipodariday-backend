import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TAppConfig } from 'config/app-config';
import { Like, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { hashPassword } from './lib';
import { isEmptyBody, specifyMessage } from 'utils';
import { WishesService } from 'wishes/wishes.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private wishesService: WishesService,
    private configService: ConfigService<TAppConfig, true>
  ) {}

  async create(createUserDto: CreateUserDto) {
    await hashPassword(createUserDto, this.configService.get('hashRounds'));
    return await this.usersRepository.save(createUserDto);
  }

  async findOne(...query: Parameters<typeof this.usersRepository.findOne>) {
    return this.usersRepository.findOne(...query);
  }

  async findMany(...query: Parameters<typeof this.usersRepository.find>) {
    return this.usersRepository.find(...query);
  }

  async updateOne(...query: Parameters<typeof this.usersRepository.save>) {
    return this.usersRepository.save(...query);
  }

  async findViewerWishes(userId: User['id']) {
    return this.wishesService.findMany({
      where: { owner: { id: userId } },
      relations: { owner: true, offers: true },
    });
  }

  async updateViewer(updateUserDto: UpdateUserDto, user: User) {
    if (isEmptyBody(updateUserDto)) {
      return user;
    }

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

    const updatedUser = { ...user, ...updateUserDto };

    return this.updateOne(updatedUser);
  }

  async findUsersByNameOrEmail(query: string) {
    const normalizedQuery = query.toLowerCase();
    return this.findMany({
      where: [
        { username: Like(`%${normalizedQuery}%`) },
        { email: normalizedQuery },
      ],
    });
  }

  async findUserByName(username: User['username']) {
    const user = await this.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException(
        specifyMessage('Пользователь с таким именем не найден')
      );
    }
    return user;
  }

  async findUserWishes(username: User['username']) {
    return this.wishesService.findMany({
      where: { owner: { username } },
    });
  }
}
