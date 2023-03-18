import { TDatabaseTable } from 'data-source/database-table';

type TRelation = 'owner' | 'offers' | 'wishLists';

type TRelationsType = { [key in TRelation]?: unknown } | unknown;

export type TWish<R extends TRelationsType = unknown> = TDatabaseTable & {
  name: string;
  link: string;
  image: string;
  price: number;
  description: string;
  raised: number;
  copied: number;
} & R;

export type TWishId = TWish['id'];
