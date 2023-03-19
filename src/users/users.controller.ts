import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'decorators/user.decorator';
import { JwtAuthGuard } from 'guards/jwt.guard';
import {
  ExcludeEmailInterceptor,
  ExcludePasswordInterceptor,
} from 'interceptors';
import { isEmptyBody, specifyMessage } from 'utils';
import { FindUserByNameDto } from './dto/find-user-by-name.dto';
import { UpdateViewerDto } from './dto/update-viewer.dto';
import { IUser } from './entities/types';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('find') //вернуться к этому роуту, т.к. тут явно нужен POST как в свагере
  async findUsers() {
    return null;
  }

  @Get('me')
  @UseInterceptors(ExcludePasswordInterceptor)
  getViewer(@User() user: IUser) {
    return this.usersService.findOne({ where: { id: user.id } });
  }

  @Patch('me')
  @UseInterceptors(ExcludePasswordInterceptor)
  updateViewer(@Body() updateViewerDto: UpdateViewerDto, @User() user: IUser) {
    if (isEmptyBody(updateViewerDto)) {
      return user;
    }
    return this.usersService.updateByOwner(updateViewerDto, user.id);
  }

  @Get(':username')
  @UseInterceptors(ExcludeEmailInterceptor, ExcludePasswordInterceptor)
  async findUserByName(@Param() findUserByNameDto: FindUserByNameDto) {
    const user = await this.usersService.findOne({
      where: { username: findUserByNameDto.username },
    });
    if (!user) {
      throw new NotFoundException(
        specifyMessage('Пользователь с таким именем не найден')
      );
    }
    return user;
  }
}
