import { HttpException, HttpStatus } from '@nestjs/common';

export default class InUseException extends HttpException {
  constructor(param: string) {
    super(`${param} in use`, HttpStatus.BAD_REQUEST);
  }
}
