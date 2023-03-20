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
import { User } from 'decorators/user.decorator';
import { JwtAuthGuard } from 'guards/jwt.guard';
import {
  SensitiveOwnerDataInterceptor,
  SensitiveOffersDataInterceptor,
} from 'interceptors';
import { User as UserEntity } from 'users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishByIdDto } from './dto/update-wish-by-id..dto';
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
  createWish(@Body() createWishDto: CreateWishDto, @User() user: UserEntity) {
    return this.wishesService.create(createWishDto, user);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SensitiveOwnerDataInterceptor)
  copyWish(@Param('id') id: number, @User() user: UserEntity) {
    return this.wishesService.copy(id, user);
  }

  @Patch(':id') // not exist on frontend
  @UseGuards(JwtAuthGuard)
  updateWish(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishByIdDto,
    @User() user: UserEntity
  ) {
    return this.wishesService.updateByOwner(id, updateWishDto, user);
  }

  @Delete(':id') // not exist on frontend
  @UseGuards(JwtAuthGuard)
  deleteWish(@Param('id') id: number, @User() user: UserEntity) {
    return this.wishesService.removeByOwner(id, user.id);
  }
}
