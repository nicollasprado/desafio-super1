import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import AuthService from './auth.service';
import extractTokenFromHeader from 'src/util/extractTokenFromHeader';
import InvalidTokenException from 'src/shared/exceptions/invalid-token.exception';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() data: SignInDto) {
    return await this.authService.signIn(data);
  }

  @Get('me')
  async me(@Req() req: Request) {
    const token = extractTokenFromHeader(req);

    if (!token) {
      throw new InvalidTokenException();
    }

    return await this.authService.describeMe(token);
  }
}
