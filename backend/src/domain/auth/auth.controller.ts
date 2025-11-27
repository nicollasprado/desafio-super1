import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import AuthService from './auth.service';
import extractTokenFromHeader from 'src/shared/util/extractTokenFromHeader';
import InvalidTokenException from 'src/shared/exceptions/invalid-token.exception';
import type { Request, Response } from 'express';
import extractTokenFromCookies from 'src/shared/util/extractTokenFromCookies';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private readonly jwtRefreshExpirationTimeInMs: number;
  private readonly refreshTokenCookieOptions: object;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.jwtRefreshExpirationTimeInMs =
      this.configService.get<number>('JWT_REFRESH_EXPIRATION_TIME')! * 1000;

    this.refreshTokenCookieOptions = {
      httpOnly: true,
      maxAge: this.jwtRefreshExpirationTimeInMs,
      sameSite: 'lax',
      path: '/',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, refreshToken, expiresIn } =
      await this.authService.signIn(data);

    if (data.rememberMe) {
      res.cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);
    }

    return { token, expiresIn };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const token = extractTokenFromHeader(req);

    if (!token) {
      throw new InvalidTokenException();
    }

    return await this.authService.describeMe(token);
  }

  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = extractTokenFromCookies(req);

    if (!token) {
      throw new InvalidTokenException();
    }

    const {
      token: newToken,
      refreshToken,
      expiresIn,
    } = await this.authService.refresh(token);

    res.cookie('refresh_token', refreshToken, this.refreshTokenCookieOptions);

    return { token: newToken, expiresIn };
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh_token');

    res.cookie('refresh_token', '', {
      ...this.refreshTokenCookieOptions,
      maxAge: 0,
    });

    return;
  }
}
