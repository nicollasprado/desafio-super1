import z from "zod";
import validator from "validator";
import { validation } from "@/shared/middlewares/validation";
import { Request, Response } from "express";
import prisma from "@/lib/prisma";
import ProviderServiceNotFoundError from "@/shared/exceptions/ProviderServiceNotFoundError";

const reqParamsSchema = z.object({
  id: z
    .string()
    .refine((val) => validator.isUUID(val), { error: "Id must be uuid" }),
});

type TReqParams = z.infer<typeof reqParamsSchema>;

class GetOneProviderServiceController {
  validate() {
    return validation("params", reqParamsSchema);
  }

  async handle(req: Request<TReqParams>, res: Response) {
    const { id } = req.params;

    const providerService = await prisma.providerService.findUnique({
      where: {
        id,
      },
      include: {
        variants: {
          where: {
            deletedAt: null,
          },
          omit: {
            createdAt: true,
            deletedAt: true,
            updatedAt: true,
            providerServiceId: true,
          },
        },
        schedules: {
          where: {
            deletedAt: null,
          },
          omit: {
            createdAt: true,
            deletedAt: true,
            updatedAt: true,
            providerServiceId: true,
          },
        },
        service: true,
        provider: {
          omit: {
            phone: true,
            createdAt: true,
            deletedAt: true,
            email: true,
            password: true,
          },
        },
      },
      omit: {
        serviceId: true,
        updatedAt: true,
        deletedAt: true,
        providerId: true,
      },
    });

    if (!providerService) {
      throw new ProviderServiceNotFoundError("id", id);
    }

    return res.json(providerService);
  }
}

const getOneProviderServiceController = new GetOneProviderServiceController();

export default getOneProviderServiceController;
