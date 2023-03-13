import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { HASH_SALT } from 'const';

export async function hashPassword(createUserDto: CreateUserDto) {
  const hashedPassword = await bcrypt.hash(createUserDto.password, HASH_SALT);
  createUserDto.password = hashedPassword;
  return createUserDto;
}
