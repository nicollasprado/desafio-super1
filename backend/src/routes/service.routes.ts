import createService from "@/modules/service/CreateService";
import { Router } from "express";

const serviceRouter: Router = Router();

serviceRouter.post("/", createService.validate(), createService.handle);

export default serviceRouter;
