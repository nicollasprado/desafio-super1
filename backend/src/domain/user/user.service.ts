import { Injectable } from '@nestjs/common';
import prisma from 'src/infra/lib/prisma';
import InUseException from 'src/shared/exceptions/in-use.exception';
import hashPassword from 'src/shared/util/hashPassword';
import { TCreateUserDto } from './dtos/create-user.dto';
import { TUserDTO } from './dtos/user.dto';
import NotFoundException from 'src/shared/exceptions/not-found-exception';
import { User } from 'prisma/generated/client';

@Injectable()
export default class UserService {
  async create({
    email,
    firstName,
    lastName,
    password,
    phone,
  }: TCreateUserDto): Promise<TUserDTO> {
    const emailInUse = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (emailInUse) {
      throw new InUseException('email');
    }

    if (phone) {
      const phoneInUse = await prisma.user.findUnique({
        where: {
          phone,
        },
      });

      if (phoneInUse) {
        throw new InUseException('phone');
      }
    }

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: await hashPassword(password),
      },
      omit: {
        password: true,
        createdAt: true,
        deletedAt: true,
        updatedAt: true,
      },
    });

    return newUser;
  }

  async findDetailedByEmail(email: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException('user');
    }

    return user;
  }

  async findById(id: string): Promise<TUserDTO> {
    const user = await prisma.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
      omit: {
        password: true,
        createdAt: true,
        deletedAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('user');
    }

    return user;
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<TUserDTO> {
    await this.findById(userId);

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
        deletedAt: null,
      },
      data: {
        avatarUrl,
      },
      omit: {
        password: true,
        createdAt: true,
        deletedAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}
