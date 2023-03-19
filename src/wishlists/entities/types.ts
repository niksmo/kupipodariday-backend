import { TDatabaseTable } from 'data-source/database-table';
import { IUser } from 'users/entities/types';
import { IWish } from 'wishes/entities/types';

export interface IWishlist extends TDatabaseTable {
  name: string;
  image: string;
  owner?: IUser;
  items?: IWish[];
}

export type TWishlistId = IWishlist['id'];
