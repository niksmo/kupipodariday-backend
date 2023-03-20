import { DatabaseTable } from 'data-source/database-table';
import { Offer } from 'offers/entities/offer.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Wish } from 'wishes/entities/wish.entity';
import { Wishlist } from 'wishlists/entities/wishlist.entity';

@Entity()
export class User extends DatabaseTable {
  @Column({ type: 'varchar', length: 30, unique: true })
  username: string;

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
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
