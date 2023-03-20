import { IsBoolean, IsNumber } from 'class-validator';

export class AddOfferDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  amount: number;

  @IsBoolean()
  hidden: boolean;
}
