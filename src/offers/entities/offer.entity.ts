import { CommonColumns } from 'data-base/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { Wish } from 'wishes/entities/wish.entity';

@Entity()
export class Offer extends CommonColumns {
  @ManyToOne(() => User, (user) => user.offers)
  user: User; // relation

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish; // relation

  @Column({ type: 'numeric', precision: 9, scale: 2 })
  amount: number;

  @Column({ type: 'boolean', default: 'false' })
  hidden: boolean;
}
