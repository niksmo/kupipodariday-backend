import { TDatabaseTable } from 'data-source/database-table';
import { IOffer } from 'offers/entities/types';
import { IUser } from 'users/entities/types';
import { IWishlist } from 'wishlists/entities/types';

export interface IWish extends TDatabaseTable {
  name: string;
  link: string;
  image: string;
  price: number;
  description: string;
  raised: number;
  copied: number;
  owner?: IUser;
  offers?: IOffer[];
  wishlists?: IWishlist[];
}

export type TWishId = IWish['id'];
