import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
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
import { TGetAllContracted } from './dtos/get-all-contracted-services.dto';
import ServiceSearchService from '../search/service-search.service';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import CACHE_KEYS from 'src/shared/consts/CACHE_KEYS';

const GetProviderServiceSelect = {
  id: true,
  description: true,
  imagesUrls: true,
  service: {
    select: {
      id: true,
      name: true,
    },
  },
  provider: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
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
  schedules: {
    select: {
      id: true,
      weekday: true,
      start: true,
      end: true,
    },
  },
};

const GetContractedServiceSelect = {
  id: true,
  start: true,
  end: true,
  status: true,
  totalPrice: true,
  contractor: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
    },
  },
  variant: {
    select: {
      id: true,
      name: true,
      price: true,
      durationMinutes: true,
      providerService: {
        select: {
          id: true,
          description: true,
          service: {
            select: {
              id: true,
              name: true,
            },
          },
          provider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  },
};

@Injectable()
export default class ServiceService {
  constructor(
    private readonly userService: UserService,
    private readonly serviceSearchService: ServiceSearchService,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
  ) {}

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

    const newProviderService = await prisma.$transaction(async (prisma) => {
      const refinedVariants = variants.map((variant) => ({
        ...variant,
        price: variant.price * 100, // Convert to cents
      }));

      const newProviderService = await prisma.providerService.create({
        data: {
          description,
          providerId,
          serviceId,
          schedules: {
            create: schedules,
          },
          variants: {
            create: refinedVariants,
          },
        },
        select: GetProviderServiceSelect,
      });

      await this.serviceSearchService.indexProvidedService(
        newProviderService.id,
        newProviderService,
      );

      return newProviderService;
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

  async getAllProvided({
    limit,
    page,
    serviceId,
    search,
    providerId,
  }: TGetAllProvided) {
    const foundProvidedServices =
      await this.serviceSearchService.searchProvidedServices({
        search: search,
        serviceId,
        providerId,
        page,
        limit,
      });

    return foundProvidedServices;
  }

  async getAllContracted({
    limit,
    page,
    contractorId,
    providerId,
  }: TGetAllContracted) {
    return await this.serviceSearchService.searchContractedServices({
      contractorId,
      providerId,
      page,
      limit,
    });
  }

  async contract({ contractorId, start, variantId }: TContractServiceDTO) {
    await this.userService.findById(contractorId);

    const variant = await this.getVariantById(variantId);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + variant.durationMinutes);

    const newContractedService = await prisma.$transaction(async (prisma) => {
      const newContractedService = await prisma.contractedService.create({
        data: {
          contractorId,
          variantId,
          start,
          end,
          status: 'WAITING_CONFIRMATION',
          totalPrice: variant.price,
        },
        select: GetContractedServiceSelect,
      });

      await this.serviceSearchService.indexContractedService(
        newContractedService.id,
        newContractedService,
      );

      return newContractedService;
    });

    const cacheKey = `${CACHE_KEYS.PROVIDER_SERVICE_AVAILABILITY}:${newContractedService.variant.providerService.id}`;

    const avaiabilityCached =
      await this.cacheService.get<TAvailabilityDTO>(cacheKey);

    if (avaiabilityCached) {
      await this.cacheService.del(cacheKey);
    }

    return newContractedService;
  }

  async deleteProvidedService(id: string) {
    const providerService = await this.getProviderServiceById(id);

    await prisma.$transaction(async (prisma) => {
      await prisma.providerService.update({
        where: { id: providerService.id, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      await this.serviceSearchService.removeProvidedServiceIndex(
        providerService.id,
      );
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

    await this.serviceSearchService.updateProvidedServiceImages(
      providerServiceId,
      updatedProviderService.imagesUrls,
    );

    return updatedProviderService;
  }

  async getAvailability(providerServiceId: string) {
    const cacheKey = `${CACHE_KEYS.PROVIDER_SERVICE_AVAILABILITY}:${providerServiceId}`;

    const avaiabilityCached =
      await this.cacheService.get<TAvailabilityDTO>(cacheKey);

    if (avaiabilityCached) {
      return avaiabilityCached;
    }

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
          status: { in: ['SCHEDULED', 'ONGOING'] },
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

    await this.cacheService.set(cacheKey, availability, 0);

    return availability;
  }

  async acceptContract(contractedServiceId: string, authorId: string) {
    const contractedService = await prisma.contractedService.findUnique({
      where: { id: contractedServiceId, deletedAt: null },
      include: {
        variant: {
          include: {
            providerService: true,
          },
        },
      },
    });

    if (!contractedService) {
      throw new NotFoundException('contracted service');
    }

    if (contractedService.variant.providerService.providerId !== authorId) {
      throw new ForbiddenException();
    }

    const updatedContractedService = await prisma.$transaction(
      async (prisma) => {
        const updatedContractedService = await prisma.contractedService.update({
          where: { id: contractedService.id, deletedAt: null },
          data: {
            status: 'SCHEDULED',
          },
          select: GetContractedServiceSelect,
        });

        await this.serviceSearchService.updateContractedServiceStatus(
          updatedContractedService.id,
          updatedContractedService.status,
        );
      },
    );

    return updatedContractedService;
  }
}
