import prisma from "@/lib/prisma";
import ServiceAlreadyExistsError from "@/shared/exceptions/ServiceAlreadyExistsError";
import { validation } from "@/shared/middlewares/validation";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import z from "zod";

const reqBodySchema = z.object({
  name: z.string(),
});

type TReqBody = z.infer<typeof reqBodySchema>;

class CreateService {
  validate() {
    return validation("body", reqBodySchema);
  }

  async handle(req: Request<any, any, TReqBody>, res: Response) {
    const { name } = req.body;

    const serviceExists = await prisma.service.findUnique({
      where: {
        name,
      },
    });

    if (serviceExists) {
      throw new ServiceAlreadyExistsError(name);
    }

    const newService = await prisma.service.create({
      data: {
        name,
      },
    });

    return res.status(StatusCodes.CREATED).json({ name });
  }
}

const createService = new CreateService();

export default createService;
