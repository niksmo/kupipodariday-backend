import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
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
    private dataSource: DataSource,
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

  async copy(id: Wish['id'], user: User) {
    const storedWish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    const isExistUsersWish = user.wishes.some(
      (wish) => wish.image === storedWish.image && wish.link === storedWish.link
    );

    if (isExistUsersWish || storedWish.owner.id === user.id) {
      throw new UnprocessableEntityException(
        specifyMessage('Вы не можете добавлять в вишлист свои подарки')
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      storedWish.copied += 1;

      const { copied, description, image, link, name, price, wishlists } =
        storedWish;

      const candidateWish = queryRunner.manager.create(Wish, {
        owner: user,
        copied,
        description,
        image,
        link,
        name,
        price,
        wishlists,
      });

      await queryRunner.manager.save(storedWish);
      const savedWish = await queryRunner.manager.save(candidateWish);
      await queryRunner.commitTransaction();

      return savedWish;
    } catch {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException(
        specifyMessage('Возникла непредвиденная ошибка')
      );
    } finally {
      await queryRunner.release();
    }
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
