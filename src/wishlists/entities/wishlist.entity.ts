import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { DatabaseTable } from 'data-source';
import { User } from 'users/entities/user.entity';
import { Wish } from 'wishes/entities/wish.entity';

@Entity()
export class Wishlist extends DatabaseTable {
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
