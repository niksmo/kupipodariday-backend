import { HttpException, HttpStatus } from '@nestjs/common';

export class KeyDuplicateExeption extends HttpException {
  constructor(error: string) {
    super({ message: error }, HttpStatus.CONFLICT);
  }
}
