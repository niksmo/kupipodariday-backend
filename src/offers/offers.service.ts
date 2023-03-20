import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { specifyMessage } from 'utils';
import { WishesService } from 'wishes/wishes.service';
import { AddOfferDto } from './dto/add-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
    private wishesService: WishesService
  ) {}

  async create(addOfferDto: AddOfferDto, user: User) {
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

    wish.raised = wish.raised + addOfferDto.amount;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(wish);

      const offer = queryRunner.manager.create(Offer, {
        hidden: addOfferDto.hidden,
        amount: addOfferDto.amount,
        item: wish,
        user,
      });

      const storedOffer = await queryRunner.manager.save(offer);
      await queryRunner.commitTransaction();

      return storedOffer;
    } catch (error) {
      queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        specifyMessage('Возникла непредвиденная ошибка')
      );
    } finally {
      await queryRunner.release();
    }
  }
}
