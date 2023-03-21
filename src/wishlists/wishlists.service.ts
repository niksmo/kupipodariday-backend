import {
  BadRequestException,
  ForbiddenException,
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

  async createOne(createWishlistDto: CreateWishlistDto, user: User) {
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

  async findAll() {
    return this.wishlistsRepository.find({
      relations: { owner: true, items: true },
    });
  }

  async findOneById(wishlistId: Wishlist['id']) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: { owner: true, items: true },
    });

    if (wishlist === null) {
      throw new NotFoundException(specifyMessage('Коллекция не найдена'));
    }

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

    const storedWishlist = await this.findOneById(wishlistId);

    const isOwner = storedWishlist.owner.id === user.id;

    let storedItems: Wish[] | undefined;

    if (!isOwner) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужие коллекции'
      );
    }

    const { itemsId, ...restUpdateWishlistDto } = updateWishlistDto;

    if (itemsId) {
      storedItems = await this.wishesService.findMany({
        where: { id: In(updateWishlistDto.itemsId), owner: { id: user.id } },
      });

      if (storedItems.length !== updateWishlistDto.itemsId.length) {
        throw new BadRequestException(
          specifyMessage('Вы можете добавлять только существующие подарки')
        );
      }
    }

    const updatedWishlist = { ...storedWishlist, ...restUpdateWishlistDto };

    if (storedItems) {
      updatedWishlist.items = storedItems;
    }

    return this.wishlistsRepository.save(updatedWishlist);
  }

  async deleteOneById(wishlistId: Wishlist['id'], user: User) {
    const wishlist = await this.findOneById(wishlistId);

    const isOwner = wishlist.owner.id === user.id;

    if (!isOwner) {
      throw new ForbiddenException('Вы не можете удалять чужие коллекции');
    }

    this.wishlistsRepository.delete({ id: wishlistId });

    return wishlist;
  }
}
