import { DatabaseTable } from 'data-source/database-table';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Wish } from 'wishes/entities/wish.entity';

@Entity()
export class Offer extends DatabaseTable {
  @ManyToOne(() => User, (user) => user.offers)
  user: User; // relation

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish; // relation

  @Column({ type: 'real' })
  amount: number;

  @Column({ type: 'boolean', default: 'false' })
  hidden: boolean;
}
