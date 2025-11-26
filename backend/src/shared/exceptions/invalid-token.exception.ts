import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidTokenException extends HttpException {
  constructor() {
    super('Invalid jwt token', HttpStatus.UNAUTHORIZED);
  }
}
