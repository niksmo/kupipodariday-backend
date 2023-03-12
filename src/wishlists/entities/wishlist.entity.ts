import { CommonColumns } from 'src/data-base/common.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class WishList extends CommonColumns {
  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'text' })
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User; // relation

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[]; // relation
}
