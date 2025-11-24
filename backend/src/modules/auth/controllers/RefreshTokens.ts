import { validation } from "@/shared/middlewares/validation";
import JwtService from "@/shared/services/JwtService";
import { Request, Response } from "express";
import z from "zod";

const reqHeadersSchema = z.object({
  authorization: z.string(),
});

class RefreshTokensController {
  validate() {
    return validation("headers", reqHeadersSchema);
  }

  async handle(req: Request, res: Response) {
    const authorization = req.headers.authorization;

    const [_, token] = authorization!.split("Bearer ");

    const tokens = await JwtService.refreshTokens(token);

    return res.json(tokens);
  }
}

const refreshTokensController = new RefreshTokensController();

export default refreshTokensController;
