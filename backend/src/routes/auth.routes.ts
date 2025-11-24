import AuthControllers from "@/modules/auth/controllers";
import { Router } from "express";

const authRouter: Router = Router();

authRouter.post(
  "/login",
  AuthControllers.loginController.validate(),
  AuthControllers.loginController.handle
);

authRouter.get(
  "/refresh-tokens",
  AuthControllers.refreshTokensController.validate(),
  AuthControllers.refreshTokensController.handle
);

export default authRouter;
