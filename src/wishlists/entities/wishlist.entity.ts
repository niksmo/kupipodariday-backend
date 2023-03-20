import { DatabaseTable } from 'data-source/database-table';
import { User } from 'users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Wish } from 'wishes/entities/wish.entity';

@Entity()
export class WishList extends DatabaseTable {
  @Column({ type: 'varchar', length: 250 })
  name: string;

  @Column({ type: 'text' })
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: Optional<User, 'password'>;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
