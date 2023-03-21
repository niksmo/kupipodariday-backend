import { IsNumber, IsOptional, IsUrl, Length } from 'class-validator';
import { specifyMessage } from 'utils';

export class UpdateWishDto {
  @Length(
    1,
    250,
    specifyMessage('Название подарка должно быть от 1 до 250 символов')
  )
  @IsOptional()
  readonly name: string;

  @IsUrl(undefined, specifyMessage('Неверная ссылка на подарок'))
  @IsOptional()
  readonly link: string;

  @IsUrl(undefined, specifyMessage('Неверная ссылка на изображение подарка'))
  @IsOptional()
  readonly image: string;

  @IsNumber(undefined, specifyMessage('Сумма подарка должна быть числом'))
  @IsOptional()
  price: number;

  @Length(
    1,
    1024,
    specifyMessage('Описание подарка должно быть от 1 и до 1024 символов')
  )
  @IsOptional()
  readonly description: string;
}
