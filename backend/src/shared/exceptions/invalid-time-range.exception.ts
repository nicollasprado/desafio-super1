import { HttpException, HttpStatus } from '@nestjs/common';

export default class InvalidTimeRangeException extends HttpException {
  constructor() {
    super('Invalid time range', HttpStatus.BAD_REQUEST);
  }
}
