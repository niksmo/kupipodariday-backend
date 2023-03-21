import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'decorators';
import { JwtAuthGuard } from 'guards';
import { User as UserEntity } from 'users/entities/user.entity';
import { CreateOfferDto } from './dto';
import { OffersService } from './offers.service';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  createOne(@Body() createOfferDto: CreateOfferDto, @User() user: UserEntity) {
    return this.offersService.create(createOfferDto, user);
  }
}
