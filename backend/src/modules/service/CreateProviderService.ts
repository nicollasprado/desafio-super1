import prisma from "@/lib/prisma";
import UserNotFoundError from "@/shared/exceptions/UserNotFoundError";
import { validation } from "@/shared/middlewares/validation";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const reqBodySchema = z.object({
  description: z.string(),
  providerId: z.string(),
  serviceId: z.string(),
  variants: z
    .array(
      z.object({
        name: z.string(),
        price: z.number().positive(),
        durationMinutes: z.number().positive(),
      })
    )
    .min(1),
  schedules: z
    .array(
      z
        .object({
          weekday: z.number().min(0).max(6),
          startTime: z
            .string()
            .regex(timeRegex, "Invalid time format, expected HH:MM"),
          endTime: z
            .string()
            .regex(timeRegex, "Invalid time format, expected HH:MM"),
        })
        .superRefine((obj, ctx) => {
          const toMinutes = (s: string) => {
            const [hh, mm] = s.split(":").map(Number);
            return hh * 60 + mm;
          };

          try {
            const start = toMinutes(obj.startTime);
            const end = toMinutes(obj.endTime);
            if (end <= start) {
              ctx.addIssue({
                code: "custom",
                message: "endTime must be after startTime",
                path: ["endTime"],
              });
            }
          } catch (e) {}
        })
    )
    .min(1),
});

type TReqBodySchema = z.infer<typeof reqBodySchema>;

class CreateProviderService {
  validate() {
    return validation("body", reqBodySchema);
  }

  async handle(req: Request<any, any, TReqBodySchema>, res: Response) {
    const { description, providerId, schedules, serviceId, variants } =
      req.body;

    const userExists = await prisma.user.findUnique({
      where: {
        id: providerId,
      },
    });

    if (!userExists || userExists.deletedAt !== null) {
      throw new UserNotFoundError("id", providerId);
    }

    const schedulesForDb = schedules.map((s) => {
      const [sh, sm] = s.startTime.split(":").map(Number);
      const [eh, em] = s.endTime.split(":").map(Number);
      const start = new Date(Date.UTC(1970, 0, 1, sh, sm, 0));
      const end = new Date(Date.UTC(1970, 0, 1, eh, em, 0));
      return {
        weekday: s.weekday,
        startTime: start,
        endTime: end,
      };
    });

    const newProviderService = await prisma.providerService.create({
      data: {
        description,
        providerId,
        serviceId,
        variants: {
          createMany: { data: variants },
        },
        schedules: {
          createMany: { data: schedulesForDb },
        },
      },
      include: {
        variants: true,
        schedules: true,
      },
    });

    return res.status(StatusCodes.CREATED).json(newProviderService);
  }
}

const createProviderService = new CreateProviderService();

export default createProviderService;
