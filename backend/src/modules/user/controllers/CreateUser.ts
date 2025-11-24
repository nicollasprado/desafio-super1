import z from "zod";
import validator from "validator";
import { Request, Response } from "express";
import { validation } from "@/shared/middlewares/validation";
import prisma from "@/lib/prisma";
import EmailInUseError from "@/shared/exceptions/EmailInUseError";
import hashPassword from "@/util/hashPassword";
import { StatusCodes } from "http-status-codes";
import PhoneInUseError from "@/shared/exceptions/PhoneInUseError";

const reqBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string().refine(validator.isMobilePhone).optional(),
  password: z.string().refine(validator.isStrongPassword),
});

type TReqBody = z.infer<typeof reqBodySchema>;

class CreateUserController {
  validate() {
    return validation("body", reqBodySchema);
  }

  async handle(req: Request<any, any, TReqBody>, res: Response) {
    const { email, firstName, lastName, phone, password } = req.body;

    const emailInUse = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailInUse) {
      throw new EmailInUseError(email);
    }

    if (phone) {
      const phoneInUse = await prisma.user.findUnique({
        where: {
          phone,
        },
      });

      if (phoneInUse) {
        throw new PhoneInUseError(phone);
      }
    }

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone ? phone : null,
        password: await hashPassword(password),
      },
    });

    return res.status(StatusCodes.CREATED).json({
      firstName,
      lastName,
      email,
      phone,
      createdAt: newUser.createdAt,
    });
  }
}

const createUserController = new CreateUserController();

export default createUserController;
