import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'guards/jwt.guard';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishListsService: WishlistsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.wishListsService.findAll();
  }
}
