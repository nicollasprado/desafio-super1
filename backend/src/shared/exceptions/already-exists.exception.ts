import { HttpException, HttpStatus } from '@nestjs/common';

export default class AlreadyExistsException extends HttpException {
  constructor(param: string) {
    super(`${param} already exists`, HttpStatus.CONFLICT);
  }
}
