import { DatabaseTable } from 'data-source/database-table';
import { Offer } from 'offers/entities/offer.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { WishList } from 'wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends DatabaseTable {
  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'text' })
  link: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'numeric', precision: 9, scale: 2 })
  price: number;

  @Column({ type: 'numeric', precision: 9, scale: 2 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User; // relation

  @Column({ type: 'varchar', length: 1024 })
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[]; // relation

  @ManyToMany(() => WishList, (wishList) => wishList.items)
  wishLists: WishList[]; // additional relation

  @Column({ type: 'int' })
  copied: number; // relation ? or calc from some table?
}
