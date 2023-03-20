import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { User } from 'users/entities/user.entity';
import { ResultResponse, roundToHundredths, specifyMessage } from 'utils';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishByIdDto } from './dto/update-wish-by-id..dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>
  ) {}

  create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    createWishDto.price = roundToHundredths(createWishDto.price);
    return this.wishesRepository.save({ ...createWishDto, owner: user });
  }

  async findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    const wish = await this.wishesRepository.findOne(query);

    if (wish === null) {
      throw new NotFoundException(specifyMessage('Подарок не найден'));
    }
    return wish;
  }

  findMany(query: FindManyOptions<Wish>) {
    return this.wishesRepository.find(query);
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
    wishId: Wish['id'],
    updateWishByIdDto: UpdateWishByIdDto,
    user: User
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

  removeByOwner(wishId: Wish['id'], userId: User['id']) {
    return this.removeOne({ id: wishId, owner: { id: userId } });
  }
}
