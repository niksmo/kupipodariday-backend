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
import { SensitiveOwnerDataInterceptor } from 'interceptors';
import { User as UserEntity } from 'users/entities/user.entity';
import { CreateWishlistDto, UpdateWishlistDto } from './dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SensitiveOwnerDataInterceptor)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: Wishlist['id']) {
    return this.wishlistsService.findOneById(id);
  }

  @Post()
  createOne(
    @Body() createWishlistDto: CreateWishlistDto,
    @User() user: UserEntity
  ) {
    return this.wishlistsService.create(createWishlistDto, user);
  }

  @Patch(':id')
  updateOneById(
    @Param('id') id: Wishlist['id'],
    @Body()
    updateWishlistDto: UpdateWishlistDto,
    @User() user: UserEntity
  ) {
    return this.wishlistsService.updateOneById(id, updateWishlistDto, user);
  }

  @Delete(':id')
  deleteOneById(@Param('id') id: Wishlist['id'], @User() user: UserEntity) {
    return this.wishlistsService.removeOneById(id, user);
  }
}
