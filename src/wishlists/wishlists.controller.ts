import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'decorators/user.decorator';
import { JwtAuthGuard } from 'guards/jwt.guard';
import { SensitiveOwnerDataInterceptor } from 'interceptors';
import { User as UserEntity } from 'users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SensitiveOwnerDataInterceptor)
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SensitiveOwnerDataInterceptor)
  findOneById(@Param('id') id: Wishlist['id']) {
    return this.wishlistsService.findOneById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SensitiveOwnerDataInterceptor)
  createOne(
    @Body() createWishlistDto: CreateWishlistDto,
    @User() user: UserEntity
  ) {
    return this.wishlistsService.createOne(createWishlistDto, user);
  }
}
