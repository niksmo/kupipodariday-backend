import { TDatabaseTable } from 'data-source/database-table';
import { IOffer } from 'offers/entities/types';
import { IWish } from 'wishes/entities/types';
import { IWishlist } from 'wishlists/entities/types';

export interface IUser extends TDatabaseTable {
  username: string;
  about: string;
  avatar: string;
  email: string;
  password?: string;
  wishes: IWish[];
  offers: IOffer[];
  wishlists: IWishlist[];
}

export type TUserId = IUser['id'];
