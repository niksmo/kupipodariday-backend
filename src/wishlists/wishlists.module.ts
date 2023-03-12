import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishList } from './entities/wishlist.entity';
import { WishListsController } from './wishlists.controller';
import { WishListsService } from './wishlists.service';

@Module({
  imports: [TypeOrmModule.forFeature([WishList])],
  controllers: [WishListsController],
  providers: [WishListsService],
})
export class WishListsModule {}
