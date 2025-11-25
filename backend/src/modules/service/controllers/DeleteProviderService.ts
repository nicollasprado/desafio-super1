import prisma from "@/lib/prisma";
import ProviderServiceNotFoundError from "@/shared/exceptions/ProviderServiceNotFoundError";
import { validation } from "@/shared/middlewares/validation";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";

const reqParamsSchema = z.object({
  id: z.string(),
});

type TReqParams = z.infer<typeof reqParamsSchema>;

class DeleteProviderServiceController {
  validate() {
    return validation("params", reqParamsSchema);
  }

  async handle(req: Request<TReqParams>, res: Response) {
    const { id } = req.params;

    const providerService = await prisma.providerService.findUnique({
      where: {
        id,
      },
    });

    if (!providerService) {
      throw new ProviderServiceNotFoundError("id", id);
    }

    const now = new Date();
    await prisma.providerService.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: now,
      },
    });

    return res.status(StatusCodes.NO_CONTENT).send();
  }
}

const deleteProviderServiceController = new DeleteProviderServiceController();

export default deleteProviderServiceController;
