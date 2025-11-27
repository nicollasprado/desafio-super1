import { Injectable } from '@nestjs/common';
import { TSignInDTO } from './dtos/sign-in.dto';
import { compare } from 'bcrypt';
import InvalidCredentialsException from 'src/shared/exceptions/invalid-credentials.exception';
import UserService from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import IJwtPayload from './dtos/jwt-payload.dto';
import IUserDetailsDTO from './dtos/user-details.dto';
import InvalidTokenException from 'src/shared/exceptions/invalid-token.exception';

@Injectable()
export default class AuthService {
  private jwtExpirationTimeInSeconds: number;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtExpirationTimeInSeconds = +this.configService.get<number>(
      'JWT_EXPIRATION_TIME',
    )!;
  }

  async signIn({ email, password }: TSignInDTO) {
    const user = await this.userService.findDetailedByEmail(email);

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
    }

    const payload = { sub: user.id, email: user.email };

    const token = this.jwtService.sign(payload);

    return { token, expiresIn: this.jwtExpirationTimeInSeconds };
  }

  async describeMe(token: string): Promise<IUserDetailsDTO> {
    const payload: IJwtPayload = this.jwtService.verify(token);

    if (!payload || !payload.sub) {
      throw new InvalidTokenException();
    }

    const user = await this.userService.findById(payload.sub);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
