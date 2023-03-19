import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { IUser, TUserId } from 'users/entities/types';
import { ResultResponse, roundToHundredths, specifyMessage } from 'utils';
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

  async findOne(query: FindOneOptions<Wish>): Promise<IWish> {
    const wish = await this.wishesRepository.findOne(query);

    if (wish === null) {
      throw new NotFoundException(specifyMessage('Подарок не найден'));
    }
    return wish;
  }

  updateOne(query: FindOptionsWhere<Wish>, updateWishDto: UpdateWishByIdDto) {
    return this.wishesRepository.update(query, updateWishDto);
  }

  async removeOne(query: FindOptionsWhere<Wish>) {
    const result = await this.wishesRepository.delete(query);
    if (result.affected === 0) {
      throw new NotFoundException(specifyMessage('Подарок не найден'));
    }
    return new ResultResponse(true, 'Подарок удален');
  }

  async updateByOwner(
    wishId: TWishId,
    updateWishByIdDto: UpdateWishByIdDto,
    user: IUser
  ) {
    const storedWish = await this.findOne({
      where: {
        id: wishId,
        owner: { id: user.id },
      },
    });

    if (updateWishByIdDto.price && storedWish.raised !== 0) {
      throw new BadRequestException(
        specifyMessage(
          'Нельзя менять стоимость подарка, т.к. уже есть желающие скинуться на него'
        )
      );
    }

    const updateResult = await this.updateOne(
      { id: wishId },
      updateWishByIdDto
    );

    if (updateResult.affected === 0) {
      throw new InternalServerErrorException(
        specifyMessage('Не удалось обновить запись')
      );
    }
    return this.findOne({ where: { id: wishId } });
  }

  removeByOwner(wishId: TWishId, userId: TUserId) {
    return this.removeOne({ id: wishId, owner: { id: userId } });
  }
}
