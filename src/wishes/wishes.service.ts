import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { TWish, TWishId } from './entities/types';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishesRepository: Repository<Wish>
  ) {}

  create(createWishDto: CreateWishDto) {
    createWishDto.roundPrice();
    return this.wishesRepository.save(createWishDto);
  }

  findById(wishId: TWishId): Promise<TWish | null> {
    return this.wishesRepository.findOneBy({ id: wishId });
  }

  async updateById(
    wishId: TWishId,
    wish: Partial<TWish>
  ): Promise<TWish | null> {
    await this.wishesRepository.update(wishId, wish);
    return this.wishesRepository.findOneBy({ id: wishId });
  }

  deleteById(wishId: TWishId) {
    return this.wishesRepository.delete({ id: wishId });
  }
}
