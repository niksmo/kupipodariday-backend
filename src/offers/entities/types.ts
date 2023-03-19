import { TDatabaseTable } from 'data-source/database-table';
import { IUser } from 'users/entities/types';
import { IWish } from 'wishes/entities/types';

export interface IOffer extends TDatabaseTable {
  user: IUser;
  item: IWish;
  amount: number;
  hidden: boolean;
}
