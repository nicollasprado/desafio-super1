import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import InvalidTokenException from 'src/shared/exceptions/invalid-token.exception';
import IJwtPayload from './dtos/jwt-payload.dto';
import extractTokenFromHeader from 'src/util/extractTokenFromHeader';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = configService.get<string>('JWT_SECRET')!;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (!token) {
      throw new InvalidTokenException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token, {
        secret: this.jwtSecret,
      });

      request['user'] = payload;
    } catch {
      throw new InvalidTokenException();
    }
    return true;
  }
}
