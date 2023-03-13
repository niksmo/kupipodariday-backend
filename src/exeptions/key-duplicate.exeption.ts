import { HttpException, HttpStatus } from '@nestjs/common';

export class KeyDuplicateExeption extends HttpException {
  constructor(error: string | Record<string, string>) {
    super(error, HttpStatus.CONFLICT);
  }
}
