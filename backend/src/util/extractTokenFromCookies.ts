import { Request } from 'express';
import InvalidTokenException from 'src/shared/exceptions/invalid-token.exception';

const extractTokenFromCookies = (req: Request): string | undefined => {
  const refreshToken = req.cookies.refresh_token as string;

  if (!refreshToken) {
    throw new InvalidTokenException();
  }

  return refreshToken;
};

export default extractTokenFromCookies;
