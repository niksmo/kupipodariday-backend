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
import { User } from 'decorators';
import { JwtAuthGuard } from 'guards';
import {
  ExcludeEmailInterceptor,
  ExcludePasswordInterceptor,
  SensitiveOwnerDataInterceptor,
} from 'interceptors';
import { isEmptyBody, specifyMessage } from 'utils';
import { WishesService } from 'wishes/wishes.service';
import { FindUsersDto, UpdateUserDto } from './dto';
import { User as UserEntity } from './entities/user.entity';
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
  @UseInterceptors(ExcludePasswordInterceptor)
  getUser(@User() user: UserEntity) {
    return this.usersService.findOne({ where: { id: user.id } });
  }

  @Get('me/wishes')
  @UseInterceptors(SensitiveOwnerDataInterceptor)
  getUserWishes(@User() user: UserEntity) {
    return this.wishesService.findMany({
      where: { owner: { id: user.id } },
      relations: { owner: true, offers: true },
    });
  }

  @Patch('me')
  @UseInterceptors(ExcludePasswordInterceptor)
  updateUser(@Body() updateUserDto: UpdateUserDto, @User() user: UserEntity) {
    if (isEmptyBody(updateUserDto)) {
      return user;
    }
    return this.usersService.updateByOwner(updateUserDto, user);
  }

  @Get(':username')
  @UseInterceptors(ExcludeEmailInterceptor, ExcludePasswordInterceptor)
  async findUserByName(@Param('username') username: string) {
    const user = await this.usersService.findOne({
      where: { username: username },
    });
    if (!user) {
      throw new NotFoundException(
        specifyMessage('Пользователь с таким именем не найден')
      );
    }
    return user;
  }

  @Get(':username/wishes')
  findUserWishes(@Param('username') username: string) {
    return this.wishesService.findMany({
      where: { owner: { username } },
    });
  }
}
