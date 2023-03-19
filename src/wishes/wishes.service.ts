import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from 'users/entities/types';
import { roundToHundredths, specifyMessage } from 'utils';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishByIdDto } from './dto/update-wish-by-id..dto';
import { IWish, TWishId } from './entities/types';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>
  ) {}

  create(createWishDto: CreateWishDto, user: IUser): Promise<IWish> {
    createWishDto.price = roundToHundredths(createWishDto.price);
    return this.wishesRepository.save({ ...createWishDto, owner: user });
  }

  findOne(wishId: TWishId): Promise<IWish | null> {
    return this.wishesRepository.findOne({
      where: { id: wishId },
      relations: { owner: true, offers: true },
    });
  }

  async updateOne(
    wishId: TWishId,
    updateWishDto: UpdateWishByIdDto
  ): Promise<IWish | null> {
    await this.wishesRepository.update(wishId, updateWishDto);
    return this.wishesRepository.findOne({
      where: { id: wishId },
      relations: { owner: true, offers: true },
    });
  }

  removeOne(wishId: TWishId) {
    return this.wishesRepository.delete({ id: wishId });
  }

  async updateByOwner(
    wishId: TWishId,
    updateWishByIdDto: UpdateWishByIdDto,
    user: IUser
  ) {
    const storedWish = await this.wishesRepository.findOne({
      where: { id: wishId, owner: { id: user.id } },
      relations: { owner: true, offers: true },
    });

    if (!storedWish) {
      throw new NotFoundException(specifyMessage('Не найден'));
    }

    if (updateWishByIdDto.price && storedWish.raised !== 0) {
      throw new BadRequestException(
        specifyMessage(
          'Нельзя менять стоимость подарка, т.к. уже есть желающие скинуться на него'
        )
      );
    }

    return this.updateOne(wishId, updateWishByIdDto);
  }
}
