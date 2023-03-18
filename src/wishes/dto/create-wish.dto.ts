import { IsNumber, IsUrl, Length } from 'class-validator';
import { specifyMessage } from 'utils';

export class CreateWishDto {
  @Length(
    1,
    250,
    specifyMessage('Название подарка должно быть от 1 до 250 символов')
  )
  readonly name: string;

  @IsUrl(undefined, specifyMessage('Неверная ссылка на подарок'))
  readonly link: string;

  @IsUrl(undefined, specifyMessage('Неверная ссылка на изображение подарка'))
  readonly image: string;

  @IsNumber(undefined, specifyMessage('Сумма подарка должна быть числом'))
  price: number;

  @Length(
    1,
    1024,
    specifyMessage('Описание подарка должно быть от 1 и до 1024 символов')
  )
  readonly description: string;
}
