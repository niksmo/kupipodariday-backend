import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'decorators';
import { JwtAuthGuard } from 'guards';
import {
  SensitiveOwnerDataInterceptor,
  SensitiveOffersDataInterceptor,
} from 'interceptors';
import { User as UserEntity } from 'users/entities/user.entity';
import { CreateWishDto, UpdateWishDto } from './dto';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  @UseInterceptors(SensitiveOwnerDataInterceptor)
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  @UseInterceptors(SensitiveOwnerDataInterceptor)
  findTop() {
    return this.wishesService.findTop();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    SensitiveOwnerDataInterceptor,
    SensitiveOffersDataInterceptor
  )
  findById(@Param('id') id: number) {
    return this.wishesService.findOneById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SensitiveOwnerDataInterceptor)
  create(@Body() createWishDto: CreateWishDto, @User() user: UserEntity) {
    return this.wishesService.create(createWishDto, user);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SensitiveOwnerDataInterceptor)
  copyById(@Param('id') id: number, @User() user: UserEntity) {
    return this.wishesService.copyById(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    SensitiveOwnerDataInterceptor,
    SensitiveOffersDataInterceptor
  )
  updateById(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @User() user: UserEntity
  ) {
    return this.wishesService.updateById(id, updateWishDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    SensitiveOwnerDataInterceptor,
    SensitiveOffersDataInterceptor
  )
  removeById(@Param('id') id: number, @User() user: UserEntity) {
    return this.wishesService.removeById(id, user.id);
  }
}
