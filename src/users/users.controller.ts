import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'decorators/user.decorator';
import { JwtAuthGuard } from 'guards/jwt.guard';
import {
  ExcludeEmailInterceptor,
  ExcludePasswordInterceptor,
} from 'interceptors';
import { isEmptyBody } from 'utils';
import { FindUserByEmailDto } from './dto/find-user-by-email.dto';
import { FindUserByNameDto } from './dto/find-user-by-name.dto';
import { UpdateViewerDto } from './dto/update-viewer.dto';
import { TUser } from './entities/types';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('find') //вернуться к этому роуту, т.к. тут явно нужен POST как в свагере
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

  @Get('me')
  @UseInterceptors(ExcludePasswordInterceptor)
  getViewer(@User() user: TUser) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  @UseInterceptors(ExcludePasswordInterceptor)
  updateViewer(@Body() updateViewerDto: UpdateViewerDto, @User() user: TUser) {
    if (isEmptyBody(updateViewerDto)) {
      return user;
    }
    return this.usersService.update(updateViewerDto, user.id);
  }

  @Get(':username')
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
