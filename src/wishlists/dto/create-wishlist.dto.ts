import { ArrayNotEmpty, IsUrl, Length } from 'class-validator';
import { specifyMessage } from 'utils';

export class CreateWishlistDto {
  @Length(
    1,
    250,
    specifyMessage('Название коллекции должно быть от 1 до 250 символов')
  )
  name: string;

  @IsUrl(undefined, specifyMessage('Неверная ссылка на картинку'))
  image: string;

  @ArrayNotEmpty(specifyMessage('Список подарков не может быть пустым'))
  itemsId: number[];
}
