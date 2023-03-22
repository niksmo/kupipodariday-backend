import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
  SensitiveOffersDataInterceptor,
  SensitiveOwnerDataInterceptor,
} from 'interceptors';
import { FindUsersDto, UpdateUserDto } from './dto';
import { User as UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('find')
  @HttpCode(HttpStatus.OK)
  findUsersByNameOrEmail(@Body() findUsersDto: FindUsersDto) {
    return this.usersService.findUsersByNameOrEmail(findUsersDto.query);
  }

  @Get('me')
  @UseInterceptors(ExcludePasswordInterceptor)
  findViewer(@User() user: UserEntity) {
    return user;
  }

  @Get('me/wishes')
  @UseInterceptors(
    SensitiveOwnerDataInterceptor,
    SensitiveOffersDataInterceptor
  )
  findViewerWishes(@User() user: UserEntity) {
    return this.usersService.findViewerWishes(user.id);
  }

  @Patch('me')
  @UseInterceptors(ExcludePasswordInterceptor)
  updateViewer(@Body() updateUserDto: UpdateUserDto, @User() user: UserEntity) {
    return this.usersService.updateViewer(updateUserDto, user);
  }

  @Get(':username')
  @UseInterceptors(ExcludeEmailInterceptor, ExcludePasswordInterceptor)
  findUserByName(@Param('username') username: string) {
    return this.usersService.findUserByName(username);
  }

  @Get(':username/wishes')
  findUserWishes(@Param('username') username: string) {
    return this.usersService.findUserWishes(username);
  }
}
