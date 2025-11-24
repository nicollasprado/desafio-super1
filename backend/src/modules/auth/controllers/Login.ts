import prisma from "@/lib/prisma";
import PasswordMismatchError from "@/shared/exceptions/PasswordMismatchError";
import UserNotFoundError from "@/shared/exceptions/UserNotFoundError";
import ITokens from "@/shared/interface/ITokens";
import { validation } from "@/shared/middlewares/validation";
import JwtService from "@/shared/services/JwtService";
import setRefreshTokenCookie from "@/util/setRefreshTokenCookie";
import { compare } from "bcrypt";
import { Request, Response } from "express";
import z from "zod";

const reqBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

type TReqBody = z.infer<typeof reqBodySchema>;

class LoginController {
  validate() {
    return validation("body", reqBodySchema);
  }

  async handle(req: Request<any, any, TReqBody>, res: Response) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UserNotFoundError("email", email);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new PasswordMismatchError();
    }

    const tokens: ITokens = await JwtService.generateTokens();

    setRefreshTokenCookie(res, tokens.refreshToken);
    return res.json({ token: tokens.token });
  }
}

const loginController = new LoginController();

export default loginController;
