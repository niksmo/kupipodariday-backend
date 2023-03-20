import { IsString } from 'class-validator';

export class FindUsersDto {
  @IsString()
  readonly query: string;
}
