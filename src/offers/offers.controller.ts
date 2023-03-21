import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'decorators';
import { JwtAuthGuard } from 'guards';
import { SensitiveUserDataInterceptor } from 'interceptors';
import { User as UserEntity } from 'users/entities/user.entity';
import { CreateOfferDto } from './dto';
import { Offer } from './entities/offer.entity';
import { OffersService } from './offers.service';

@Controller('offers')
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @UseInterceptors(SensitiveUserDataInterceptor)
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  @UseInterceptors(SensitiveUserDataInterceptor)
  findOneById(@Param('id') id: Offer['id']) {
    return this.offersService.findOneById(id);
  }

  @Post()
  createOne(@Body() createOfferDto: CreateOfferDto, @User() user: UserEntity) {
    return this.offersService.create(createOfferDto, user);
  }
}
