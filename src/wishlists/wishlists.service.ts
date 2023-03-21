import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { isEmptyBody, specifyMessage } from 'utils';
import { Wish } from 'wishes/entities/wish.entity';
import { WishesService } from 'wishes/wishes.service';
import { CreateWishlistDto, UpdateWishlistDto } from './dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private wishesService: WishesService
  ) {}

  async create(createWishlistDto: CreateWishlistDto, user: User) {
    const storedItems = await this.wishesService.findMany({
      where: { id: In(createWishlistDto.itemsId), owner: { id: user.id } },
    });

    if (storedItems.length !== createWishlistDto.itemsId.length) {
      throw new BadRequestException(
        specifyMessage('Вы можете добавлять только существующие подарки')
      );
    }

    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      items: storedItems,
      owner: user,
    });
    return this.wishlistsRepository.save(wishlist);
  }

  async findOne(
    ...query: Parameters<typeof this.wishlistsRepository.findOne>
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne(...query);

    if (wishlist === null) {
      throw new NotFoundException(specifyMessage('Коллекция не найдена'));
    }

    return wishlist;
  }

  async updateOne(...query: Parameters<typeof this.wishlistsRepository.save>) {
    return this.wishlistsRepository.save(...query);
  }

  async removeOne(
    ...query: Parameters<typeof this.wishlistsRepository.remove>
  ) {
    return this.wishlistsRepository.remove(...query);
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      relations: { owner: true, items: true },
    });
  }

  async findOneById(wishlistId: Wishlist['id']) {
    const wishlist = await this.findOne({
      where: { id: wishlistId },
      relations: { owner: true, items: true },
    });

    return wishlist;
  }

  async updateOneById(
    wishlistId: Wishlist['id'],
    updateWishlistDto: UpdateWishlistDto,
    user: User
  ) {
    if (isEmptyBody(updateWishlistDto)) {
      throw new BadRequestException(
        specifyMessage('Не указано ни одно параметра')
      );
    }

    const storedWishlist = await this.findOne({
      where: { id: wishlistId, owner: { id: user.id } },
      relations: { owner: true, items: true },
    });

    let storedItems: Wish[] | undefined;

    const { itemsId, ...restUpdateWishlistDto } = updateWishlistDto;

    if (itemsId) {
      storedItems = await this.wishesService.findMany({
        where: { id: In(itemsId), owner: { id: user.id } },
      });

      if (storedItems.length !== itemsId.length) {
        throw new BadRequestException(
          specifyMessage('Вы можете добавлять только существующие подарки')
        );
      }
    }

    const updatedWishlist = { ...storedWishlist, ...restUpdateWishlistDto };

    if (storedItems) {
      updatedWishlist.items = storedItems;
    }

    return this.updateOne(updatedWishlist);
  }

  async removeOneById(wishlistId: Wishlist['id'], user: User) {
    const wishlist = await this.findOne({
      where: { id: wishlistId, owner: { id: user.id } },
      relations: { owner: true, items: true },
    });

    return this.removeOne(wishlist);
  }
}
