import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TUser } from 'users/entities/types';
import { roundToHundredths, specifyMessage } from 'utils';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishByIdDto } from './dto/update-wish-by-id..dto';
import { TWish, TWishId } from './entities/types';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>
  ) {}

  create(createWishDto: CreateWishDto, user: TUser) {
    createWishDto.price = roundToHundredths(createWishDto.price);
    return this.wishesRepository.save({ ...createWishDto, owner: user });
  }

  findOneWithOwner(wishId: TWishId, ownerId?: string): Promise<TWish | null> {
    return this.wishesRepository.findOne({
      where: { id: wishId, owner: { id: ownerId } },
      relations: { owner: true, offers: true },
    });
  }

  async updateOne(
    wishId: TWishId,
    updatedFields: Partial<TWish>
  ): Promise<TWish | null> {
    await this.wishesRepository.update(wishId, updatedFields);
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
    user: TUser
  ) {
    const storedWish = await this.findOneWithOwner(wishId, user.id);

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
