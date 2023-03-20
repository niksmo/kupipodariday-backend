import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
  ExcludeUserEmailInterceptor,
  ExcludeUserPasswordInterceptor,
  SensitiveOwnerDataInterceptor,
} from 'interceptors';
import { isEmptyBody, specifyMessage } from 'utils';
import { WishesService } from 'wishes/wishes.service';
import { FindUserByNameDto } from './dto/find-user-by-name.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateViewerDto } from './dto/update-viewer.dto';
import { IUser } from './entities/types';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService
  ) {}

  @Post('find')
  @HttpCode(HttpStatus.OK)
  async findUsersByNameOrEmail(@Body() findUsersDto: FindUsersDto) {
    const { query } = findUsersDto;
    return this.usersService.findMany(query);
  }

  @Get('me')
  @UseInterceptors(ExcludeUserPasswordInterceptor)
  getViewer(@User() user: IUser) {
    return this.usersService.findOne({ where: { id: user.id } });
  }

  @Get('me/wishes')
  @UseInterceptors(SensitiveOwnerDataInterceptor)
  getViewerWishes(@User() user: IUser) {
    return this.wishesService.findMany({
      where: { owner: { id: user.id } },
      relations: { owner: true, offers: true },
    });
  }

  @Patch('me')
  @UseInterceptors(ExcludeUserPasswordInterceptor)
  updateViewer(@Body() updateViewerDto: UpdateViewerDto, @User() user: IUser) {
    if (isEmptyBody(updateViewerDto)) {
      return user;
    }
    return this.usersService.updateByOwner(updateViewerDto, user);
  }

  @Get(':username')
  @UseInterceptors(ExcludeUserEmailInterceptor, ExcludeUserPasswordInterceptor)
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
