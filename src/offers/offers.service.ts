import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { specifyMessage } from 'utils';
import { WishesService } from 'wishes/wishes.service';
import { CreateOfferDto } from './dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
    private wishesService: WishesService
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const wish = await this.wishesService.findOne({
      where: { id: createOfferDto.itemId },
      relations: { owner: true },
    });

    if (wish.owner.id === user.id) {
      throw new UnprocessableEntityException(
        specifyMessage('Вы не можете поддерживать подарки из своего вишлиста')
      );
    }

    const remainsToCollect = wish.price - wish.raised;

    if (remainsToCollect === 0) {
      throw new UnprocessableEntityException(
        specifyMessage('Сумма на подарок уже собрана')
      );
    }

    if (createOfferDto.amount > remainsToCollect) {
      throw new UnprocessableEntityException(
        specifyMessage('Взнос не может превышать оставшуюся сумму')
      );
    }

    wish.raised = wish.raised + createOfferDto.amount;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(wish);

      const offer = queryRunner.manager.create(Offer, {
        hidden: createOfferDto.hidden,
        amount: createOfferDto.amount,
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

  async findOne(...query: Parameters<typeof this.offersRepository.findOne>) {
    const offer = await this.offersRepository.findOne(...query);

    if (offer === null) {
      throw new NotFoundException(specifyMessage('Оффер не найден'));
    }

    return offer;
  }

  async updateOne(...query: Parameters<typeof this.offersRepository.save>) {
    return this.offersRepository.save(...query);
  }

  async removeOne(...query: Parameters<typeof this.offersRepository.remove>) {
    return this.offersRepository.remove(...query);
  }

  async findAll() {
    return this.offersRepository.find({
      where: { hidden: false },
      relations: { user: true, item: true },
    });
  }

  async findOneById(offerId: Offer['id']) {
    return this.findOne({
      where: { id: offerId, hidden: false },
      relations: { item: true, user: true },
    });
  }
}
