import { TDatabaseTable } from 'data-source/database-table';

type TRelation = 'wishes' | 'offers' | 'wishlists';

type TRelationsType = { [key in TRelation]?: unknown } | unknown;

export type TUser<R extends TRelationsType = unknown> = TDatabaseTable & {
  username: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
} & R;

export type TUserId = TUser['id'];
