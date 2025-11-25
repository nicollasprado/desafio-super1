import prisma from "@/lib/prisma";
import { validation } from "@/shared/middlewares/validation";
import { Request, Response } from "express";
import z from "zod";
import validator from "validator";

const reqQueryBody = z.object({
  page: z
    .string()
    .refine((val) => Number(val) >= 0, { error: "page must be >= 0" }),
  limit: z.string().refine(
    (val) => {
      const numVal = Number(val);
      return numVal >= 1 && numVal <= 30;
    },
    { error: "limit must be between 1 and 30" }
  ),
  serviceId: z
    .string()
    .refine((val) => validator.isUUID(val), { error: "ServiceId is not uuid" })
    .optional(),
  weekDay: z.string().refine(
    (val) => {
      const numVal = Number(val);
      return numVal >= 0 && numVal <= 6;
    },
    { error: "limit must be between 0 and 6" }
  ),
});
type TReqQuery = z.infer<typeof reqQueryBody>;

class GetAllProviderServiceController {
  validate() {
    return validation("query", reqQueryBody);
  }

  async handle(req: Request<any, any, any, TReqQuery>, res: Response) {
    const { limit, page, serviceId, weekDay } = req.query;

    const baseWhere = {
      deletedAt: null,
      provider: {
        deletedAt: null,
      },
    };

    let where: any = serviceId
      ? { ...baseWhere, service: { id: serviceId } }
      : baseWhere;

    where = weekDay
      ? { ...where, schedules: { some: { weekday: Number(weekDay) } } }
      : where;

    const totalCount = await prisma.providerService.count({ where });

    const offset = Number(page) * Number(limit);
    const providerServices = await prisma.providerService.findMany({
      where,
      take: Number(limit),
      skip: offset,
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

    return res.json({ data: providerServices, totalCount: totalCount });
  }
}

const getAllProviderServiceController = new GetAllProviderServiceController();

export default getAllProviderServiceController;
