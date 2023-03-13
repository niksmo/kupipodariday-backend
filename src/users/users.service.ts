import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isDuplicateError, KeyDuplicateExeption } from 'exeptions';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.save(createUserDto);
      return user;
    } catch (error) {
      if (isDuplicateError(error)) {
        throw new KeyDuplicateExeption({
          message: 'Пользователь с таким email или именем уже зарегистрирован',
        });
      }
      throw error;
    }
  }
}
