import { IsUUID } from 'class-validator';

export class FindOneWishParams {
  @IsUUID()
  id: string;
}
