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
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { SignInDto } from './dtos/sign-in.dto';
import AuthService from './auth.service';
import extractTokenFromHeader from 'src/shared/util/extractTokenFromHeader';
import InvalidTokenException from 'src/shared/exceptions/invalid-token.exception';
import type { Request, Response } from 'express';
import extractTokenFromCookies from 'src/shared/util/extractTokenFromCookies';
import { ConfigService } from '@nestjs/config';

@ApiTags('Autenticação')
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

  @ApiOperation({
    summary: 'Login de usuário',
    description: 'Realiza autenticação e retorna token JWT',
  })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        expiresIn: 3600,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
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

  @ApiOperation({
    summary: 'Obter dados do usuário autenticado',
    description: 'Retorna informações do usuário logado',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'joao.silva@email.com',
        firstName: 'João',
        lastName: 'Silva',
        phone: '+5511987654321',
        avatarUrl: 'https://i.pravatar.cc/300?img=1',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido ou ausente' })
  @Get('me')
  async me(@Req() req: Request) {
    const token = extractTokenFromHeader(req);

    if (!token) {
      throw new InvalidTokenException();
    }

    return await this.authService.describeMe(token);
  }

  @ApiOperation({
    summary: 'Renovar token JWT',
    description: 'Gera novo token usando refresh token do cookie',
  })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso',
    schema: {
      example: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        expiresIn: 3600,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido ou ausente',
  })
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

  @ApiOperation({
    summary: 'Logout',
    description: 'Remove refresh token do cookie',
  })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
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
