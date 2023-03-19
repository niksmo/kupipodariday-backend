import {
  BadRequestException,
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
import { SensitiveOwnerDataInterceptor } from 'interceptors';
import { IUser } from 'users/entities/types';
import { isEmptyBody, specifyMessage } from 'utils';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishByIdDto } from './dto/update-wish-by-id..dto';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SensitiveOwnerDataInterceptor)
  createWish(@Body() createWishDto: CreateWishDto, @User() user: IUser) {
    return this.wishesService.create(createWishDto, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SensitiveOwnerDataInterceptor)
  findWish(@Param('id') id: number) {
    return this.wishesService.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateWish(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishByIdDto,
    @User() user: IUser
  ) {
    if (isEmptyBody(updateWishDto)) {
      throw new BadRequestException(
        specifyMessage('Не указано ни одно параметра')
      );
    }
    return this.wishesService.updateByOwner(id, updateWishDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteWish(@Param('id') id: number, @User() user: IUser) {
    return this.wishesService.removeByOwner(id, user.id);
  }
}
