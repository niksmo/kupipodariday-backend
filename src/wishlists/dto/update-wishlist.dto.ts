import { ArrayNotEmpty, IsOptional, IsUrl, Length } from 'class-validator';
import { specifyMessage } from 'utils';

export class UpdateWishlistDto {
  @IsOptional()
  @Length(
    1,
    250,
    specifyMessage('Название коллекции должно быть от 1 до 250 символов')
  )
  name?: string;

  @IsOptional()
  @IsUrl(undefined, specifyMessage('Неверная ссылка на картинку'))
  image?: string;

  @IsOptional()
  @ArrayNotEmpty(specifyMessage('Список подарков не может быть пустым'))
  itemsId?: number[];
}
