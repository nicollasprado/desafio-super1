import { HttpException, HttpStatus } from '@nestjs/common';

export default class NotFoundException extends HttpException {
  constructor(entity: string) {
    super(`${entity} not found`, HttpStatus.NOT_FOUND);
  }
}
