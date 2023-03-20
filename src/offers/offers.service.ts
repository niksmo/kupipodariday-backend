import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from 'users/entities/types';
import { specifyMessage } from 'utils';
import { WishesService } from 'wishes/wishes.service';
import { AddOfferDto } from './dto/add-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
    private wishesService: WishesService
  ) {}

  async create(addOfferDto: AddOfferDto, user: IUser) {
    const wish = await this.wishesService.findOne({
      where: { id: addOfferDto.itemId },
      relations: { owner: true },
    });

    if (wish.owner?.id === user.id) {
      throw new UnprocessableEntityException(
        specifyMessage('Нельзя скидываться на свои подарки')
      );
    }

    const remainsToCollect = wish.price - wish.raised;

    if (remainsToCollect === 0) {
      throw new UnprocessableEntityException(
        specifyMessage('Сумма на подарок уже собрана')
      );
    }

    if (addOfferDto.amount > remainsToCollect) {
      throw new UnprocessableEntityException(
        specifyMessage('Взнос не может превышать оставшуюся сумму')
      );
    }

    const newOffer = {
      hidden: addOfferDto.hidden,
      amount: addOfferDto.amount,
      item: wish,
      user,
    };

    wish.raised = wish.raised + addOfferDto.amount;

    this.wishesService.updateOne({ id: wish.id }, wish);

    return this.offersRepository.save(newOffer);
  }
}
