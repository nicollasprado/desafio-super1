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
import { TAvailabilityDTO } from './dtos/availability.dto';

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
      include: {
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        schedules: {
          select: {
            id: true,
            weekday: true,
            start: true,
            end: true,
          },
        },
        variants: {
          select: {
            id: true,
            name: true,
            price: true,
            durationMinutes: true,
          },
        },
      },
      omit: {
        deletedAt: true,
        updatedAt: true,
        providerId: true,
        serviceId: true,
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
            updatedAt: true,
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

  async contract({ contractorId, start, variantId }: TContractServiceDTO) {
    await this.userService.findById(contractorId);

    const variant = await this.getVariantById(variantId);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + variant.durationMinutes);

    const newContractedService = await prisma.contractedService.create({
      data: {
        contractorId,
        variantId,
        start,
        end,
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

  async getAvailability(providerServiceId: string) {
    const providerService = await prisma.providerService.findUnique({
      where: { id: providerServiceId, deletedAt: null },
      include: {
        schedules: true,
        variants: true,
      },
    });

    if (!providerService) {
      throw new NotFoundException('provider service');
    }

    const variantsIds = providerService.variants.map((variant) => variant.id);

    const nextThirtyDatesContractedServices =
      await prisma.contractedService.findMany({
        where: {
          deletedAt: null,
          variantId: { in: variantsIds },
          status: 'SCHEDULED',
          start: { gte: new Date() },
        },
      });

    if (!nextThirtyDatesContractedServices) {
      throw new NotFoundException('contracted services');
    }

    const weekdayAvailability: Record<
      number,
      { startTime: Date; endTime: Date }
    > = {};

    providerService.schedules.forEach((schedule) => {
      const weekday = Number(schedule.weekday);

      const startTime = new Date(schedule.start);
      const endTime = new Date(schedule.end);

      weekdayAvailability[weekday] = {
        startTime,
        endTime,
      };
    });

    const availability: TAvailabilityDTO = {};

    const getDateKey = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const getTimeKey = (date: Date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };

    const addAllInUseStarts = (dateKey: string, start: Date, end: Date) => {
      const availabilityItem = availability[dateKey];

      if (!availabilityItem) return;

      const thirtyMinutesInMs = 1000 * 60 * 30;
      const thirtyMinutesQtd = Math.ceil(
        (end.getTime() - start.getTime()) / thirtyMinutesInMs,
      );

      for (let i = 0; i < thirtyMinutesQtd; i++) {
        const contractedStart = new Date(
          start.getTime() + i * thirtyMinutesInMs,
        );
        const timeString = getTimeKey(contractedStart);

        availabilityItem.contractedStarts[timeString] = false;
      }
    };

    const fillMissingStarts = (date: Date, startTime: Date, endTime: Date) => {
      const dateKey = getDateKey(date);
      const availabilityItem = availability[dateKey];

      if (!availabilityItem) return;

      const thirtyMinutesInMs = 1000 * 60 * 30;
      const thirtyMinutesQtd = Math.ceil(
        (endTime.getTime() - startTime.getTime()) / thirtyMinutesInMs,
      );

      for (let i = 0; i < thirtyMinutesQtd; i++) {
        const slotTime = new Date(startTime.getTime() + i * thirtyMinutesInMs);
        const timeKey = getTimeKey(slotTime);

        if (availabilityItem.contractedStarts[timeKey] === undefined) {
          availabilityItem.contractedStarts[timeKey] = true;
        }
      }
    };

    Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      date.setHours(0, 0, 0, 0);

      const dateKey = getDateKey(date);
      const weekday = date.getDay();
      const daySchedule = weekdayAvailability[weekday];

      if (!daySchedule) return;

      if (!availability[dateKey]) {
        availability[dateKey] = {
          day: date.getDate(),
          weekDay: date
            .toLocaleDateString('pt-BR', { weekday: 'short' })
            .split('.')[0],
          month: date
            .toLocaleDateString('pt-BR', { month: 'short' })
            .split('.')[0],
          date: dateKey,
          contractedStarts: {},
        };
      }

      fillMissingStarts(date, daySchedule.startTime, daySchedule.endTime);
    });

    nextThirtyDatesContractedServices.forEach((contractedService) => {
      const start = new Date(contractedService.start);
      const end = new Date(contractedService.end);
      const dateKey = getDateKey(start);

      if (!availability[dateKey]) {
        availability[dateKey] = {
          day: start.getDate(),
          weekDay: start
            .toLocaleDateString('pt-BR', { weekday: 'short' })
            .split('.')[0],
          month: start
            .toLocaleDateString('pt-BR', { month: 'short' })
            .split('.')[0],
          date: dateKey,
          contractedStarts: {},
        };
      }

      addAllInUseStarts(dateKey, start, end);
    });

    return availability;
  }
}
