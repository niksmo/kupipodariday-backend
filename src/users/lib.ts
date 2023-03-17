import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

export async function hashPassword(
  createUserDto: CreateUserDto,
  saltOrRounds: string | number
): Promise<CreateUserDto> {
  if (createUserDto.password) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds
    );
    createUserDto.password = hashedPassword;
  }
  return createUserDto;
}

export function compareWithHash(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export const USERNAME_PATTERN = /^[a-z\-_]{2,30}$/;

export const PASSWORD_PATTERN =
  // eslint-disable-next-line no-useless-escape
  /^[a-zA-Z0-9`~!@#$%^&*()_\-=+|[\]{}"':;?\/>\.<,]+$/;

export const EMAIL_PATTERN =
  /^[a-z0-9._%+-]{3,}@[a-z0-9-]+\.([a-z0-9-]+\.)*[a-z]{2,4}$/;
