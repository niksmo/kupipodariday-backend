import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { NotFoundExeption } from 'exeptions';
import { ExcludePasswordInterceptor } from 'interceptors';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(ExcludePasswordInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':username')
  async findUserByName(@Param('username') username: string) {
    const user = await this.usersService.findByName(username);

    if (!user) {
      throw new NotFoundExeption('Пользователь с таким именем не найден');
    }

    return user;
  }
}
