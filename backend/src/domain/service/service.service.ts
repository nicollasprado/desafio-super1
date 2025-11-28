import { Injectable } from '@nestjs/common';
import { TCreateServiceDTO } from './dtos/create-service.dto';
import prisma from 'src/infra/lib/prisma';
import AlreadyExistsException from 'src/shared/exceptions/already-exists.exception';
import IServiceDTO from './dtos/service.dto';
import UserService from '../user/user.service';
import { TProvideServiceDTO } from './dtos/provide-service.dto';
import NotFoundException from 'src/shared/exceptions/not-found-exception';
import { TGetAllProvided } from './dtos/get-all-provided-services.dto';
import { TContractServiceDTO } from './dtos/contract-service.dto';

@Injectable()
export default class ServiceService {
  constructor(private readonly userService: UserService) {}

  async create({ name }: TCreateServiceDTO): Promise<IServiceDTO> {
    const serviceExists = await prisma.service.findUnique({
      where: {
        name,
      },
    });

    if (serviceExists) {
      throw new AlreadyExistsException('service');
    }

    const newService = await prisma.service.create({
      data: {
        name,
      },
    });

    return newService;
  }

  async getAll(): Promise<IServiceDTO[]> {
    return await prisma.service.findMany();
  }

  async provide({
    description,
    providerId,
    schedules,
    serviceId,
    variants,
  }: TProvideServiceDTO) {
    await this.userService.findById(providerId);

    await this.getServiceById(serviceId);

    const existingProviderService = await prisma.providerService.findFirst({
      where: {
        providerId,
        serviceId,
        deletedAt: null,
      },
    });

    if (existingProviderService) {
      throw new AlreadyExistsException('provider service');
    }

    const newProviderService = await prisma.providerService.create({
      data: {
        description,
        providerId,
        serviceId,
        schedules: {
          create: schedules,
        },
        variants: {
          create: variants,
        },
      },
    });

    return newProviderService;
  }

  async getServiceById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('service');
    }

    return service;
  }

  async getProviderServiceById(id: string) {
    const providerService = await prisma.providerService.findUnique({
      where: { id, deletedAt: null },
    });

    if (!providerService) {
      throw new NotFoundException('provider service');
    }

    return providerService;
  }

  async getVariantById(id: string) {
    const variant = await prisma.variant.findUnique({
      where: { id, deletedAt: null },
    });

    if (!variant) {
      throw new NotFoundException('variant');
    }

    return variant;
  }

  async getAllProvided({ limit, page, serviceId, search }: TGetAllProvided) {
    const baseWhere = {
      deletedAt: null,
    };

    const where = serviceId
      ? { ...baseWhere, service: { id: serviceId } }
      : baseWhere;

    const totalCount = await prisma.providerService.count({ where });

    const offset = (page - 1) * limit;
    const providerServices = await prisma.providerService.findMany({
      where,
      take: limit,
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
        createdAt: true,
        providerId: true,
      },
    });

    return {
      data: providerServices,
      pagination: {
        totalCount,
        currentPage: page,
        perPage: limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async contract({ contractorId, date, variantId }: TContractServiceDTO) {
    await this.userService.findById(contractorId);

    const variant = await this.getVariantById(variantId);

    const newContractedService = await prisma.contractedService.create({
      data: {
        contractorId,
        variantId,
        date,
        status: 'WAITING_CONFIRMATION',
        total_price: variant.price,
      },
    });

    return newContractedService;
  }

  async deleteProvidedService(id: string) {
    const providerService = await this.getProviderServiceById(id);

    await prisma.providerService.update({
      where: { id: providerService.id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }

  async addProvidedServiceImage(providerServiceId: string, imageUrl: string) {
    const providerService =
      await this.getProviderServiceById(providerServiceId);

    const updatedProviderService = await prisma.providerService.update({
      where: { id: providerService.id, deletedAt: null },
      data: {
        imagesUrls: { push: imageUrl },
      },
    });

    return updatedProviderService;
  }
}
