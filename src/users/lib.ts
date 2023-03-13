import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { HASH_SALT } from 'const';

export async function hashPassword(createUserDto: CreateUserDto) {
  const hashedPassword = await bcrypt.hash(createUserDto.password, HASH_SALT);
  createUserDto.password = hashedPassword;
  return createUserDto;
}

export const USERNAME_PATTERN = /^[a-z\-_]{2,30}$/;

export const PASSWORD_PATTERN =
  // eslint-disable-next-line no-useless-escape
  /^[a-zA-Z0-9`~!@#$%^&*()_\-=+|[\]{}"':;?\/>\.<,]+$/;

export const EMAIL_PATTERN =
  /^[a-z0-9._%+-]{3,}@[a-z0-9-]+\.([a-z0-9-]+\.)*[a-z]{2,4}$/;
