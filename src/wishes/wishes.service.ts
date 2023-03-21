import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { isEmptyBody, roundToHundredths, specifyMessage } from 'utils';
import { CreateWishDto, UpdateWishDto } from './dto';
import { Wish } from './entities/wish.entity';
import { FIND_LAST_LIMIT, FIND_TOP_LIMIT } from './lib';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>
  ) {}

  async create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    createWishDto.price = roundToHundredths(createWishDto.price);
    return this.wishesRepository.save({ ...createWishDto, owner: user });
  }

  async findOne(
    ...query: Parameters<typeof this.wishesRepository.findOne>
  ): Promise<Wish> {
    const wish = await this.wishesRepository.findOne(...query);

    if (wish === null) {
      throw new NotFoundException(specifyMessage('Подарок не найден'));
    }
    return wish;
  }

  async findMany(...query: Parameters<typeof this.wishesRepository.find>) {
    return this.wishesRepository.find(...query);
  }

  async updateOne(...query: Parameters<typeof this.wishesRepository.save>) {
    return this.wishesRepository.save(...query);
  }

  async removeOne(...query: Parameters<typeof this.wishesRepository.remove>) {
    return this.wishesRepository.remove(...query);
  }

  async findOneById(id: Wish['id']) {
    return this.findOne({
      where: { id },
      relations: { owner: true, offers: { user: true } },
    });
  }

  async findLast() {
    return this.findMany({
      order: { createdAt: 'DESC' },
      take: FIND_LAST_LIMIT,
      relations: { owner: true },
    });
  }

  async findTop() {
    return this.findMany({
      order: { copied: 'DESC' },
      take: FIND_TOP_LIMIT,
      relations: { owner: true },
    });
  }

  async copyById(id: Wish['id'], user: User) {
    const storedWish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    const userWishes = await this.findMany({
      where: { owner: { id: user.id } },
      relations: { owner: true },
    });

    const alreadyInUserWishes = userWishes.some(
      (wish) => wish.image === storedWish.image && wish.link === storedWish.link
    );

    if (alreadyInUserWishes || storedWish.owner.id === user.id) {
      throw new UnprocessableEntityException(
        specifyMessage('Подарок уже есть в вашем вишлисте')
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

  async updateById(
    wishId: Wish['id'],
    updateWishDto: UpdateWishDto,
    user: User
  ) {
    if (isEmptyBody(updateWishDto)) {
      throw new BadRequestException(
        specifyMessage('Не указано ни одно параметра')
      );
    }

    const storedWish = await this.findOne({
      where: {
        id: wishId,
        owner: { id: user.id },
      },
      relations: { owner: true, offers: true },
    });

    if (updateWishDto.price && storedWish.raised !== 0) {
      throw new BadRequestException(
        specifyMessage(
          'Нельзя менять стоимость подарка, т.к. уже есть желающие скинуться на него'
        )
      );
    }

    const updatedWish = { ...storedWish, ...updateWishDto };

    if (updatedWish.price) {
      updatedWish.price = roundToHundredths(updatedWish.price);
    }

    return this.updateOne(updatedWish);
  }

  async removeById(wishId: Wish['id'], userId: User['id']) {
    const storedWish = await this.findOne({
      where: { id: wishId, owner: { id: userId } },
      relations: { owner: true, offers: true },
    });
    return this.removeOne(storedWish);
  }
}
