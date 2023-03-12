import { Controller } from '@nestjs/common';
import { WishListsService } from './wishlists.service';

@Controller('wishlists')
export class WishListsController {
  constructor(private readonly wishListsService: WishListsService) {}
}
