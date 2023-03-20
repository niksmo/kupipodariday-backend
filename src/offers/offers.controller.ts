import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'decorators/user.decorator';
import { JwtAuthGuard } from 'guards/jwt.guard';
import { User as UserEntity } from 'users/entities/user.entity';
import { AddOfferDto } from './dto/add-offer.dto';
import { OffersService } from './offers.service';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  addOffer(@Body() addOfferDto: AddOfferDto, @User() user: UserEntity) {
    return this.offersService.create(addOfferDto, user);
  }
}
