import createProviderServiceController from "@/modules/service/controllers/CreateProviderService";
import createServiceController from "@/modules/service/controllers/CreateService";
import deleteProviderServiceController from "@/modules/service/controllers/DeleteProviderService";
import { Router } from "express";

const serviceRouter: Router = Router();

serviceRouter.post(
  "/",
  createServiceController.validate(),
  createServiceController.handle
);

serviceRouter.post(
  "/provider",
  createProviderServiceController.validate(),
  createProviderServiceController.handle
);

serviceRouter.delete(
  "/provider/:id",
  deleteProviderServiceController.validate(),
  deleteProviderServiceController.handle
);

export default serviceRouter;
