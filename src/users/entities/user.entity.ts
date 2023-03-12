import { CommonColumns } from 'src/data-base/common.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishList } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class User extends CommonColumns {
  @Column({ type: 'varchar', length: 30, unique: true })
  userName: string;

  @Column({
    type: 'varchar',
    length: 200,
    default: 'Пока ничего не рассказал о себе',
  })
  about: string;

  @Column({ type: 'text', default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[]; // relation

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[]; // relation

  @OneToMany(() => WishList, (wishList) => wishList.owner)
  wishlists: WishList[]; // relation
}
