import { CommonColumns } from 'src/data-base/common.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishList } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends CommonColumns {
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
