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

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'varchar', length: 1024 })
  description: string;

  @Column({ type: 'real', default: 0 })
  raised: number;

  @Column({ type: 'int', default: 0 })
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: Optional<User, 'password'>;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => WishList, (wishList) => wishList.items)
  wishlists: WishList[];
}
