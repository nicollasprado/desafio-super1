import ExpiredTokenError from "../exceptions/ExpiredTokenError";
import InvalidTokenError from "../exceptions/InvalidTokenError";
import ITokens from "../interface/ITokens";
import { JWTPayload, jwtVerify, SignJWT } from "jose";

export default class JwtService {
  private static ALG = "HS256";
  private static SECRET = new TextEncoder().encode(process.env.SECRET_KEY);

  static async generateTokens(): Promise<ITokens> {
    const token = await new SignJWT()
      .setProtectedHeader({ alg: JwtService.ALG })
      .setIssuedAt()
      .setExpirationTime("15min")
      .sign(JwtService.SECRET);

    const refreshToken = await new SignJWT()
      .setProtectedHeader({ alg: JwtService.ALG })
      .setIssuedAt()
      .setExpirationTime("7days")
      .sign(JwtService.SECRET);

    return { token, refreshToken };
  }

  static async verifyToken(token: string): Promise<JWTPayload> {
    try {
      const { payload } = await jwtVerify(token, JwtService.SECRET);

      if (!payload) {
        throw new InvalidTokenError();
      }

      return payload;
    } catch (err: any) {
      if (err?.name === "JWTExpired") {
        throw new ExpiredTokenError();
      }

      throw err;
    }
  }

  static async refreshTokens(token: string): Promise<ITokens> {
    await JwtService.verifyToken(token);
    return await JwtService.generateTokens();
  }
}
