import AuthControllers from "@/modules/auth/controllers";
import { Router } from "express";

const authRouter: Router = Router();

authRouter.post(
  "/login",
  AuthControllers.loginController.validate(),
  AuthControllers.loginController.handle
);

export default authRouter;
