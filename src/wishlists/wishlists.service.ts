import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { specifyMessage } from 'utils';
import { WishesService } from 'wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private wishesService: WishesService
  ) {}

  async createOne(createWishlistDto: CreateWishlistDto, user: User) {
    const items = await this.wishesService.findMany({
      where: { id: In(createWishlistDto.itemsId) },
    });

    if (items.length !== createWishlistDto.itemsId.length) {
      throw new BadRequestException(
        specifyMessage('Вы можете добавлять только существующие подарки')
      );
    }

    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      items,
      owner: user,
    });
    return this.wishlistsRepository.save(wishlist);
  }

  findOne(query: FindOneOptions<Wishlist>) {
    return this.wishlistsRepository.findOne(query);
  }

  findAll() {
    return this.wishlistsRepository.find({
      relations: { owner: true, items: true },
    });
  }

  async findOneById(wishlistId: Wishlist['id']) {
    const wishlist = await this.findOne({
      where: { id: wishlistId },
      relations: { owner: true, items: true },
    });

    if (wishlist === null) {
      throw new NotFoundException(specifyMessage('Коллекция не найдена'));
    }

    return wishlist;
  }
}
