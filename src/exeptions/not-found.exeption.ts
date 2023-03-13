import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundExeption extends HttpException {
  constructor(error: string) {
    super({ message: error }, HttpStatus.NOT_FOUND);
  }
}
