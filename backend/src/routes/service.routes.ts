import createProviderService from "@/modules/service/CreateProviderService";
import createService from "@/modules/service/CreateService";
import { Router } from "express";

const serviceRouter: Router = Router();

serviceRouter.post("/", createService.validate(), createService.handle);
serviceRouter.post(
  "/provider",
  createProviderService.validate(),
  createProviderService.handle
);

export default serviceRouter;
