import z from "zod";
import validator from "validator";
import { validation } from "@/shared/middlewares/validation";
import { Request, Response } from "express";
import prisma from "@/lib/prisma";
import { ServiceSchedule } from "~/prisma/generated/client";

const reqBodySchema = z.object({
  contractorId: z.string().refine((val) => validator.isUUID(val), {
    error: "contractorId must be UUID",
  }),
  serviceVariantId: z.string().refine((val) => validator.isUUID(val), {
    error: "serviceVariantId must be UUID",
  }),
  providerServiceId: z.string().refine((val) => validator.isUUID(val), {
    error: "providerServiceId must be UUID",
  }),
  schedules: z.array(
    z.object({
      serviceScheduleId: z.string().refine((val) => validator.isUUID(val), {
        error: "serviceScheduleId must be UUID",
      }),
      startTime: z.string(),
    })
  ),
});

type TReqBody = z.infer<typeof reqBodySchema>;

class CreateContractedServiceController {
  validate() {
    return validation("body", reqBodySchema);
  }

  async handle(req: Request<any, any, TReqBody>, res: Response) {
    const { contractorId, schedules, providerServiceId, serviceVariantId } =
      req.body;

    const schedulesOrdered: ServiceSchedule[] = [];

    const serviceSchedules = await prisma.serviceSchedule.findMany({
      where: {
        providerService: {
          id: providerServiceId,
          deletedAt: null,
        },
        deletedAt: null,
      },
    });

    serviceSchedules.forEach((sched) => {
      const index = sched.weekday;
      schedulesOrdered[index] = sched;
    });

    const refinedSchedules = schedules.map((schedule) => {});
  }
}
