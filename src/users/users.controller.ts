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
import {
  ExcludeEmailInterceptor,
  ExcludePasswordInterceptor,
} from 'interceptors';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';
import { FindUserByNameDto } from './dto/find-user-by-name.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup') // relocate in auth module
  @UseInterceptors(ExcludePasswordInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('find')
  @UseInterceptors(ExcludePasswordInterceptor)
  async findUserByEmail(@Query() findUserByEmailDto: FindUserByEmailDto) {
    const user = await this.usersService.findByEmail(findUserByEmailDto.email);
    if (!user) {
      throw new NotFoundExeption('Пользователь с таким email не найден');
    }
    return user;
  }

  @Get(':username')
  @UseInterceptors(ExcludeEmailInterceptor, ExcludePasswordInterceptor)
  async findUserByName(@Param() findUserByNameDto: FindUserByNameDto) {
    const user = await this.usersService.findByName(findUserByNameDto.username);
    if (!user) {
      throw new NotFoundExeption('Пользователь с таким именем не найден');
    }
    return user;
  }
}
