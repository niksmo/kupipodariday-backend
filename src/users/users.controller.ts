import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'guards/jwt.guard';
import {
  ExcludeEmailInterceptor,
  ExcludePasswordInterceptor,
} from 'interceptors';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';
import { FindUserByNameDto } from './dto/find-user-by-name.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('find')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ExcludePasswordInterceptor)
  async findUserByEmail(@Query() findUserByEmailDto: FindUserByEmailDto) {
    const user = await this.usersService.findByEmail(findUserByEmailDto.email);
    if (!user) {
      throw new NotFoundException({
        message: 'Пользователь с таким email не найден',
      });
    }
    return user;
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ExcludeEmailInterceptor, ExcludePasswordInterceptor)
  async findUserByName(@Param() findUserByNameDto: FindUserByNameDto) {
    const user = await this.usersService.findByName(findUserByNameDto.username);
    if (!user) {
      throw new NotFoundException({
        message: 'Пользователь с таким именем не найден',
      });
    }
    return user;
  }
}
