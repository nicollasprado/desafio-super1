import UserControllers from "@/modules/user/controllers";
import { Router } from "express";

const userRouter: Router = Router();

userRouter.post(
  "/",
  UserControllers.create.validate(),
  UserControllers.create.handle
);

export default userRouter;
